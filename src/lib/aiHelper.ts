import { GoogleGenerativeAI } from '@google/generative-ai';
import { SegmentRule } from './segmentCompiler';

// Local Fallback Parser for Natural Language Segment Generation
function localSegmentParser(prompt: string): { rules: SegmentRule[]; name: string; description: string; sqlString: string } {
  const normalized = prompt.toLowerCase();
  const rules: SegmentRule[] = [];
  const filtersDescs: string[] = [];

  // 1. Total Spent check
  let spentMatch = normalized.match(/(?:spent|spent more than|spent over|spent >)\s*(?:\$|usd)?\s*(\d+)/i);
  if (spentMatch) {
    const val = parseFloat(spentMatch[1]);
    rules.push({ field: 'totalSpent', operator: 'gte', value: val });
    filtersDescs.push(`Total Spent >= $${val}`);
  } else {
    spentMatch = normalized.match(/(?:spent less than|spent under|spent <)\s*(?:\$|usd)?\s*(\d+)/i);
    if (spentMatch) {
      const val = parseFloat(spentMatch[1]);
      rules.push({ field: 'totalSpent', operator: 'lte', value: val });
      filtersDescs.push(`Total Spent <= $${val}`);
    }
  }

  // 2. Last Purchase Days check
  const purchaseMatch = normalized.match(/(?:ordered|purchased|bought|active in the last|last)\s*(\d+)\s*days/i);
  if (purchaseMatch) {
    const days = parseInt(purchaseMatch[1]);
    const recent = !normalized.includes("haven't") && !normalized.includes("not");
    if (recent) {
      rules.push({ field: 'lastPurchaseDays', operator: 'lte', value: days });
      filtersDescs.push(`Purchased in the last ${days} days`);
    } else {
      rules.push({ field: 'lastPurchaseDays', operator: 'gte', value: days });
      filtersDescs.push(`Has NOT purchased in the last ${days} days`);
    }
  }

  // 3. Preferred Category check
  const categories = ['Apparel', 'Footwear', 'Accessories', 'Electronics', 'Lifestyle'];
  for (const cat of categories) {
    if (normalized.includes(cat.toLowerCase())) {
      rules.push({ field: 'preferredCategory', operator: 'equals', value: cat });
      filtersDescs.push(`Preferred Category is ${cat}`);
      break;
    }
  }

  // 4. Newsletter Subscription check
  if (normalized.includes('newsletter') || normalized.includes('subscribe')) {
    const unsub = normalized.includes('unsubscribed') || normalized.includes('not subscribed');
    rules.push({ field: 'newsletterSubscribed', operator: 'equals', value: !unsub });
    filtersDescs.push(unsub ? 'Not subscribed to newsletter' : 'Subscribed to newsletter');
  }

  // 5. Order Count check
  const orderMatch = normalized.match(/(?:ordered|order count|orders|purchases)\s*(?:>=|>|at least)\s*(\d+)/i);
  if (orderMatch) {
    const val = parseInt(orderMatch[1]);
    rules.push({ field: 'orderCount', operator: 'gte', value: val });
    filtersDescs.push(`Order Count >= ${val}`);
  }

  // Default fallback if no rules identified
  if (rules.length === 0) {
    rules.push({ field: 'totalSpent', operator: 'gte', value: 0 });
    filtersDescs.push('All Customers');
  }

  const name = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
  const description = `AI Segment generated based on: "${prompt}". Applied filters: ${filtersDescs.join(', ')}.`;
  
  // Format readable query simulation
  const sqlString = `SELECT * FROM Customers WHERE ` + rules.map(r => {
    if (r.field === 'totalSpent') return `totalSpent ${r.operator === 'gte' ? '>=' : '<='} ${r.value}`;
    if (r.field === 'lastPurchaseDays') return `lastPurchaseDate ${r.operator === 'lte' ? '>=' : '<'} DATE_SUB(NOW(), INTERVAL ${r.value} DAY)`;
    if (r.field === 'preferredCategory') return `JSON_EXTRACT(customFields, '$.preferredCategory') = '${r.value}'`;
    if (r.field === 'newsletterSubscribed') return `JSON_EXTRACT(customFields, '$.newsletterSubscribed') = ${r.value}`;
    if (r.field === 'orderCount') return `(SELECT COUNT(*) FROM Orders WHERE Orders.customerId = Customers.id) >= ${r.value}`;
    return '';
  }).join(' AND ');

  return { rules, name, description, sqlString };
}

