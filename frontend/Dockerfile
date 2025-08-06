# --- Stage 1: Build React App using Node ---
    FROM node:latest AS builder

    # Set working directory inside the container
    WORKDIR /app
    
    # Copy package.json and package-lock.json (if available) to install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy all frontend source code into container
    COPY . .
    
    # Build the React/Vite production bundle
    RUN npm run build
    
    
    # --- Stage 2: Serve with Nginx ---
    FROM nginx:alpine
    
    # Set Nginx’s working directory to the default web root
    WORKDIR /usr/share/nginx/html
    
    # Clean any default static files
    RUN rm -rf ./*
    
    # Copy built files from the previous build stage
    COPY --from=builder /app/dist .
    
    # Copy template for dynamic environment variable injection (used to generate env.js)
    COPY env.template.js .
    
    # Copy custom entrypoint script that injects env vars and starts Nginx
    COPY entrypoint.sh /entrypoint.sh
    RUN chmod +x /entrypoint.sh
    
    # Copy the Nginx config template (used for dynamic backend proxy setup)
    COPY default.conf.template /etc/nginx/conf.d/default.conf.template
    
    # Expose HTTP port
    EXPOSE 80
    
    # Run custom entrypoint (handles env injection before starting Nginx)
    CMD ["/entrypoint.sh"]
    