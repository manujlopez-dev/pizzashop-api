```typescript
import { describe, expect, it } from '@jest/globals';
import { orders } from '../../../../src/db/schema/orders';
import { sql } from 'drizzle-orm';

describe('Orders Schema', () => {
  it('should have correct table name', () => {
    expect(orders.name).toBe('orders');
  });

  it('should have required columns', () => {
    const columns = Object.keys(orders);
    
    expect(columns).toContain('id');
    expect(columns).toContain('restaurantId');
    expect(columns).toContain('status');
    expect(columns).toContain('createdAt');
  });

  it('should have correct column types', () => {
    expect(orders.id.dataType).toBe('serial');
    expect(orders.restaurantId.dataType).toBe('integer');
    expect(orders.status.dataType).toBe('varchar');
  });
});
```