# Federal Regulation Analytics Platform

A comprehensive platform for analyzing 200,000+ pages of federal regulations to support data-driven deregulation decision-making. This application downloads, stores, and analyzes the complete Code of Federal Regulations (CFR) from the official eCFR.gov API to identify opportunities for regulatory burden reduction.

## USDS Take-Home Assessment Implementation

This solution addresses the core requirements:

### ✅ Primary Requirements Met
- **CFR Data Download**: Automated download of all CFR titles and parts from eCFR.gov API
- **Server-Side Storage**: H2 database storing regulation content, metadata, and analytics
- **Agency Analysis**: Word counts, regulation complexity scores, and deregulation metrics by agency
- **Historical Tracking**: Change detection and version history for regulations
- **Checksums**: Content integrity verification for downloaded regulations
- **Custom Metrics**: Regulation complexity scoring, agency efficiency ratings, deregulation opportunity identification

## Architecture

- **Backend**: Spring Boot 3.2.0 with Java 21
- **Frontend**: Angular 17 with Material Design
- **Database**: H2 database for regulation content storage
- **Integration**: eCFR.gov API for federal regulation data
- **Analytics**: Custom deregulation metrics and complexity scoring

## Features

### Federal Regulation Analytics
- **CFR Data Processing**: Download and analyze 200k+ pages of federal regulations
- **Agency Analysis**: Regulatory burden assessment, budget-to-regulation ratios
- **Deregulation Insights**: Complexity scoring, efficiency ratings, reduction opportunities
- **Historical Tracking**: Change detection, version history, frequency analysis
- **Content Analysis**: Word counts, cross-references, regulatory impact assessment

### Interactive Platform
- Modern Material Design interface with federal regulation focus
- Real-time analytics dashboard with key deregulation metrics
- Agency comparison and priority ranking tools
- Regulation content viewer with detailed analysis
- Data export capabilities for decision-making

### Bonus: Website Analysis Tool
- Original accessibility and performance analysis capabilities
- Retained as bonus feature for additional website evaluation
- WCAG compliance, performance metrics, SEO analysis

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Maven 3.8+
- npm or yarn

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd usds-ecfr-analysis
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:4200`

## API Documentation

### Backend Endpoints

#### GET /api/analyze
Performs synchronous analysis of the eCFR website.

**Response:**
```json
{
  "url": "https://www.ecfr.gov",
  "analyzedAt": "2024-01-15T10:30:00Z",
  "responseTimeMs": 450,
  "accessibility": {
    "score": 85,
    "wcagLevel": 2,
    "issues": ["Images missing alt text"],
    "details": {
      "totalImages": 45,
      "imagesWithoutAlt": 3,
      "totalHeadings": 12,
      "hasSkipLinks": true
    }
  },
  "performance": {
    "score": 78,
    "loadTimeMs": 1250,
    "pageSizeBytes": 2048576,
    "numberOfRequests": 23,
    "imageCount": 8,
    "scriptCount": 12,
    "stylesheetCount": 3
  },
  "content": {
    "title": "Electronic Code of Federal Regulations (eCFR)",
    "description": "Government regulations database",
    "headingCount": 12,
    "linkCount": 156,
    "imageCount": 8,
    "wordCount": 2340,
    "languages": ["en"],
    "hasSearchFunctionality": true
  },
  "technical": {
    "isHttps": true,
    "hasCsp": true,
    "doctype": "html",
    "technologies": ["JavaScript", "CSS3", "HTML5"]
  },
  "usability": {
    "score": 82,
    "hasSearch": true,
    "hasBreadcrumbs": true,
    "hasSkipNavigation": true,
    "mobileOptimized": true
  },
  "compliance": {
    "complianceScore": 88,
    "section508Compliant": true,
    "hasPrivacyPolicy": true,
    "hasAccessibilityStatement": true,
    "hasFoia": true,
    "hasContact": true,
    "recommendations": [
      "Add language selector for multilingual support",
      "Improve color contrast for better accessibility"
    ]
  }
}
```

#### POST /api/analyze-async
Initiates asynchronous analysis for better performance with large sites.

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Development
```bash
cd frontend
npm run serve
```

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## Configuration

### Backend Configuration (application.properties)
```properties
# Server configuration
server.port=8080

# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.h2.console.enabled=true

# Analysis configuration
ecfr.analysis.timeout=30000
ecfr.analysis.user-agent=USDS-eCFR-Analyzer/1.0
```

### Frontend Configuration (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Project Structure

```
usds-ecfr-analysis/
├── backend/
│   ├── src/main/java/gov/usds/ecfr/
│   │   ├── EcfrSiteAnalysisApplication.java
│   │   ├── controller/
│   │   │   └── SiteAnalysisController.java
│   │   ├── service/
│   │   │   └── SiteAnalysisService.java
│   │   └── model/
│   │       └── SiteAnalysisResult.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   ├── analysis/
│   │   │   └── results/
│   │   ├── services/
│   │   │   └── site-analysis.service.ts
│   │   ├── app.component.ts
│   │   └── app.config.ts
│   ├── package.json
│   └── angular.json
└── README.md
```

## Key Technologies

### Backend Dependencies
- **Spring Boot Web**: REST API framework
- **Spring Boot Data JPA**: Database abstraction
- **JSoup**: HTML parsing and analysis
- **H2 Database**: In-memory database for development
- **Spring Boot Actuator**: Health checks and metrics
- **Lombok**: Reducing boilerplate code

### Frontend Dependencies
- **Angular 17**: Modern frontend framework
- **Angular Material**: UI component library
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming for HTTP requests

## USDS Assessment Focus Areas

This tool specifically addresses the USDS requirements for:

1. **Accessibility Analysis**: Comprehensive WCAG 2.1 and Section 508 compliance checking
2. **Performance Evaluation**: Load time metrics and optimization recommendations
3. **Government Compliance**: Federal website standards and requirements validation
4. **User Experience**: Usability assessment based on government design standards
5. **Technical Standards**: Security, modern web standards, and best practices

## Accessibility Features

- Screen reader compatible interface
- High contrast color schemes
- Keyboard navigation support
- ARIA labels and landmarks
- Focus management
- Alternative text for all images
- Skip navigation links

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Ensure accessibility compliance in UI changes
5. Test with actual government websites

## License

This project is designed for the USDS Take-Home Assessment and follows government open source guidelines.

## Support

For questions about this assessment tool, please refer to the USDS Take-Home Assessment documentation or contact the development team.