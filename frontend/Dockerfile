FROM node:24-alpine

WORKDIR /app

# Build arguments for environment variables
ARG API_URL=https://api.trust-me-bro.link
ARG FRONTEND_URL=https://trust-me-bro.link

# Set environment variables for Vite build (Vite requires VITE_ prefix)
ENV VITE_API_URL=$API_URL
ENV VITE_FRONTEND_URL=$FRONTEND_URL

# Install serve globally
RUN npm install -g serve

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Clean up node_modules to reduce image size (keep package.json for dev commands)
RUN rm -rf node_modules

EXPOSE 3061

# Serve the built app with SPA fallback
CMD ["serve", "-s", "dist", "-l", "3061"]
