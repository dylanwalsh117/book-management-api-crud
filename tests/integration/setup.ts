import dotenv from 'dotenv';
import { sequelize } from '../../src/app';

if (process.env.CI) {
  process.env.DB_HOST = '127.0.0.1';
  process.env.DB_USER = 'root';
  process.env.DB_PASS = 'root';
  process.env.DB_NAME = 'book_management_test';
  process.env.DB_PORT = '3306';
} else {
  dotenv.config();
}

beforeAll(async () => {
  console.log('Test DB Connection:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  
  // Sync test database with force: true to recreate tables
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});