# USDS eCFR Site Analysis Tool

## 🎯 Project Overview

This project is a **USDS Take-Home Assessment** implementation for analyzing the Electronic Code of Federal Regulations (eCFR) website and data. The application provides comprehensive analysis capabilities for government website compliance and CFR data insights.

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2.0 + Java 17
- **Frontend**: Angular 17 + Material Design
- **Database**: H2 (development) / PostgreSQL (production)
- **Build Tools**: Maven + npm

## 📁 Project Structure

```
USDS_Site_Analysis/
├── usds-ecfr-analysis/
│   ├── backend/                 # Spring Boot application
│   │   ├── src/main/java/       # Java source code
│   │   │   └── gov/usds/ecfr/   # Package structure
│   │   │       ├── controller/  # REST controllers
│   │   │       ├── service/     # Business logic
│   │   │       ├── model/       # Data models
│   │   │       └── EcfrSiteAnalysisApplication.java
│   │   ├── src/test/java/       # Unit tests
│   │   ├── target/              # Build artifacts
│   │   └── pom.xml              # Maven configuration
│   ├── frontend/                # Angular application
│   │   ├── src/app/             # Angular components & services
│   │   │   ├── components/      # UI components
│   │   │   │   ├── analysis/    # Analysis dashboard
│   │   │   │   ├── home/        # Home page
│   │   │   │   └── results/     # Results display
│   │   │   └── services/        # Angular services
│   │   ├── package.json         # npm dependencies
│   │   └── angular.json         # Angular configuration
│   ├── docker-compose.yml       # Docker orchestration
│   ├── Dockerfile               # Container definition
│   ├── setup.bat               # Windows setup script
│   ├── setup.sh                # Unix setup script
│   └── README.md               # Project documentation
├── USDS Take-Home Assessment_Morris.pdf  # Original assignment
├── USDS Take-Home Assessment_Morris.docx # Assessment document
└── .gitignore                  # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+
- Git

### Setup & Run

#### Option 1: Manual Setup
```bash
# Clone the repository
git clone https://github.com/dnmorris7/USDS_Site_Analysis.git
cd USDS_Site_Analysis/usds-ecfr-analysis

# Terminal 1 - Backend
cd backend
mvn clean install
mvn spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

#### Option 2: Using Setup Scripts
```bash
# Windows
cd usds-ecfr-analysis
setup.bat

# Linux/Mac
cd usds-ecfr-analysis
chmod +x setup.sh
./setup.sh
```

#### Option 3: Docker (if available)
```bash
cd usds-ecfr-analysis
docker-compose up
```

### Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console

## 🔍 Current Features (Phase 1)

### Website Analysis Engine
- ✅ **Accessibility Analysis** - WCAG 2.1 & Section 508 compliance
- ✅ **Performance Metrics** - Load times, resource optimization
- ✅ **Government Compliance** - Federal website standards
- ✅ **Technical Analysis** - Security headers, HTTPS validation
- ✅ **Content Analysis** - Structure, navigation, usability
- ✅ **Usability Analysis** - Mobile responsiveness, accessibility features

### API Endpoints
```
GET  /api/analysis/health        # Service health check
GET  /api/analysis/analyze       # Website analysis (with URL parameter)
POST /api/analysis/analyze-async # Asynchronous analysis
```

### UI Components
- **Analysis Dashboard** - Progressive analysis with real-time feedback
- **Results Visualization** - Comprehensive metrics display with charts
- **Material Design** - Government-compliant UI patterns
- **Responsive Design** - Mobile and desktop optimized

## 🎯 Assignment Requirements Status

### ✅ Completed (Phase 1 - Website Analysis)
- [x] Modern web application (Angular + Spring Boot)
- [x] Government website analysis capabilities
- [x] Comprehensive results review interface
- [x] Production-ready code structure
- [x] Unit tests and error handling
- [x] CORS configuration and security
- [x] Responsive UI with Material Design
- [x] RESTful API design
- [x] Database integration (H2)

