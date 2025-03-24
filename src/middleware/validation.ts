import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import logger from '../config/logger';

interface ValidationRules {
  create: ValidationChain[];
  update: ValidationChain[];
  getAll: ValidationChain[];
}

const bookValidationRules: ValidationRules = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters'),
    
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ max: 255 })
      .withMessage('Author must be at most 255 characters'),
    
    body('isbn')
      .optional()
      .trim()
      .custom((value) => {
        // ISBN-10 or ISBN-13
        const isbnRegex = /^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$/;
        if (value && !isbnRegex.test(value.replace(/[- ]/g, ''))) {
          throw new Error('Must be a valid ISBN-10 or ISBN-13');
        }
        return true;
      }),
    
    body('published_date')
      .optional()
      .isDate()
      .withMessage('Published date must be a valid date'),
    
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Genre must be at most 100 characters'),
    
    body('description')
      .optional()
      .trim(),
  ],
  
  update: [
    param('id')
      .isInt()
      .withMessage('Book ID must be an integer'),
    
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters'),
    
    body('author')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Author cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Author must be at most 255 characters'),
    
    body('isbn')
      .optional()
      .trim()
      .custom((value) => {
        // ISBN-10 or ISBN-13
        const isbnRegex = /^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$/;
        if (value && !isbnRegex.test(value.replace(/[- ]/g, ''))) {
          throw new Error('Must be a valid ISBN-10 or ISBN-13');
        }
        return true;
      }),
    
    body('published_date')
      .optional()
      .isDate()
      .withMessage('Published date must be a valid date'),
    
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Genre must be at most 100 characters'),
    
    body('description')
      .optional()
      .trim(),
  ],
  
  // Validation for pagination, filtering, and sorting
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('sort')
      .optional()
      .isString()
      .withMessage('Sort must be a string'),
    
    query('author')
      .optional()
      .isString()
      .withMessage('Author must be a string'),
    
    query('genre')
      .optional()
      .isString()
      .withMessage('Genre must be a string'),
    
    query('publishedBefore')
      .optional()
      .isDate()
      .withMessage('Published before must be a valid date'),
    
    query('publishedAfter')
      .optional()
      .isDate()
      .withMessage('Published after must be a valid date'),
  ],
};

// Validation middleware
const validate = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error', { 
      path: req.path, 
      method: req.method, 
      errors: errors.array() 
    });
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  next();
};

export {
  bookValidationRules,
  validate,
};