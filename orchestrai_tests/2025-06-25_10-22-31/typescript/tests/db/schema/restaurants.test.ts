```typescript
import { describe, expect, it } from '@jest/globals';
import { restaurants } from '../../../src/db/schema/restaurants';

describe('Restaurants Schema', () => {
  it('should have correct table name', () => {
    expect(restaurants.name).toBe('restaurants');
  });

  it('should have required columns', () => {
    const columnNames = Object.keys(restaurants);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('name');
    expect(columnNames).toContain('description');
    expect(columnNames).toContain('managerId');
  });
});
```