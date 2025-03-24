import bookController from '../../src/controllers/bookController';
import Book from '../../src/models/Book';
import httpMocks from 'node-mocks-http';

// Mock Book model
jest.mock('../../src/models/Book');

// Mock the logger
jest.mock('../../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

describe('Book Controller', () => {
  let req: any, res: any, next: jest.Mock;
  
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });
  
  test('getAllBooks should return books with pagination', async () => {
    const mockBooks = [
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' }
    ];
    
    (Book.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 2,
      rows: mockBooks
    });
    
    await bookController.getAllBooks(req, res, next);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data).toEqual(mockBooks);
    expect(data.pagination).toBeDefined();
  });
  
  test('getBookById should return a book', async () => {
    const mockBook = { id: 1, title: 'Test Book' };
    req.params = { id: '1' };
    
    (Book.findByPk as jest.Mock).mockResolvedValue(mockBook);
    
    await bookController.getBookById(req, res, next);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data).toEqual(mockBook);
  });
  
  test('getBookById should return 404 if book not found', async () => {
    req.params = { id: '999' };
    (Book.findByPk as jest.Mock).mockResolvedValue(null);
    
    await bookController.getBookById(req, res, next);
    
    expect(res._getStatusCode()).toBe(404);
  });
  
  test('createBook should create a new book', async () => {
    const bookData = { title: 'New Book', author: 'Author' };
    const createdBook = { id: 1, ...bookData };
    
    req.body = bookData;
    (Book.create as jest.Mock).mockResolvedValue(createdBook);
    
    await bookController.createBook(req, res, next);
    
    expect(res._getStatusCode()).toBe(201);
    expect(Book.create).toHaveBeenCalledWith(bookData);
  });
  
  test('updateBook should update an existing book', async () => {
    const bookId = '1';
    const updateData = { title: 'Updated Title' };
    
    const mockBook = {
      id: 1,
      title: 'Original Title',
      update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Title' })
    };
    
    req.params = { id: bookId };
    req.body = updateData;
    
    (Book.findByPk as jest.Mock).mockResolvedValue(mockBook);
    
    await bookController.updateBook(req, res, next);
    
    expect(res._getStatusCode()).toBe(200);
    expect(mockBook.update).toHaveBeenCalledWith(updateData);
  });
  
  test('deleteBook should soft delete a book', async () => {
    const mockBook = {
      id: 1,
      title: 'Book to Delete',
      destroy: jest.fn().mockResolvedValue(true)
    };
    
    req.params = { id: '1' };
    (Book.findByPk as jest.Mock).mockResolvedValue(mockBook);
    
    await bookController.deleteBook(req, res, next);
    
    expect(res._getStatusCode()).toBe(200);
    expect(mockBook.destroy).toHaveBeenCalled();
  });
});