// Local Fallback Copywriter
function localCopywriter(objective: string, channel: string): string {
  const normObj = objective.toLowerCase();
  
  if (channel === 'whatsapp') {
    if (normObj.includes('discount') || normObj.includes('offer') || normObj.includes('sale')) {
      return `Hi {{firstName}}! 🌟 Special offer just for you! Get 20% off our bestseller collection. Use code XENO20 at checkout. Click here: https://xeno.shop/offer`;
    }
    if (normObj.includes('winback') || normObj.includes('miss') || normObj.includes('haven\'t')) {
      return `Hey {{firstName}}! We haven't seen you in a while. 🥺 We miss you! Here's a $10 voucher just for you to shop your favorites: https://xeno.shop/welcome-back`;
    }
    return `Hi {{firstName}}! 😊 We have some fresh items matching your interests in stock! Take a peek here: https://xeno.shop/new`;
  }

  if (channel === 'sms') {
    if (normObj.includes('discount') || normObj.includes('offer') || normObj.includes('sale')) {
      return `Hi {{firstName}}, enjoy 20% off your next purchase with code XENO20! Shop now: https://xeno.shop/offer`;
    }
    return `Hi {{firstName}}, check out our new arrivals matching your taste! Browse catalog: https://xeno.shop/new`;
  }

  if (channel === 'email') {
    if (normObj.includes('discount') || normObj.includes('offer') || normObj.includes('sale')) {
      return `Subject: {{firstName}}, 20% OFF just for you! 🎁

Dear {{firstName}},

We wanted to thank you for being a valued shopper! Since you've spent {{totalSpent}} with us, we wanted to treat you to an exclusive 20% discount on your next order.

Use promo code **XENO20** at checkout.

Shop now: https://xeno.shop/offer

Warm regards,
The Brand Team`;
    }
    return `Subject: {{firstName}}, check out our latest arrivals! ✨

Dear {{firstName}},

We have just restocked our customer favorites and wanted you to be the first to know.

Browse the new selection here: https://xeno.shop/new

Warm regards,
The Brand Team`;
  }

  // RCS channel
  return `Hello {{firstName}}! 💫 New arrivals matching your preferences are in. Tap below to buy: https://xeno.shop/new`;
}

// AI Functions with Gemini integration
export async function generateSegmentFromPrompt(prompt: string, apiKey?: string): Promise<{ rules: SegmentRule[]; name: string; description: string; sqlString: string }> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    console.log('[AI Helper] Using local fallback segment parser');
    return localSegmentParser(prompt);
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert SQL and CRM segmentation bot. Convert this user segmentation request into a JSON object containing:
      1. rules: Array of segment rules. Each rule MUST look like:
         - { "field": "totalSpent", "operator": "gte" | "lte", "value": number }
         - { "field": "lastPurchaseDays", "operator": "gte" | "lte", "value": number } (gte means "has not ordered in X days", lte means "has ordered within X days")
         - { "field": "preferredCategory", "operator": "equals", "value": "Apparel" | "Footwear" | "Accessories" | "Electronics" | "Lifestyle" }
         - { "field": "newsletterSubscribed", "operator": "equals", "value": boolean }
         - { "field": "orderCount", "operator": "gte" | "lte", "value": number }
      2. name: A short, catchy name for the segment (max 30 chars).
      3. description: A clear description of who this segment contains.
      4. sqlString: A simulated SQL SELECT query representing these filters.

      User request: "${prompt}"

      Respond ONLY with valid JSON structure matching the schema. Do not wrap in markdown blocks like \`\`\`json. Just return raw JSON.`
        }]
      }]
    });

    const resultText = response.response.text();
    if (!resultText) throw new Error('Empty response from Gemini');
    
    // Clean any potential markdown format blocks
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err: any) {
    console.error('[AI Segment Parser Error] Falling back to local parser:', err.message);
    return localSegmentParser(prompt);
  }
}

