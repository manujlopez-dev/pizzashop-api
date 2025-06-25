```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { RestaurantController } from '../../../src/controllers/restaurant.controller';
import { RestaurantService } from '../../../src/services/restaurant.service';

jest.mock('../../../src/services/restaurant.service');

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let mockRestaurantService: jest.Mocked<RestaurantService>;

  beforeEach(() => {
    mockRestaurantService = {
      getRestaurants: jest.fn(),
      getRestaurantById: jest.fn(),
      createRestaurant: jest.fn(),
      updateRestaurant: jest.fn(),
      deleteRestaurant: jest.fn(),
    } as any;

    controller = new RestaurantController(mockRestaurantService);
  });

  describe('getRestaurants', () => {
    it('should return all restaurants', async () => {
      const mockRestaurants = [
        { id: 1, name: 'Restaurant 1' },
        { id: 2, name: 'Restaurant 2' },
      ];
      mockRestaurantService.getRestaurants.mockResolvedValueOnce(mockRestaurants);

      const result = await controller.getRestaurants();

      expect(result).toEqual(mockRestaurants);
      expect(mockRestaurantService.getRestaurants).toHaveBeenCalled();
    });

    it('should handle errors when fetching restaurants', async () => {
      mockRestaurantService.getRestaurants.mockRejectedValueOnce(
        new Error('Failed to fetch restaurants')
      );

      await expect(controller.getRestaurants())
        .rejects.toThrow('Failed to fetch restaurants');
    });
  });

  describe('getRestaurantById', () => {
    it('should return restaurant by id', async () => {
      const mockRestaurant = { id: 1, name: 'Restaurant 1' };
      mockRestaurantService.getRestaurantById.mockResolvedValueOnce(mockRestaurant);

      const result = await controller.getRestaurantById(1);

      expect(result).toEqual(mockRestaurant);
      expect(mockRestaurantService.getRestaurantById).toHaveBeenCalledWith(1);
    });

    it('should return null for non-existent restaurant', async () => {
      mockRestaurantService.getRestaurantById.mockResolvedValueOnce(null);

      const result = await controller.getRestaurantById(999);

      expect(result).toBeNull();
    });
  });
});
```

These test files provide a solid foundation for reaching 60% coverage. They include:

1. Database connection testing
2. Schema validation
3. Authentication service testing
4. Restaurant controller testing

To create a pull request:

1. Create a new branch:
```bash
git checkout -b feature/add-unit-tests
```

2. Add the test files to the appropriate directories

3. Create a .gitignore file to exclude node_modules and coverage reports:
```
node_modules/
coverage/
```

4. Add a test script to package.json:
```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

5. Commit the changes:
```bash
git add .
git commit -m "Add comprehensive unit tests for TypeScript files"
```

6. Create pull request:
```bash
git push origin feature/add-unit-tests
```

Then create a pull request through GitHub's interface with the following description:

```markdown
# Add Comprehensive Unit Tests

This PR adds unit tests for the TypeScript codebase targeting 60% coverage.

## Changes
- Added database connection tests
- Added schema validation tests
- Added authentication service tests
- Added restaurant controller tests

## Testing
All tests can be run using:
```npm test```

Coverage report will be generated automatically.

## Notes
- Mocked external dependencies
- Focused on critical business logic
- Added proper error handling tests
```

Would you like me to generate additional test files for other components in the repository?