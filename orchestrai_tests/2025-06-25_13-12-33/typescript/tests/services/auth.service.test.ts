```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { AuthService } from '../../services/auth.service';
import { UserRepository } from '../../repositories/user.repository';
import { JwtService } from '../../services/jwt.service';
import { User } from '../../models/user.model';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';

jest.mock('../../repositories/user.repository');
jest.mock('../../services/jwt.service');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    jwtService = new JwtService() as jest.Mocked<JwtService>;
    authService = new AuthService(userRepository, jwtService);
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    };

    it('should successfully login with valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jwtService.generateToken.mockReturnValue('mock-token');

      const result = await authService.login(mockCredentials);

      expect(result).toEqual({
        token: 'mock-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(mockCredentials))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      userRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        password: 'differentPassword'
      });

      await expect(authService.login(mockCredentials))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should handle database errors gracefully', async () => {
      userRepository.findByEmail.mockRejectedValue(new Error('Database error'));

      await expect(authService.login(mockCredentials))
        .rejects
        .toThrow('Authentication failed');
    });
  });

  describe('validateToken', () => {
    it('should successfully validate a valid token', async () => {
      const mockToken = 'valid-token';
      const mockDecodedToken = { userId: 1, role: 'user' };
      
      jwtService.verifyToken.mockReturnValue(mockDecodedToken);
      userRepository.findById.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'user',
        password: 'hashedPassword'
      });

      const result = await authService.validateToken(mockToken);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        role: 'user'
      });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const mockToken = 'invalid-token';
      
      jwtService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken(mockToken))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
```