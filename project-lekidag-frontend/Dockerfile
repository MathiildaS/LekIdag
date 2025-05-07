# Start with a base-image, a specific version of Node.js image.
FROM node:20.17.0-bookworm-slim

# Create a working directory in the image where the application will be placed.
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the directory. 
# Keep these seperate to only rebuild if these change.
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy all other src-files
COPY . .

# The port the application runs on.
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
