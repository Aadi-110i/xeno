import { Prisma } from '@prisma/client';

export interface SegmentRule {
  field: 'totalSpent' | 'lastPurchaseDays' | 'preferredCategory' | 'newsletterSubscribed' | 'orderCount';
  operator: 'gte' | 'lte' | 'equals' | 'not_equals';
  value: any;
}

export function compileSegmentToPrisma(rules: SegmentRule[]): Prisma.CustomerWhereInput {
  const where: Prisma.CustomerWhereInput = {};

  for (const rule of rules) {
    const { field, operator, value } = rule;

    if (field === 'totalSpent') {
      const val = parseFloat(value);
      if (isNaN(val)) continue;

      if (operator === 'gte') {
        where.totalSpent = { ...((where.totalSpent as any) || {}), gte: val };
      } else if (operator === 'lte') {
        where.totalSpent = { ...((where.totalSpent as any) || {}), lte: val };
      } else if (operator === 'equals') {
        where.totalSpent = val;
      }
    } 
    
    else if (field === 'lastPurchaseDays') {
      const days = parseInt(value);
      if (isNaN(days)) continue;

      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - days);

      if (operator === 'lte') {
        // Purchased within last X days (at least one order in the range)
        where.orders = {
          some: {
            purchaseDate: { gte: dateLimit }
          }
        };
      } else if (operator === 'gte') {
        // Has not purchased in the last X days (no orders in the range)
        where.orders = {
          none: {
            purchaseDate: { gte: dateLimit }
          }
        };
      }
    } 
    
    else if (field === 'orderCount') {
      const count = parseInt(value);
      if (isNaN(count)) continue;

      // Note: In Prisma/SQLite, directly filtering by aggregate count of relation (orders count)
      // inside `where` is not natively supported directly without grouping or raw SQL.
      // However, we can handle it dynamically or filter programmatically, or do a subquery.
      // To keep it clean, we'll write a post-query filter or handle it in client logic.
      // For compiling, we won't add it to standard Prisma `where` but we'll apply it in our resolver.
    } 
    
    else if (field === 'preferredCategory') {
      if (operator === 'equals') {
        where.customFields = {
          contains: `"preferredCategory":"${value}"`
        };
      }
    } 
    
    else if (field === 'newsletterSubscribed') {
      const isSubscribed = value === true || value === 'true';
      where.customFields = {
        contains: `"newsletterSubscribed":${isSubscribed}`
      };
    }
  }

  return where;
}

// Function to apply rules that Prisma cannot query natively (like orderCount or complex checks)
export function filterCustomersByRules(customers: any[], rules: SegmentRule[]): any[] {
  return customers.filter(customer => {
    for (const rule of rules) {
      const { field, operator, value } = rule;

      if (field === 'orderCount') {
        const count = parseInt(value);
        if (isNaN(count)) continue;
        
        const actualCount = customer.orders ? customer.orders.length : 0;
        
        if (operator === 'gte' && !(actualCount >= count)) return false;
        if (operator === 'lte' && !(actualCount <= count)) return false;
        if (operator === 'equals' && !(actualCount === count)) return false;
      }
    }
    return true;
  });
}
