```typescript
import { describe, expect, it } from '@jest/globals';
import { products } from '../../../src/db/schema/products';
import { eq } from 'drizzle-orm';

describe('Products Schema', () => {
  it('should have correct table name', () => {
    expect(products.name).toBe('products');
  });

  describe('Schema Columns', () => {
    it('should have correct id column configuration', () => {
      const idColumn = products.id;
      expect(idColumn.name).toBe('id');
      expect(idColumn.dataType).toBe('serial');
      expect(idColumn.primaryKey).toBe(true);
    });

    it('should have correct name column configuration', () => {
      const nameColumn = products.name;
      expect(nameColumn.name).toBe('name');
      expect(nameColumn.dataType).toBe('text');
      expect(nameColumn.notNull).toBe(true);
    });

    it('should have correct price column configuration', () => {
      const priceColumn = products.price;
      expect(priceColumn.name).toBe('price');
      expect(priceColumn.dataType).toBe('decimal');
      expect(priceColumn.notNull).toBe(true);
    });

    it('should have correct restaurant_id as foreign key', () => {
      const restaurantIdColumn = products.restaurant_id;
      expect(restaurantIdColumn.name).toBe('restaurant_id');
      expect(restaurantIdColumn.dataType).toBe('integer');
      expect(restaurantIdColumn.foreignKey).toBeDefined();
    });
  });

  describe('Complex Queries', () => {
    it('should generate correct SQL for product filtering', () => {
      const query = products.select().where(eq(products.restaurant_id, 1));
      expect(query.toSQL().sql).toContain('WHERE "restaurant_id" = $1');
    });
  });
});
```