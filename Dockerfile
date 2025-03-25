# Start from the Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install MySQL CLI (use default-mysql-client instead of mysql-client)
RUN apt-get update && apt-get install -y default-mysql-client

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy application files
COPY . .

# Ensure scripts have the correct permissions
RUN chmod +x init-db.sql wait-for-it.sh

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

