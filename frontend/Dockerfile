# Stage 1: Use an official Node.js image. Alpine is small and efficient.
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY library-management/package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Tell Docker that the container will listen on port 3000
EXPOSE 3000

# The command to run when the container starts.
# This will execute "npm run dev" which we configured earlier.
CMD ["npm", "run", "dev"]