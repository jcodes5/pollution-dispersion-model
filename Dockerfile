# Use Node.js 22 Alpine for Vite 7 compatibility
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 10000

# Start the application
CMD ["pnpm", "start"]