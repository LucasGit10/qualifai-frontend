# Build stage / Development stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including devDependencies for react-scripts start)
RUN npm install

# In local dev, files will be synced via docker volume, but we copy them anyway for building if needed.
COPY . .

# Expose port 3000 for local development
EXPOSE 3000

# Start local dev server
CMD ["npm", "start"]