### 🚧 In Progress (Phase 2 - CFR Data Analysis)
- [ ] **eCFR Data Download** - Automated CFR content retrieval from APIs
- [ ] **Server-side Storage** - Database persistence of CFR regulations
- [ ] **CFR Analysis APIs** - Word count, checksums, historical changes
- [ ] **Agency Metrics** - Per-agency analytics and insights
- [ ] **Custom Metrics** - Regulatory complexity scoring
- [ ] **Historical Analysis** - Regulatory changes over time
- [ ] **Data Visualization** - Charts and graphs for CFR analytics

## 🔧 Development

### Backend Development
```bash
cd backend
mvn clean compile          # Compile
mvn test                   # Run tests
mvn spring-boot:run        # Start server
mvn package               # Build JAR
```

### Frontend Development
```bash
cd frontend
npm install                # Install dependencies
npm start                  # Development server
npm run build              # Production build
npm test                   # Run tests
npm run lint              # Code linting
```

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Specific test class
mvn test -Dtest=SiteAnalysisServiceTest

# Frontend tests
cd frontend
npm test
```

## 🏛️ Government Compliance

This application is designed to meet federal requirements:
- **Section 508 Accessibility** - WCAG 2.1 AA compliance
- **FOIA Compliance** - Transparency and data access
- **Privacy Act Adherence** - Data protection standards
- **Security Standards (FISMA)** - Federal security requirements
- **Plain Language Guidelines** - Clear, accessible communication

## 📊 Technical Specifications

### Backend Stack
- **Spring Boot 3.2.0** - RESTful API framework
- **Spring Data JPA** - Database abstraction
- **H2 Database** - In-memory development database
- **JSoup 1.16.2** - HTML parsing and analysis
- **Lombok** - Code generation and boilerplate reduction
- **JUnit 5** - Unit testing framework
- **Maven** - Build and dependency management

### Frontend Stack  
- **Angular 17** - Modern web framework with standalone components
- **Angular Material** - UI component library
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Karma/Jasmine** - Testing framework
- **SCSS** - Enhanced CSS with variables and mixins

## 🔒 Security Features

- **CORS Configuration** - Cross-origin request handling
- **Input Validation** - URL and data sanitization
- **Error Handling** - Secure error responses without information leakage
- **HTTPS Enforcement** - Secure communication protocols
- **SQL Injection Prevention** - JPA parameterized queries
- **XSS Protection** - Content Security Policy headers

## 📈 Performance Optimizations

- **Lazy Loading** - Angular route-based code splitting
- **HTTP Caching** - Appropriate cache headers
- **Database Connection Pooling** - HikariCP integration
- **Async Processing** - Non-blocking analysis operations
- **Gzip Compression** - Reduced payload sizes

## 🧪 Testing Strategy

- **Unit Tests** - Service layer and component testing
- **Integration Tests** - API endpoint validation
- **End-to-End Tests** - Full user workflow testing
- **Performance Tests** - Load and stress testing capabilities
- **Accessibility Tests** - WCAG compliance validation

## 📦 Deployment

### Development
- H2 in-memory database
- Angular dev server
- Spring Boot embedded Tomcat

### Production (Planned)
- PostgreSQL database
- Nginx reverse proxy
- Docker containerization
- CI/CD pipeline integration

## 🤝 Contributing

This is a USDS assessment project. Key development principles:
- Government-first design approach
- Accessibility as a core requirement
- Performance and security focus
- Clean, maintainable code
- Comprehensive documentation

## 📝 License

This project is developed for the USDS Take-Home Assessment.

## 👨‍💻 Author

**Daniel Morris**  
USDS Assessment Candidate  
September 2025

---

## 📋 Next Steps (Phase 2 Implementation)

### Immediate Priorities
1. **eCFR Data Integration** - Connect to official eCFR APIs
2. **Database Schema Design** - CFR content storage structure
3. **Data Analysis Services** - Word count, checksum, historical tracking
4. **Custom Metrics Development** - Regulatory complexity scoring
5. **Analytics Dashboard** - CFR-specific data visualization

### Technical Implementation Plan
1. Create CFR data models and entities
2. Implement eCFR API client services
3. Design data ingestion and processing pipelines
4. Build analysis and reporting capabilities
5. Develop CFR-specific UI components
6. Add comprehensive testing for CFR features

**Note**: This is Phase 1 of the implementation focusing on website analysis infrastructure. Phase 2 will implement the specific eCFR data analysis requirements outlined in the original assessment.