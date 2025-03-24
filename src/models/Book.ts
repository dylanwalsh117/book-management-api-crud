import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// These are all the attributes in the Book model
interface BookAttributes {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  published_date?: Date;
  genre?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

// Some attributes are optional in `Book.create` call
interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

// Book Model which extends Sequelize's Model with our attributes
class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn?: string;
  public published_date?: Date;
  public genre?: string;
  public description?: string;
  
  // Timestamps
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
  
  // Sequelize will populate automatically
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isbn: {
      type: DataTypes.STRING(20),
      unique: true,
      validate: {
        isISBN(value: string) {
          // Validation for ISBN-10 or ISBN-13
          const isbnRegex = /^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$/;
          if (value && !isbnRegex.test(value.replace(/[- ]/g, ''))) {
            throw new Error('Must be a valid ISBN-10 or ISBN-13');
          }
        },
      },
    },
    published_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Enable timestamps (createdAt, updatedAt)
    timestamps: true,
    
    // Enable soft deletes (deletedAt)
    paranoid: true,
    
    // Custom column names
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    
    // Table name
    tableName: 'books',
    
    // Add indexes
    indexes: [
      {
        fields: ['title', 'author'],
      },
      {
        fields: ['genre'],
      },
    ],
    sequelize,
  }
);

export default Book;