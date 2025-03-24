import './setup'; 
import request from 'supertest';
import { app } from '../../src/app'; 
import Book from '../../src/models/Book';

// Sample book data for testing
const sampleBook = {
  title: 'Test Book',
  author: 'Test Author',
  isbn: '978-3-16-148410-0',
  published_date: '2023-01-01',
  genre: 'Fiction',
  description: 'A test book description',
};

describe('Book API', () => {
  let bookId: number;
  
  // Test creating a book
  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const response = await request(app)
        .post('/api/books')
        .send(sampleBook)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(sampleBook.title);
      
      // Save book ID for later tests
      bookId = response.body.data.id;
    });
    
    it('should return validation error for invalid data', async () => {
      const response = await request(app)
        .post('/api/books')
        .send({ author: 'Test Author' }) // Missing required title
        .expect(400);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation error');
    });
  });
  
  // Test getting all books
  describe('GET /api/books', () => {
    it('should get all books with pagination', async () => {
      const response = await request(app)
        .get('/api/books')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toHaveProperty('totalPages');
    });
    
    it('should filter books by author', async () => {
      const response = await request(app)
        .get('/api/books?author=Test')
        .expect(200);
      
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].author).toContain('Test');
    });
  });
  
  // Test getting a single book
  describe('GET /api/books/:id', () => {
    it('should get a book by ID', async () => {
      const response = await request(app)
        .get(`/api/books/${bookId}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(bookId);
    });
    
    it('should return 404 for non-existent book', async () => {
      const response = await request(app)
        .get('/api/books/9999')
        .expect(404);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Book not found');
    });
  });
  
  // Test updating a book
  describe('PUT /api/books/:id', () => {
    it('should update a book', async () => {
      const updatedData = {
        title: 'Updated Book Title',
        genre: 'Non-Fiction',
      };
      
      const response = await request(app)
        .put(`/api/books/${bookId}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe(updatedData.title);
      expect(response.body.data.genre).toBe(updatedData.genre);
      // Original data should remain
      expect(response.body.data.author).toBe(sampleBook.author);
    });
  });
  
  // Test soft deleting a book
  describe('DELETE /api/books/:id', () => {
    it('should soft delete a book', async () => {
      const response = await request(app)
        .delete(`/api/books/${bookId}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Book deleted successfully');
      
      // Book should not be found with normal query
      await request(app)
        .get(`/api/books/${bookId}`)
        .expect(404);
    });
    
    it('should restore a soft deleted book', async () => {
      const response = await request(app)
        .post(`/api/books/${bookId}/restore`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Book restored successfully');
      
      // Book should be accessible again
      await request(app)
        .get(`/api/books/${bookId}`)
        .expect(200);
    });
  });
  
  // Test hard deleting a book
  describe('DELETE /api/books/:id/permanent', () => {
    it('should permanently delete a book', async () => {
      // First soft delete the book
      await request(app)
        .delete(`/api/books/${bookId}`)
        .expect(200);
      
      // Then hard delete it
      const response = await request(app)
        .delete(`/api/books/${bookId}/permanent`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Book permanently deleted');
      
      // Restore should fail as the book is permanently deleted
      await request(app)
        .post(`/api/books/${bookId}/restore`)
        .expect(404);
    });
  });
});