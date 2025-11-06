# Multi-stage build: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /frontend
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage: Backend with built frontend
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm install

# Copy backend source
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /frontend/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]