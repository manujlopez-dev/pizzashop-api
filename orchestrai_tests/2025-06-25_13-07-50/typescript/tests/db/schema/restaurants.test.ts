```typescript
import { describe, expect, it } from '@jest/globals';
import { restaurants } from '../../../src/db/schema/restaurants';
import { sql } from 'drizzle-orm';

describe('Restaurant Schema', () => {
  it('should have correct table name', () => {
    expect(restaurants.name).toBe('restaurants');
  });

  describe('Schema Columns', () => {
    it('should have correct id column configuration', () => {
      const idColumn = restaurants.id;
      expect(idColumn.name).toBe('id');
      expect(idColumn.dataType).toBe('serial');
      expect(idColumn.primaryKey).toBe(true);
    });

    it('should have correct name column configuration', () => {
      const nameColumn = restaurants.name;
      expect(nameColumn.name).toBe('name');
      expect(nameColumn.dataType).toBe('text');
      expect(nameColumn.notNull).toBe(true);
    });

    it('should have correct address column configuration', () => {
      const addressColumn = restaurants.address;
      expect(addressColumn.name).toBe('address');
      expect(addressColumn.dataType).toBe('text');
      expect(addressColumn.notNull).toBe(true);
    });

    it('should have correct created_at column with default value', () => {
      const createdAtColumn = restaurants.created_at;
      expect(createdAtColumn.name).toBe('created_at');
      expect(createdAtColumn.dataType).toBe('timestamp');
      expect(createdAtColumn.default).toBeDefined();
    });
  });
});
```