export async function generateMessageCopy(objective: string, channel: string, apiKey?: string): Promise<{ messageTemplate: string }> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    console.log('[AI Helper] Using local fallback copywriter');
    return { messageTemplate: localCopywriter(objective, channel) };
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert copywriter. Generate a marketing campaign template message for a shopper on the channel "${channel}".
      The marketing objective is: "${objective}".
      
      You MUST use these placeholders to personalize the message:
      - {{firstName}} (customer's first name)
      - {{lastName}} (customer's last name)
      - {{totalSpent}} (customer's historical total spend amount)
      - {{email}} (customer's email address)
      - {{phone}} (customer's phone number)
      
      Keep channel constraints in mind:
      - SMS: Short, direct, clear call-to-action (under 160 characters).
      - WhatsApp: Personal, emoji-rich, warm tone, clear discount code or link.
      - RCS: Engaging, concise, button-friendly.
      - Email: Include a Subject line at the very beginning starting with "Subject: ...", followed by a body.

      Return ONLY the final message template text. Do not wrap it in JSON or markdown blocks. Just return the raw text.`
        }]
      }]
    });

    const resultText = response.response.text();
    if (!resultText) throw new Error('Empty response from Gemini');
    
    return { messageTemplate: resultText.trim() };
  } catch (err: any) {
    console.error('[AI Copywriter Error] Falling back to local copywriter:', err.message);
    return { messageTemplate: localCopywriter(objective, channel) };
  }
}

// AI Marketing Copilot Chat
export async function getCopilotResponse(
  userMsg: string,
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
  apiKey?: string
): Promise<{ reply: string; action?: { type: string; payload: any } }> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  
  if (!key) {
    const norm = userMsg.toLowerCase();
    let reply = `I am your AI CRM assistant! I can help you segment shoppers or draft campaign copies. Try telling me:
- *"Draft a WhatsApp message for a fashion discount sale"*
- *"Find customers who have spent more than $150"*
- *"Create a segment for inactive users"*`;

    let action: any = null;

    if (norm.includes('spent') || norm.includes('customer') || norm.includes('segment') || norm.includes('find')) {
      const parsed = localSegmentParser(userMsg);
      reply = `I've analyzed your intent and compiled segment rules!
      
**Segment Name**: ${parsed.name}
**Description**: ${parsed.description}
**Simulated SQL**: \`${parsed.sqlString}\`

Would you like me to create this segment for you in the CRM?`;
      action = {
        type: 'suggest_segment',
        payload: parsed
      };
    } else if (norm.includes('draft') || norm.includes('write') || norm.includes('message') || norm.includes('campaign')) {
      const channel = norm.includes('email') ? 'email' : norm.includes('sms') ? 'sms' : norm.includes('rcs') ? 'rcs' : 'whatsapp';
      const copy = localCopywriter(userMsg, channel);
      reply = `I have drafted a marketing template for your **${channel.toUpperCase()}** campaign:

\`\`\`
${copy}
\`\`\`

Would you like to load this into the campaign composer?`;
      action = {
        type: 'suggest_campaign_copy',
        payload: { channel, template: copy }
      };
    }

    return { reply, action };
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Combine history for simple generation since chats API can be version-specific
    const systemPrompt = `You are a helpful CRM campaign assistant. You are chat-first.
    Your goals are:
    1. Help marketers search/segment customers.
    2. Help marketers write and structure personalized campaign templates.
    3. Help marketers create campaigns.

    If the user describes a segment they want to make (e.g. "Create a segment for high value users who spend > 200"), return a JSON action payload as part of your response so the front-end can execute it.
    
    If the user asks to write a message (e.g. "Draft a WhatsApp text offering a voucher"), return a JSON action payload for the template copy.
    
    To output actions, place them at the very end of your response inside a block like:
    :::ACTION:::{"type": "suggest_segment" | "suggest_campaign_copy", "payload": <action_object>}:::END:::

    Action schemas:
    - "suggest_segment": { "name": string, "description": string, "rules": [{ "field": string, "operator": string, "value": any }] }
    - "suggest_campaign_copy": { "channel": "whatsapp"|"sms"|"email"|"rcs", "template": string }
    
    Keep your main text response conversational and formatted in markdown.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    // Format chat history for model prompt
    const formattedPrompt = [
      ...chatHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.parts[0].text}`),
      `User: ${userMsg}`,
      `Assistant:`
    ].join('\n\n');

    const result = await model.generateContent(formattedPrompt);
    const text = result.response.text();
    if (!text) throw new Error('Empty response from Gemini');

    // Parse actions if any
    let reply = text;
    let action: any = null;
    const match = text.match(/:::ACTION:::(.*?):::END:::/s);
    
    if (match) {
      reply = text.replace(/:::ACTION:::.*?:::END:::/gs, '').trim();
      try {
        action = JSON.parse(match[1].trim());
      } catch (e) {
        console.error('Failed to parse chat action JSON:', e);
      }
    }

    return { reply, action };
  } catch (err: any) {
    console.error('[Copilot Chat Error] Falling back to local responder:', err.message);
    return getCopilotResponse(userMsg, [], undefined); // run local fallback
  }
}
