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

FROM nginx:alpine
# Create a directory for the service account key file
RUN mkdir /app/credentials

# Copy the service account key file into the container
# COPY C:\Prema\config.json /usr/src/app/credentials/keyfile.json
COPY --from=node C:\Prema\config.json /app/credentials/keyfile.json
# Set environment variable for Google Cloud credentials
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/credentials/keyfile.json"

# Expose port 8080.
EXPOSE 80

# Start the application.
CMD ["node", "myappsql.js"]
