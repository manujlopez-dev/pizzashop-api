I'll help generate comprehensive test files focusing on TypeScript since that's the primary technology in the repository. I'll extend the existing tests with more complex cases.

Let's start with some key test files:

=== FILE: typescript/tests/services/auth.service.test.ts ===
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

=== FILE: typescript/tests/controllers/restaurant.controller.test.ts ===
```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { RestaurantController } from '../../controllers/restaurant.controller';
import { RestaurantService } from '../../services/restaurant.service';
import { Request, Response } from 'express';
import { Restaurant } from '../../models/restaurant.model';
import { NotFoundException } from '../../exceptions/not-found.exception';

jest.mock('../../services/restaurant.service');

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let restaurantService: jest.Mocked<RestaurantService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    restaurantService = new RestaurantService() as jest.Mocked<RestaurantService>;
    restaurantController = new RestaurantController(restaurantService);
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('getAllRestaurants', () => {
    const mockRestaurants: Restaurant[] = [
      { id: 1, name: 'Pizza Place', address: '123 Main St', rating: 4.5 },
      { id: 2, name: 'Pasta House', address: '456 Side St', rating: 4.0 }
    ];

    it('should return all restaurants successfully', async () => {
      restaurantService.getAllRestaurants.mockResolvedValue(mockRestaurants);
      mockRequest = {};

      await restaurantController.getAllRestaurants(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockRestaurants);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors when fetching restaurants', async () => {
      const error = new Error('Database error');
      restaurantService.getAllRestaurants.mockRejectedValue(error);
      mockRequest = {};

      await restaurantController.getAllRestaurants(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getRestaurantById', () => {
    const mockRestaurant: Restaurant = {
      id: 1,
      name: 'Pizza Place',
      address: '123 Main St',
      rating: 4.5
    };

    it('should return a restaurant by id successfully', async () => {
      restaurantService.getRestaurantById.mockResolvedValue(mockRestaurant);
      mockRequest = {
        params: { id: '1' }
      };

      await restaurantController.getRestaurantById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockRestaurant);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle not found restaurant', async () => {
      restaurantService.getRestaurantById.mockRejectedValue(
        new NotFoundException('Restaurant not found')
      );
      mockRequest = {
        params: { id: '999' }
      };

      await restaurantController.getRestaurantById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(NotFoundException)
      );
    });
  });

  describe('createRestaurant', () => {
    const mockRestaurantData = {
      name: 'New Pizza Place',
      address: '789 New St',
      rating: 5.0
    };

    it('should create a restaurant successfully', async () => {
      const createdRestaurant = { id: 3, ...mockRestaurantData };
      restaurantService.createRestaurant.mockResolvedValue(createdRestaurant);
      mockRequest = {
        body: mockRestaurantData
      };

      await restaurantController.createRestaurant(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(createdRestaurant);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should handle validation errors', async () => {
      const invalidData = { name: '' };
      mockRequest = {
        body: invalidData
      };

      await restaurantController.createRestaurant(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });
  });
});
```

These test files demonstrate comprehensive testing with:
1. Proper mocking of dependencies
2. Coverage of success and error scenarios
3. Testing of edge cases
4. Validation of business logic
5. Error handling verification
6. Complex test scenarios

Would you like me to generate more test files for other components or specific areas that need coverage?