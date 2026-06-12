const http = require('http');

const PORT = 3001;

// Helper to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

// Helper to make an HTTP POST request (webhook callback)
function sendWebhook(url, payload, attempt = 1) {
  const data = JSON.stringify(payload);
  const parsedUrl = new URL(url);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Clean success log
    } else {
      console.error(`[Webhook Error] logId=${payload.logId}, status=${payload.status}, responseCode=${res.statusCode}`);
      retryWebhook(url, payload, attempt);
    }
  });

  req.on('error', (err) => {
    console.error(`[Webhook Network Error] logId=${payload.logId}, status=${payload.status}, error=${err.message}`);
    retryWebhook(url, payload, attempt);
  });

  req.write(data);
  req.end();
}

function retryWebhook(url, payload, attempt) {
  if (attempt >= 3) {
    console.error(`[Webhook Max Retries Reached] logId=${payload.logId}, status=${payload.status}`);
    return;
  }
  const delay = attempt * 2000; // Exponential backoff (2s, 4s)
  setTimeout(() => {
    sendWebhook(url, payload, attempt + 1);
  }, delay);
}

// Simulates the user journey and sends status updates back to the CRM
function simulateCommunicationLifecycle(messageItem) {
  const { logId, recipient, message, channel, campaignId, callbackUrl } = messageItem;
  
  // 1. Initial State: Sent is handled instantly by CRM run endpoint
  
  // 2. Transition to DELIVERED or FAILED (1.2 - 2 seconds later, randomized delay)
  const deliveryDelay = 1200 + Math.random() * 800;
  setTimeout(() => {
    const isSuccessful = Math.random() > 0.08; // 92% success rate
    if (!isSuccessful) {
      sendWebhook(callbackUrl, {
        logId,
        campaignId,
        status: 'failed',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Deliver successfully
    sendWebhook(callbackUrl, {
      logId,
      campaignId,
      status: 'delivered',
      timestamp: new Date().toISOString()
    });

    // 3. Transition to OPENED (2 - 4 seconds later, 65% open rate)
    const openDelay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      const isOpened = Math.random() > 0.35;
      if (!isOpened) return;

      sendWebhook(callbackUrl, {
        logId,
        campaignId,
        status: 'opened',
        timestamp: new Date().toISOString()
      });

      // 4. Transition to CLICKED (2 - 4 seconds later, 40% click rate)
      const clickDelay = 2000 + Math.random() * 2000;
      setTimeout(() => {
        const isClicked = Math.random() > 0.60;
        if (!isClicked) return;

        sendWebhook(callbackUrl, {
          logId,
          campaignId,
          status: 'clicked',
          timestamp: new Date().toISOString()
        });

        // 5. Transition to CONVERTED (purchase) (3 - 5 seconds later, 20% conversion rate)
        const conversionDelay = 3000 + Math.random() * 2000;
        setTimeout(() => {
          const isConverted = Math.random() > 0.80;
          if (!isConverted) return;

          const items = [
            { name: 'Ergonomic Canvas Backpack', price: 75.00, quantity: 1, category: 'Accessories' },
            { name: 'Classic Leather Sneakers', price: 89.99, quantity: 1, category: 'Footwear' },
            { name: 'Minimalist Cotton T-Shirt', price: 24.99, quantity: 2, category: 'Apparel' },
            { name: 'Polarized Sunglasses', price: 110.00, quantity: 1, category: 'Accessories' }
          ];
          const chosenItem = items[Math.floor(Math.random() * items.length)];
          const orderAmount = chosenItem.price * chosenItem.quantity;

          sendWebhook(callbackUrl, {
            logId,
            campaignId,
            status: 'converted',
            timestamp: new Date().toISOString(),
            purchase: {
              amount: orderAmount,
              items: [chosenItem]
            }
          });
        }, conversionDelay);

      }, clickDelay);

    }, openDelay);

  }, deliveryDelay);
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    sendJSON(res, 200, { status: 'online', service: 'Channel Service Stub' });
    return;
  }

  if (req.url === '/send' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { messages, callbackUrl } = payload;
        
        if (!Array.isArray(messages) || !callbackUrl) {
          sendJSON(res, 400, { error: 'Invalid body format. Expected { messages: [...], callbackUrl: string }' });
          return;
        }

        console.log(`[Batch Received] Processing ${messages.length} messages. Webhook destination: ${callbackUrl}`);
        
        // Immediately return 202 Accepted
        sendJSON(res, 202, { status: 'accepted', message: `Queued ${messages.length} messages for delivery simulation.` });

        // Process messages asynchronously in the background, staggered by 100ms each to prevent DB write lock contention
        messages.forEach((msg, idx) => {
          const staggerDelay = idx * 100;
          setTimeout(() => {
            simulateCommunicationLifecycle({
              ...msg,
              callbackUrl
            });
          }, staggerDelay);
        });
      } catch (err) {
        console.error('[Error processing send request]', err);
        sendJSON(res, 400, { error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  // Not Found
  sendJSON(res, 404, { error: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`Stubbed Channel Service running on port ${PORT}`);
});
