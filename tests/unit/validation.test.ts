import { bookValidationRules, validate } from '../../src/middleware/validation';
import httpMocks from 'node-mocks-http';

// Mock the logger
jest.mock('../../src/config/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
}));

describe('Validation Middleware', () => {
  let req: any, res: any, next: jest.Mock;
  
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });
  
  test('should pass validation with valid book data', async () => {
    req.body = {
      title: 'Test Book',
      author: 'Test Author',
      isbn: '978-3-16-148410-0',
      published_date: '2023-01-01'
    };
    
    // Apply validation rules
    for (const rule of bookValidationRules.create) {
      await rule.run(req);
    }
    
    validate(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  
  test('should fail when required fields are missing', async () => {
    req.body = { genre: 'Fiction' }; // Missing title and author
    
    for (const rule of bookValidationRules.create) {
      await rule.run(req);
    }
    
    validate(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(400);
  });
  
  test('should validate query parameters for get all books', async () => {
    req.query = { 
      page: '-1', // Invalid negative page number
      limit: '5'
    };
    
    for (const rule of bookValidationRules.getAll) {
      await rule.run(req);
    }
    
    validate(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(400);
  });
});