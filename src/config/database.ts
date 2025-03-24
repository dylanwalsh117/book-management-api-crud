import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../config/logger';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'book_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: (msg: string) => logger.debug(msg),
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export { sequelize };