```typescript
import { describe, expect, it, jest, beforeAll, afterAll } from '@jest/globals';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { getConnection } from '../../../src/db/connection';

jest.mock('drizzle-orm/postgres-js');
jest.mock('drizzle-orm/postgres-js/migrator');

describe('Database Connection', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should establish database connection successfully', async () => {
    const mockDrizzle = jest.fn();
    (drizzle as jest.Mock).mockImplementation(mockDrizzle);

    const connection = await getConnection();
    
    expect(connection).toBeDefined();
    expect(drizzle).toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', async () => {
    (drizzle as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    await expect(getConnection()).rejects.toThrow('Connection failed');
  });
});
```