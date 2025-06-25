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