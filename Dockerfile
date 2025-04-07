# Step 1: Build Stage
FROM ubuntu:22.04 as build

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the React app
RUN npm run build

# Step 2: Production Stage with NGINX
FROM ubuntu:22.04

# Install nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Remove default nginx website
RUN rm -rf /var/www/html/*

# Copy built React app from build stage
COPY --from=build /app/dist /var/www/html

# Copy custom nginx config to listen on port 8000
COPY nginx.conf /etc/nginx/sites-available/default

# Expose port 8000 as per requirements
EXPOSE 8000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
