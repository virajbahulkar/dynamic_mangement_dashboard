# Use node version 16 as the base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app/client

# Copy package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the remaining files
COPY . .

# Build the React app
RUN npm run build

# Expose the port the client runs on
EXPOSE 3000

# Set environment to development explicitly (optional)
ENV NODE_ENV=development

# Start the React development server
CMD ["npm", "start"]
