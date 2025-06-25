```typescript
import { describe, expect, it } from '@jest/globals';
import { products } from '../../../src/db/schema/products';

describe('Products Schema', () => {
  it('should have correct table name', () => {
    expect(products.name).toBe('products');
  });

  it('should have required columns', () => {
    const columnNames = Object.keys(products);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('name');
    expect(columnNames).toContain('description');
    expect(columnNames).toContain('price');
    expect(columnNames).toContain('restaurantId');
  });
});
```