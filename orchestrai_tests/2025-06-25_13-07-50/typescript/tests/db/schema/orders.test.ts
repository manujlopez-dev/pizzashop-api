```typescript
import { describe, expect, it } from '@jest/globals';
import { orders } from '../../../src/db/schema/orders';
import { and, eq, gt } from 'drizzle-orm';

describe('Orders Schema', () => {
  it('should have correct table name', () => {
    expect(orders.name).toBe('orders');
  });

  describe('Schema Columns', () => {
    it('should have correct id column configuration', () => {
      const idColumn = orders.id;
      expect(idColumn.name).toBe('id');
      expect(idColumn.dataType).toBe('serial');
      expect(idColumn.primaryKey).toBe(true);
    });

    it('should have correct customer_id column configuration', () => {
      const customerIdColumn = orders.customer_id;
      expect(customerIdColumn.name).toBe('customer_id');
      expect(customerIdColumn.dataType).toBe('integer');
      expect(customerIdColumn.notNull).toBe(true);
    });

    it('should have correct status column with enum values', () => {
      const statusColumn = orders.status;
      expect(statusColumn.name).toBe('status');
      expect(statusColumn.dataType).toBe('text');
      expect(statusColumn.enum).toContain('pending');
      expect(statusColumn.enum).toContain('completed');
      expect(statusColumn.enum).toContain('cancelled');
    });

    it('should have correct total_amount column configuration', () => {
      const totalAmountColumn = orders.total_amount;
      expect(totalAmountColumn.name).toBe('total_amount');
      expect(totalAmountColumn.dataType).toBe('decimal');
      expect(totalAmountColumn.notNull).toBe(true);
    });
  });

  describe('Complex Query Scenarios', () => {
    it('should generate correct SQL for order filtering by status and amount', () => {
      const query = orders.select()
        .where(
          and(
            eq(orders.status, 'pending'),
            gt(orders.total_amount, 50.00)
          )
        );
      
      const sql = query.toSQL().sql;
      expect(sql).toContain('WHERE');
      expect(sql).toContain('"status" = $1');
      expect(sql).toContain('"total_amount" > $2');
    });

    it('should handle complex joins with related tables', () => {
      const query = orders
        .select()
        .leftJoin('order_items', eq(orders.id, 'order_items.order_id'))
        .where(eq(orders.customer_id, 1));

      const sql = query.toSQL().sql;
      expect(sql).toContain('LEFT JOIN');
      expect(sql).toContain('order_items');
      expect(sql).toContain('WHERE');
    });
  });

  describe('Data Validation', () => {
    it('should enforce status enum values', () => {
      expect(() => {
        orders.status.parse('invalid_status');
      }).toThrow();

      expect(orders.status.parse('pending')).toBe('pending');
      expect(orders.status.parse('completed')).toBe('completed');
      expect(orders.status.parse('cancelled')).toBe('cancelled');
    });
  });
});
```

These test files provide comprehensive coverage for the schema definitions with complex use cases including:

1. Column configuration validation
2. Foreign key relationships
3. Complex query building
4. Data type validation
5. Enum value validation
6. SQL generation testing
7. Join operations
8. Complex filtering scenarios

The tests cover:
- Basic schema structure
- Column properties and constraints
- Data type validations
- Foreign key relationships
- Complex query building
- SQL generation
- Join operations
- Filtering scenarios
- Enum validations

Each test file follows best practices:
- Proper describe blocks for organization
- Detailed test descriptions
- Multiple assertion points
- Error case handling
- Complex query testing
- Relationship testing

Would you like me to generate additional test files or add more complex scenarios to the existing ones?