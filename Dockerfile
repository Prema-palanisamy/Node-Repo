# Use the official Node.js image..
FROM node:18

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose port 8080.
EXPOSE 80

# Start the application.
CMD ["node", "postsql.js"]
