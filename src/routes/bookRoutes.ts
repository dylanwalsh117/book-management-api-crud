import express from 'express';
import bookController from '../controllers/bookController';
import { bookValidationRules, validate } from '../middleware/validation';

const router = express.Router();

// GET all books with pagination, filtering, and sorting
router.get('/', bookValidationRules.getAll, validate, bookController.getAllBooks);

// GET a single book by ID
router.get('/:id', bookController.getBookById);

// POST create a new book
router.post('/', bookValidationRules.create, validate, bookController.createBook);

// PUT update a book
router.put('/:id', bookValidationRules.update, validate, bookController.updateBook);

// PATCH update a book (partial update)
router.patch('/:id', bookValidationRules.update, validate, bookController.updateBook);

// DELETE a book (soft delete)
router.delete('/:id', bookController.deleteBook);

// Additional endpoints for soft delete functionality

// DELETE hard delete a book (permanent deletion)
router.delete('/:id/permanent', bookController.hardDeleteBook);

// POST restore a soft-deleted book
router.post('/:id/restore', bookController.restoreBook);

export default router;