# Stage 1: Build Angular frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY frontend/src ./src
COPY frontend/angular.json ./
COPY frontend/tsconfig*.json ./

RUN npm run build --prod

# Stage 2: Build Java backend
FROM maven:3.8.6-openjdk-17-slim AS backend-build

WORKDIR /app/backend

# Copy Maven files
COPY backend/pom.xml ./
RUN mvn dependency:go-offline

# Copy backend source and build
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Runtime image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Install nginx for serving frontend
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy built frontend to nginx
COPY --from=frontend-build /app/frontend/dist/* /var/www/html/

# Copy built backend JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Nginx configuration for Angular routing
RUN echo 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /var/www/html;\n\
    index index.html;\n\
    \n\
    # Handle Angular routing\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    # Proxy API requests to Spring Boot\n\
    location /api/ {\n\
        proxy_pass http://localhost:8080;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
    }\n\
}\n' > /etc/nginx/sites-available/default

# Start script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Start Spring Boot in background\n\
echo "Starting Spring Boot backend..."\n\
java -jar /app/app.jar --server.port=8080 &\n\
BACKEND_PID=$!\n\
\n\
# Wait for backend to be ready\n\
echo "Waiting for backend to start..."\n\
sleep 10\n\
\n\
# Start Nginx\n\
echo "Starting Nginx frontend..."\n\
nginx -g "daemon off;" &\n\
NGINX_PID=$!\n\
\n\
# Wait for any process to exit\n\
wait -n\n\
\n\
# Exit with status of process that exited first\n\
exit $?\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 80 8080

CMD ["/app/start.sh"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

# Labels for USDS compliance
LABEL maintainer="USDS Assessment Team"
LABEL description="eCFR Site Analysis Tool - Government Website Accessibility and Compliance Analyzer"
LABEL version="1.0.0"
LABEL government.usds.assessment="true"
LABEL government.compliance.section508="true"
LABEL government.compliance.wcag="2.1-AA"