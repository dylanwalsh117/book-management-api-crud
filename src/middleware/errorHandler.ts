import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { Error as SequelizeError, ValidationError, ValidationErrorItem } from 'sequelize';

interface CustomError extends Error {
  statusCode?: number;
  detail?: any;
  errors?: ValidationErrorItem[];
  original?: any;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  // Log the error
  logger.error('Error caught in error handler:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle different types of errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    const validationError = err as ValidationError;
    message = validationError.errors?.map((e: ValidationErrorItem) => e.message).join(', ') || 'Validation error';
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = 400;
    message = 'Database error';
  } else if (err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    message = 'Service unavailable';
  }

  // Hide stack traces when in production
  const errorResponse: any = {
    status: 'error',
    message,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
    errorResponse.detail = err.detail || err.original;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;