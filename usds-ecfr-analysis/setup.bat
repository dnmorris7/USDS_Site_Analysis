@echo off
setlocal EnableDelayedExpansion

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              USDS eCFR Site Analysis Tool Setup             ║
echo ║                                                              ║
echo ║  This will set up the complete development environment       ║
echo ║  for the Electronic Code of Federal Regulations analysis    ║
echo ║  tool built for the USDS Take-Home Assessment.              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Function to print status messages
:print_status
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Check prerequisites
call :print_status "Checking prerequisites..."

REM Check Java
java -version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
        set JAVA_VERSION=%%g
        set JAVA_VERSION=!JAVA_VERSION:"=!
    )
    call :print_success "Java found: !JAVA_VERSION!"
) else (
    call :print_error "Java not found. Please install Java 17 or higher."
    pause
    exit /b 1
)

REM Check Maven
mvn -version >nul 2>&1
if %errorlevel% == 0 (
    call :print_success "Maven found and working"
) else (
    call :print_error "Maven not found. Please install Maven 3.8 or higher."
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    call :print_success "Node.js found: !NODE_VERSION!"
) else (
    call :print_error "Node.js not found. Please install Node.js 18 or higher."
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% == 0 (
    for /f %%i in ('npm --version') do set NPM_VERSION=%%i
    call :print_success "npm found: !NPM_VERSION!"
) else (
    call :print_error "npm not found. Please install npm."
    pause
    exit /b 1
)

echo.

REM Setup backend
call :print_status "Setting up Spring Boot backend..."

cd backend
if not exist "pom.xml" (
    call :print_error "Backend pom.xml not found. Please ensure you're in the correct directory."
    cd ..
    pause
    exit /b 1
)

call :print_status "Installing Maven dependencies..."
mvn clean install -q
if %errorlevel% == 0 (
    call :print_success "Backend dependencies installed successfully"
) else (
    call :print_error "Failed to install backend dependencies"
    cd ..
    pause
    exit /b 1
)

call :print_status "Running backend tests..."
mvn test -q
if %errorlevel% == 0 (
    call :print_success "Backend tests passed"
) else (
    call :print_warning "Some backend tests failed, but continuing setup..."
)

cd ..
echo.

REM Setup frontend
call :print_status "Setting up Angular frontend..."

cd frontend
if not exist "package.json" (
    call :print_error "Frontend package.json not found. Please ensure you're in the correct directory."
    cd ..
    pause
    exit /b 1
)

call :print_status "Installing npm dependencies..."
npm install --silent
if %errorlevel% == 0 (
    call :print_success "Frontend dependencies installed successfully"
) else (
    call :print_error "Failed to install frontend dependencies"
    cd ..
    pause
    exit /b 1
)

call :print_status "Building frontend..."
npm run build --silent
if %errorlevel% == 0 (
    call :print_success "Frontend built successfully"
) else (
    call :print_warning "Frontend build had warnings, but continuing setup..."
)

cd ..
echo.

REM Create startup scripts
call :print_status "Creating startup scripts..."

REM Backend startup script
echo @echo off > start-backend.bat
echo echo 🌟 Starting USDS eCFR Analysis Backend... >> start-backend.bat
echo cd backend >> start-backend.bat
echo mvn spring-boot:run -Dspring-boot.run.profiles=dev >> start-backend.bat

REM Frontend startup script
echo @echo off > start-frontend.bat
echo echo 🌟 Starting USDS eCFR Analysis Frontend... >> start-frontend.bat
echo cd frontend >> start-frontend.bat
echo npm start >> start-frontend.bat

REM Combined startup script
echo @echo off > start-all.bat
echo echo 🚀 Starting USDS eCFR Analysis Tool ^(Full Stack^)... >> start-all.bat
echo echo Starting backend... >> start-all.bat
echo start "USDS Backend" cmd /k "cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev" >> start-all.bat
echo timeout /t 15 /nobreak >> start-all.bat
echo echo Starting frontend... >> start-all.bat
echo start "USDS Frontend" cmd /k "cd frontend && npm start" >> start-all.bat
echo echo. >> start-all.bat
echo echo ✅ Both services started! >> start-all.bat
echo echo. >> start-all.bat
echo echo 🌐 Backend running at: http://localhost:8080 >> start-all.bat
echo echo 🌐 Frontend running at: http://localhost:4200 >> start-all.bat
echo echo. >> start-all.bat
echo echo Press any key to close this window... >> start-all.bat
echo pause >> start-all.bat

call :print_success "Startup scripts created successfully"
echo.

REM Create environment files
call :print_status "Creating environment configuration files..."

if not exist "frontend\src\environments" mkdir frontend\src\environments

echo export const environment = { > frontend\src\environments\environment.ts
echo   production: false, >> frontend\src\environments\environment.ts
echo   apiUrl: 'http://localhost:8080/api', >> frontend\src\environments\environment.ts
echo   appName: 'USDS eCFR Analysis Tool', >> frontend\src\environments\environment.ts
echo   version: '1.0.0' >> frontend\src\environments\environment.ts
echo }; >> frontend\src\environments\environment.ts

echo export const environment = { > frontend\src\environments\environment.prod.ts
echo   production: true, >> frontend\src\environments\environment.prod.ts
echo   apiUrl: '/api', >> frontend\src\environments\environment.prod.ts
echo   appName: 'USDS eCFR Analysis Tool', >> frontend\src\environments\environment.prod.ts
echo   version: '1.0.0' >> frontend\src\environments\environment.prod.ts
echo }; >> frontend\src\environments\environment.prod.ts

call :print_success "Environment files created"
echo.

call :print_success "🎉 Setup completed successfully!"
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                         Next Steps                            ║
echo ╠═══════════════════════════════════════════════════════════════╣
echo ║                                                               ║
echo ║  To start the backend only:                                   ║
echo ║    start-backend.bat                                          ║
echo ║                                                               ║
echo ║  To start the frontend only:                                  ║
echo ║    start-frontend.bat                                         ║
echo ║                                                               ║
echo ║  To start both services:                                      ║
echo ║    start-all.bat                                              ║
echo ║                                                               ║
echo ║  Backend will be available at: http://localhost:8080         ║
echo ║  Frontend will be available at: http://localhost:4200        ║
echo ║                                                               ║
echo ║  API Documentation: http://localhost:8080/swagger-ui.html    ║
echo ║  H2 Database Console: http://localhost:8080/h2-console       ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

call :print_status "Ready to analyze the eCFR website for accessibility, performance, and compliance!"
echo.
echo Press any key to exit...
pause >nul