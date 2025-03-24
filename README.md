# Book Management REST API

A production-ready REST API for managing a catalog of books with full CRUD capabilities, built with Node.js, Express, and MySQL.

## Features

- **Complete CRUD Operations** for Book resources
- **RESTful API Design** following best practices
- **MySQL Database** with Sequelize ORM
- **Input Validation** for all endpoints
- **Error Handling** with appropriate HTTP status codes
- **Logging** for debugging and monitoring
- **Pagination, Filtering, and Sorting** for book listings
- **Soft Delete** functionality to preserve data
- **Comprehensive Testing Suite** with unit and integration tests
- **Continuous Integration** with GitHub Actions
- **Docker Support** for easy deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher) - **Must be installed and running**
- npm or yarn

### Database Setup

Before running the application, you need to:

1. **Ensure MySQL server is running**:
   
   **For macOS/Linux**:
   ```bash
   # Check if MySQL is running (Linux)
   sudo service mysql status
   # or on macOS with Homebrew
   brew services list
   
   # Start MySQL if it's not running (Linux)
   sudo service mysql start
   # or on macOS with Homebrew
   brew services start mysql
   ```
   
   **For Windows**:
   ```bash
   # Check if MySQL is running in Services
   # 1. Press Win+R, type "services.msc" and press Enter
   # 2. Look for "MySQL" in the services list
   
   # Using Command Prompt to check MySQL status
   sc query mysql
   
   # Start MySQL if it's not running
   # Option 1: In Services, right-click MySQL and select "Start"
   # Option 2: Using Command Prompt
   net start mysql
   ```

2. **Create the database**:
   ```bash
   # Log into MySQL (you'll need your MySQL root password)
   mysql -u root -p
   
   # Inside MySQL prompt, create the database
   CREATE DATABASE book_management;
   
   # Exit MySQL
   exit;
   ```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd book-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_root_password  # The password you use for MySQL
   DB_NAME=book_management
   DB_PORT=3306
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Building for Production:
    ```bash
    npm run build
    npm start
    ```

## Using Docker

If you prefer not to install MySQL locally, you can use Docker to run both the API and database:

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. The API will be available at http://localhost:3000.

This approach automatically sets up the MySQL database for you inside a container.

## API Endpoints

### Book Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books with pagination, filtering, and sorting |
| GET | `/api/books/:id` | Get a book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update a book (full update) |
| PATCH | `/api/books/:id` | Update a book (partial update) |
| DELETE | `/api/books/:id` | Soft delete a book |
| DELETE | `/api/books/:id/permanent` | Permanently delete a book |
| POST | `/api/books/:id/restore` | Restore a soft-deleted book |

### Query Parameters for GET /api/books

- `page`: Page number (default: 1)
- `limit`: Number of books per page (default: 10, max: 100)
- `sort`: Sort by field(s), comma-separated (e.g., `title,-published_date` for ascending title and descending published_date)
- `title`: Filter by title (partial match)
- `author`: Filter by author (partial match)
- `genre`: Filter by genre (partial match)
- `publishedAfter`: Filter books published after this date (format: YYYY-MM-DD)
- `publishedBefore`: Filter books published before this date (format: YYYY-MM-DD)

## Book Model

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| title | String | Book title (required) |
| author | String | Book author (required) |
| isbn | String | ISBN-10 or ISBN-13 (unique) |
| published_date | Date | Publication date |
| genre | String | Book genre |
| description | Text | Book description |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last update timestamp |
| deleted_at | Timestamp | Deletion timestamp (for soft delete) |

## Testing

The project includes both unit tests and integration tests.

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Generate test coverage report
npm run test:coverage
```
## API Testing with Postman

This repository includes a Postman collection for testing all API endpoints.

### Instructions:
1. Import the `book-REST-API.postman_collection.json` file into Postman
2. Update the environment variables with your specific configuration (local or deployed)
3. Use the collection to test all available endpoints

## Continuous Integration

This project uses GitHub Actions for continuous integration. The CI pipeline:

1. Runs unit tests 
2. Runs integration tests with a MySQL database
3. Generates test coverage reports

The CI configuration is defined in `.github/workflows/test.yml`.

## Project Structure

```
book-management-api/
│
├── src/
│   ├── config/
│   │   ├── database.ts         # Database configuration
│   │   └── logger.ts           # Winston logger setup
│   │
│   ├── controllers/
│   │   └── bookController.ts   # Book CRUD operations
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts     # Error handling middleware
│   │   └── validation.ts       # Request validation
│   │
│   ├── models/
│   │   └── Book.ts             # Book model with Sequelize
│   │
│   ├── routes/
│   │   └── bookRoutes.ts       # Book API routes
│   │
│   ├── utils/
│   │   └── apiFeatures.ts      # Pagination, filtering, sorting
│   │
│   └── app.ts                  # Express app setup
│
├── tests/
│   ├── unit/                   # Unit tests 
│   ├── integration/            # Integration tests
│
├── dist/                       # Compiled JavaScript files
│
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest configuration
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Troubleshooting

### Database Connection Issues

If you see a "ConnectionRefusedError" or "SequelizeConnectionRefusedError":

1. Verify MySQL is running:
   ```bash
   # macOS with Homebrew
   brew services list | grep mysql
   
   # Linux
   sudo service mysql status
   
   # Windows
   sc query mysql
   ```

2. Check your MySQL credentials:
   ```bash
   # Try connecting to MySQL directly
   mysql -u root -p
   ```

3. Make sure the database exists:
   ```sql
   -- In MySQL prompt
   SHOW DATABASES;
   ```

4. Verify your .env file matches your MySQL configuration.
