```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth.service';
import { drizzle } from 'drizzle-orm/postgres-js';

jest.mock('drizzle-orm/postgres-js');

describe('AuthService', () => {
  let authService: AuthService;
  let mockDb: jest.Mocked<any>;

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      insert: jest.fn(),
      select: jest.fn(),
    };
    (drizzle as jest.Mock).mockReturnValue(mockDb);
    authService = new AuthService(mockDb);
  });

  describe('createAuthLink', () => {
    it('should create auth link successfully', async () => {
      const email = 'test@example.com';
      mockDb.insert.mockResolvedValueOnce({ id: 1, email });

      const result = await authService.createAuthLink(email);

      expect(result).toBeDefined();
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should handle errors when creating auth link', async () => {
      const email = 'test@example.com';
      mockDb.insert.mockRejectedValueOnce(new Error('Database error'));

      await expect(authService.createAuthLink(email))
        .rejects.toThrow('Database error');
    });
  });

  describe('validateAuthLink', () => {
    it('should validate auth link successfully', async () => {
      const token = 'valid-token';
      mockDb.select.mockResolvedValueOnce([{ id: 1, token }]);

      const result = await authService.validateAuthLink(token);

      expect(result).toBeTruthy();
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should return false for invalid auth link', async () => {
      const token = 'invalid-token';
      mockDb.select.mockResolvedValueOnce([]);

      const result = await authService.validateAuthLink(token);

      expect(result).toBeFalsy();
    });
  });
});
```