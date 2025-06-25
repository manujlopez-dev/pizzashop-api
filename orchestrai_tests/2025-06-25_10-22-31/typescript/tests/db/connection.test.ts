```typescript
import { describe, expect, it, jest, beforeAll, afterAll } from '@jest/globals';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../../src/db/connection';

jest.mock('drizzle-orm/postgres-js', () => ({
  drizzle: jest.fn()
}));

jest.mock('drizzle-orm/postgres-js/migrator', () => ({
  migrate: jest.fn()
}));

describe('Database Connection', () => {
  it('should create database connection successfully', () => {
    expect(db).toBeDefined();
    expect(drizzle).toHaveBeenCalled();
  });
});
```