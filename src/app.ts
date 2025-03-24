import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import logger from './config/logger';
import errorHandler from './middleware/errorHandler';
import bookRoutes from './routes/bookRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/books', bookRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server function (separated from immediate execution)
const startServer = async (): Promise<any> => {
  let retries = 5;
  
  while (retries) {
    try {
      // Test database connection and sync models
      await sequelize.authenticate();
      logger.info('Database connection established successfully');
      
      // Sync database models (use { alter: true } only in development)
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      logger.info('Database models synchronized');
      
      // Start server
      const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
      
      return server;
    } catch (error) {
      retries -= 1;
      logger.error(`Failed to connect to database, retries left: ${retries}`, error);
      
      if (retries === 0) {
        logger.error('Failed to start server after multiple retries:', error);
        // Only exit if not in test environment
        if (process.env.NODE_ENV !== 'test') {
          console.error('Failed to start server:', error);
          process.exit(1);
        }
        throw error; // Re-throw for testing environments
      }
      
      // Wait before retrying
      logger.info(`Waiting 5 seconds before retrying...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Start server if file is run directly
if (require.main === module) {
  startServer();
}

export { app, sequelize, startServer };