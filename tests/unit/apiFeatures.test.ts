import APIFeatures from '../../src/utils/apiFeatures';
import { Op } from 'sequelize';

describe('APIFeatures', () => {
  test('should create default query options', () => {
    const options = APIFeatures.createQueryOptions({});
    
    expect(options.limit).toBe(10);
    expect(options.offset).toBe(0);
    expect(options.where).toEqual({});
    expect(options.order).toEqual([['created_at', 'DESC']]);
  });
  
  test('should handle pagination', () => {
    const options = APIFeatures.createQueryOptions({ page: '2', limit: '5' });
    
    expect(options.limit).toBe(5);
    expect(options.offset).toBe(5); // (page-1) * limit = (2-1) * 5 = 5
  });
  
  test('should handle filtering', () => {
    const options = APIFeatures.createQueryOptions({ 
      title: 'Harry',
      author: 'Rowling'
    });
    
    expect(options.where).toHaveProperty('title');
    expect(options.where).toHaveProperty('author');
    expect((options.where as any).title).toEqual({ [Op.like]: '%Harry%' });
    expect((options.where as any).author).toEqual({ [Op.like]: '%Rowling%' });
  });
  
  test('should handle sorting', () => {
    const options = APIFeatures.createQueryOptions({ sort: '-title,author' });
    
    expect(options.order).toContainEqual(['title', 'DESC']);
    expect(options.order).toContainEqual(['author', 'ASC']);
  });
  
  test('should create correct pagination metadata', () => {
    const meta = APIFeatures.createPaginationMetadata(20, 2, 10);
    
    expect(meta.total).toBe(20);
    expect(meta.totalPages).toBe(2);
    expect(meta.currentPage).toBe(2);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(true);
  });
});