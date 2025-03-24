import { Request, Response, NextFunction } from 'express';
import Book from '../models/Book';
import logger from '../config/logger';
import APIFeatures from '../utils/apiFeatures';

/**
 * Book controller with CRUD operations
 */
const bookController = {
  /**
   * Get all books with pagination, filtering, and sorting
   */
  getAllBooks: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Create query options using APIFeatures utility
      const queryOptions = APIFeatures.createQueryOptions(req.query);
      
      // Get books with total count
      const { count, rows: books } = await Book.findAndCountAll(queryOptions);
      
      // Create pagination metadata
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const pagination = APIFeatures.createPaginationMetadata(count, page, limit);
      
      logger.info(`Retrieved ${books.length} books (page ${page}/${pagination.totalPages})`);
      
      res.status(200).json({
        status: 'success',
        pagination,
        data: books,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single book by ID
   */
  getBookById: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      
      if (!book) {
        logger.warn(`Book with ID ${id} not found`);
        return res.status(404).json({
          status: 'error',
          message: 'Book not found',
        });
      }
      
      logger.info(`Retrieved book with ID ${id}`);
      
      res.status(200).json({
        status: 'success',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new book
   */
  createBook: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookData = req.body;
      const book = await Book.create(bookData);
      
      logger.info(`Created new book with ID ${book.id}`);
      
      res.status(201).json({
        status: 'success',
        message: 'Book created successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a book by ID
   */
  updateBook: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const bookData = req.body;
      
      const book = await Book.findByPk(id);
      
      if (!book) {
        logger.warn(`Cannot update: Book with ID ${id} not found`);
        return res.status(404).json({
          status: 'error',
          message: 'Book not found',
        });
      }
      
      await book.update(bookData);
      
      logger.info(`Updated book with ID ${id}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Book updated successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a book by ID (soft delete)
   */
  deleteBook: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      
      if (!book) {
        logger.warn(`Cannot delete: Book with ID ${id} not found`);
        return res.status(404).json({
          status: 'error',
          message: 'Book not found',
        });
      }
      
      // Soft delete the book
      await book.destroy();
      
      logger.info(`Soft deleted book with ID ${id}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Book deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Hard delete a book (permanent deletion)
   */
  hardDeleteBook: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, { paranoid: false });
      
      if (!book) {
        return res.status(404).json({
          status: 'error',
          message: 'Book not found',
        });
      }
      
      // Force true for a hard delete
      await book.destroy({ force: true });
      
      logger.info(`Hard deleted book with ID ${id}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Book permanently deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Restore a soft-deleted book
   */
  restoreBook: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      
      const book = await Book.findByPk(id, { paranoid: false });
      
      if (!book) {
        return res.status(404).json({
          status: 'error',
          message: 'Book not found',
        });
      }
      
      if (!book.deleted_at) {
        return res.status(400).json({
          status: 'error',
          message: 'Book is not deleted',
        });
      }
      
      await book.restore();
      
      logger.info(`Restored soft-deleted book with ID ${id}`);
      
      res.status(200).json({
        status: 'success',
        message: 'Book restored successfully',
        data: book,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default bookController;