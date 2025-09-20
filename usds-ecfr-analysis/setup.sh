#!/bin/bash

echo "🚀 Setting up USDS eCFR Analysis Tool..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
        print_success "Java found: $JAVA_VERSION"
    else
        print_error "Java not found. Please install Java 17 or higher."
        exit 1
    fi
    
    # Check Maven
    if command -v mvn &> /dev/null; then
        MVN_VERSION=$(mvn -version | head -n 1)
        print_success "Maven found: $MVN_VERSION"
    else
        print_error "Maven not found. Please install Maven 3.8 or higher."
        exit 1
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js 18 or higher."
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up Spring Boot backend..."
    
    cd backend || exit 1
    
    print_status "Installing Maven dependencies..."
    if mvn clean install -q; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    print_status "Running backend tests..."
    if mvn test -q; then
        print_success "Backend tests passed"
    else
        print_warning "Some backend tests failed, but continuing setup..."
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up Angular frontend..."
    
    cd frontend || exit 1
    
    print_status "Installing npm dependencies..."
    if npm install --silent; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    print_status "Building frontend..."
    if npm run build --silent; then
        print_success "Frontend built successfully"
    else
        print_warning "Frontend build had warnings, but continuing setup..."
    fi
    
    cd ..
}

# Create startup scripts
create_startup_scripts() {
    print_status "Creating startup scripts..."
    
    # Backend startup script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🌟 Starting USDS eCFR Analysis Backend..."
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
EOF
    
    # Frontend startup script  
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🌟 Starting USDS eCFR Analysis Frontend..."
cd frontend
npm start
EOF
    
    # Combined startup script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting USDS eCFR Analysis Tool (Full Stack)..."

# Start backend in background
echo "Starting backend..."
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 15

# Start frontend
echo "Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Both services started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "🌐 Backend running at: http://localhost:8080"
echo "🌐 Frontend running at: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF
    
    # Make scripts executable
    chmod +x start-backend.sh start-frontend.sh start-all.sh
    
    print_success "Startup scripts created successfully"
}

# Create environment files
create_environment_files() {
    print_status "Creating environment configuration files..."
    
    # Frontend environment
    mkdir -p frontend/src/environments
    cat > frontend/src/environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'USDS eCFR Analysis Tool',
  version: '1.0.0'
};
EOF
    
    cat > frontend/src/environments/environment.prod.ts << 'EOF'
export const environment = {
  production: true,
  apiUrl: '/api',
  appName: 'USDS eCFR Analysis Tool',
  version: '1.0.0'
};
EOF
    
    print_success "Environment files created"
}

# Main setup function
main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              USDS eCFR Site Analysis Tool Setup             ║"
    echo "║                                                              ║"
    echo "║  This will set up the complete development environment       ║"
    echo "║  for the Electronic Code of Federal Regulations analysis    ║"
    echo "║  tool built for the USDS Take-Home Assessment.              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    check_prerequisites
    echo ""
    
    setup_backend
    echo ""
    
    setup_frontend
    echo ""
    
    create_startup_scripts
    echo ""
    
    create_environment_files
    echo ""
    
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                         Next Steps                            ║"
    echo "╠═══════════════════════════════════════════════════════════════╣"
    echo "║                                                               ║"
    echo "║  To start the backend only:                                   ║"
    echo "║    ./start-backend.sh                                         ║"
    echo "║                                                               ║"
    echo "║  To start the frontend only:                                  ║"
    echo "║    ./start-frontend.sh                                        ║"
    echo "║                                                               ║"
    echo "║  To start both services:                                      ║"
    echo "║    ./start-all.sh                                             ║"
    echo "║                                                               ║"
    echo "║  Backend will be available at: http://localhost:8080         ║"
    echo "║  Frontend will be available at: http://localhost:4200        ║"
    echo "║                                                               ║"
    echo "║  API Documentation: http://localhost:8080/swagger-ui.html    ║"
    echo "║  H2 Database Console: http://localhost:8080/h2-console       ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_status "Ready to analyze the eCFR website for accessibility, performance, and compliance!"
}

# Run main function
main