FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and TypeScript config
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application using the compiled JavaScript
CMD ["node", "./dist/app.js"]