import { Op, FindOptions, Order } from 'sequelize';

// Type definition for query parameters
interface QueryParams {
  page?: string;
  limit?: string;
  title?: string;
  author?: string;
  genre?: string;
  isbn?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  sort?: string;
}

// Type definition for pagination metadata
interface PaginationMetadata {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Utility class for API features like pagination, filtering, and sorting
 */
class APIFeatures {
  /**
   * Create pagination, filtering, and sorting options for Sequelize
   * @param queryParams - Query parameters from request
   * @returns Sequelize query options
   */
  static createQueryOptions(queryParams: QueryParams): FindOptions {
    const options: FindOptions = {
      where: {},
      order: [],
    };

    // Process pagination
    const page = parseInt(queryParams.page || '1', 10);
    const limit = parseInt(queryParams.limit || '10', 10);
    const offset = (page - 1) * limit;

    options.limit = limit;
    options.offset = offset;

    // Process filtering
    if (queryParams.title) {
      options.where = {
        ...options.where,
        title: { [Op.like]: `%${queryParams.title}%` },
      };
    }

    if (queryParams.author) {
      options.where = {
        ...options.where,
        author: { [Op.like]: `%${queryParams.author}%` },
      };
    }

    if (queryParams.genre) {
      options.where = {
        ...options.where,
        genre: { [Op.like]: `%${queryParams.genre}%` },
      };
    }

    if (queryParams.isbn) {
      options.where = {
        ...options.where,
        isbn: queryParams.isbn,
      };
    }

    // Date range filtering
    const publishedConditions: any = {};
    
    if (queryParams.publishedAfter) {
      publishedConditions[Op.gte] = new Date(queryParams.publishedAfter);
    }

    if (queryParams.publishedBefore) {
      publishedConditions[Op.lte] = new Date(queryParams.publishedBefore);
    }

    if (Object.keys(publishedConditions).length > 0) {
      options.where = {
        ...options.where,
        published_date: publishedConditions,
      };
    }

    // Process sorting
    const order: Order = [];
    
    if (queryParams.sort) {
      const sortFields = queryParams.sort.split(',');
      
      sortFields.forEach(field => {
        // Check if the field starts with '-' for descending order
        if (field.startsWith('-')) {
          order.push([field.substring(1), 'DESC']);
        } else {
          order.push([field, 'ASC']);
        }
      });
    } else {
      // Default sorting by createdAt in descending order
      order.push(['created_at', 'DESC']);
    }

    options.order = order;

    return options;
  }

  /**
   * Create pagination metadata
   * @param count - Total count of records
   * @param page - Current page
   * @param limit - Records per page
   * @returns Pagination metadata
   */
  static createPaginationMetadata(count: number, page: number, limit: number): PaginationMetadata {
    const totalPages = Math.ceil(count / limit);
    
    return {
      total: count,
      totalPages,
      currentPage: page,
      perPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}

export default APIFeatures;