```typescript
import { describe, expect, it } from '@jest/globals';
import { orders } from '../../../src/db/schema/orders';
import { sql } from 'drizzle-orm';

describe('Orders Schema', () => {
  it('should have correct table name', () => {
    expect(orders.name).toBe('orders');
  });

  it('should have required columns', () => {
    const columnNames = Object.keys(orders);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('customerId');
    expect(columnNames).toContain('status');
    expect(columnNames).toContain('createdAt');
  });
});
```