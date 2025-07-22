# University Library Management System

Library management solution designed for multi-campus university environments, built with modern Java technologies and scalable architecture patterns.

## Architecture Overview

### Technology Stack
- **Runtime Environment:** Java 21 with Spring Boot 3.2.0
- **Data Persistence:** PostgreSQL 15 (production), H2 (development)
- **Caching Strategy:** Multi-tier caching with Caffeine (L1) and Redis (L2)
- **Event Processing:** Apache Kafka for asynchronous event handling
- **Build System:** Gradle 8.5+ with aggressive caching and parallel execution
- **Continuous Integration:** GitHub Actions with automated testing pipeline
- **Containerization:** Docker and Docker Compose for development environment

### Data Model
- **campuses:** University campus entities with geographical distribution
- **libraries:** Library facilities associated with each campus
- **staff:** Library personnel with role-based access control (ADMIN, LIBRARIAN, MANAGER)
- **categories:** Hierarchical book classification system
- **books:** Bibliographic information at ISBN level
- **book_copies:** Physical inventory management for individual book instances
- **readers:** Patron management for students and faculty
- **borrowings:** Transactional data for book lending and returns

## Development Environment Setup

### Prerequisites
- Java Development Kit 21 or higher
- Docker Desktop with Docker Compose
- Git version control system

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd Library-Management

# Initialize the project
gradlew.bat wrapper
```

### Infrastructure Services
```bash
# Start required services (PostgreSQL, Redis, Kafka, Zookeeper)
docker-compose up -d

# Verify service status
docker-compose ps
```

### Application Build and Execution
```bash
# Build the application
gradlew.bat build

# Run with development profile
gradlew.bat bootRun --args='--spring.profiles.active=docker'
```

### Service Endpoints
- **Application Server:** http://localhost:8080
- **REST API Base:** http://localhost:8080/api
- **API Documentation:** http://localhost:8080/swagger-ui.html
- **Health Monitoring:** http://localhost:8080/api/health
- **Kafka Management:** http://localhost:8081
- **Redis Management:** http://localhost:8082

## Data Management

### Sample Dataset
The system includes comprehensive sample data in `library_sample_data(1).sql`:
- **3 University Campuses:** Hanoi, Ho Chi Minh City, Da Nang
- **3 Library Facilities:** One library per campus
- **15 Library Staff:** Various roles across campuses
- **5 Book Categories:** Academic classification system
- **30 Book Titles:** Diverse academic literature
- **60 Book Copies:** Physical inventory distribution
- **30 Registered Readers:** Students and faculty members
- **40 Borrowing Transactions:** Historical lending data

### Database Configuration
- **Development:** H2 in-memory database for rapid iteration
- **Production:** PostgreSQL with connection pooling and optimization

## Configuration Management

### Environment Profiles
- **docker:** PostgreSQL + Redis + Kafka (containerized development)
- **prod:** Production-optimized configuration with managed services

### Production Environment Variables
```bash
# Database Configuration
JDBC_DATABASE_URL=jdbc:postgresql://host:port/database
JDBC_DATABASE_USERNAME=username
JDBC_DATABASE_PASSWORD=password

# Cache Configuration
REDIS_URL=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password

# Message Queue Configuration
KAFKA_URL=kafka-broker-url

# Application Configuration
PORT=8080
```

## Continuous Integration Pipeline

### GitHub Actions Workflow
- **Trigger Events:** Push to main/develop branches and pull requests
- **Build Environment:** Ubuntu latest with JDK 21
- **Service Integration:** PostgreSQL, Redis, and Kafka containers
- **Testing Framework:** Comprehensive unit and integration tests

### Performance Optimizations
- **Gradle Caching:** Local and remote build cache
- **Parallel Execution:** Multi-threaded build and test execution
- **Configuration Cache:** Incremental build optimization
- **Dependency Management:** Efficient artifact resolution

### Quality Assurance
- **Automated Testing:** PostgreSQL, Redis, and Kafka integration tests
- **Build Performance:** Optimized caching for faster builds
- **Environment Isolation:** Dedicated test environments
- **Artifact Management:** Test reports and coverage analysis

## Monitoring and Observability

### Health Monitoring
- **Application Health:** `/actuator/health` - Comprehensive system status
- **Application Information:** `/actuator/info` - Version and configuration details
- **Performance Metrics:** `/actuator/metrics` - Runtime performance indicators
- **Prometheus Integration:** `/actuator/prometheus` - Time-series metrics export

### Logging Strategy
- **Development:** Console-based logging with DEBUG level for detailed troubleshooting
- **Production:** Structured logging with rotation and centralized aggregation

## System Capabilities

### Core Functionality
- **Multi-Campus Management:** Centralized administration across university branches
- **Inventory Control:** Comprehensive book and copy management system
- **Circulation Management:** Automated borrowing and return processing
- **Role-Based Access:** Granular permission system for staff members
- **Asset Tracking:** QR code-based physical inventory tracking
- **Financial Management:** Automated fine calculation and processing

### Enterprise Architecture
- **Multi-Tier Caching:** Caffeine (L1) and Redis (L2) for optimal performance
- **Event-Driven Processing:** Kafka-based asynchronous event handling
- **Database Optimization:** Strategic indexing and query optimization
- **Connection Management:** Efficient connection pooling and resource utilization
- **System Monitoring:** Comprehensive health checks and performance metrics
- **API Documentation:** Interactive OpenAPI documentation with Swagger UI

### Roadmap Features
- **Reservation System:** Advanced book reservation and hold management
- **Communication Platform:** Automated email and SMS notifications
- **Mobile Application:** Cross-platform mobile interface for patrons
- **Analytics Dashboard:** Business intelligence and reporting capabilities
- **System Integration:** LMS and SIS integration for seamless data flow

## Containerized Development Environment

### Service Orchestration
```bash
# Start all infrastructure services
docker-compose up -d

# Monitor service logs
docker-compose logs -f

# Graceful shutdown
docker-compose down
```

### Infrastructure Components
- **PostgreSQL 15:** Primary relational database with advanced features
- **Redis 7:** High-performance in-memory data structure store
- **Apache Kafka 7.4:** Distributed streaming platform for event processing
- **Apache Zookeeper:** Distributed coordination service for Kafka
- **Kafka UI:** Web-based management interface for Kafka clusters
- **Redis Commander:** Web-based Redis database management tool

## API Reference

### Interactive Documentation
- **Swagger UI:** http://localhost:8080/swagger-ui.html - Interactive API explorer
- **OpenAPI Specification:** http://localhost:8080/api-docs - Machine-readable API definition

### Core API Endpoints
- `GET /api/health` - System health status verification
- `GET /api/health/ping` - Basic connectivity test
- `GET /api/health/info` - Application metadata and version information
- `GET /api/books` - Retrieve paginated book catalog
- `GET /api/books/{id}` - Fetch detailed book information
- `POST /api/borrowings` - Create new book borrowing transaction
- `PUT /api/borrowings/{id}/return` - Process book return operation
- `GET /api/readers/{id}/borrowings` - Retrieve patron borrowing history

## Security Framework

### Current Security Measures
- **Input Validation:** Comprehensive request parameter validation
- **Data Sanitization:** Protection against malicious input injection
- **SQL Injection Prevention:** JPA/Hibernate parameterized queries
- **CORS Configuration:** Cross-origin resource sharing policies

### Planned Security Enhancements
- **Authentication System:** Spring Security with JWT token-based authentication
- **Authorization Framework:** Role-based access control (RBAC) implementation
- **API Protection:** Rate limiting and request throttling mechanisms
- **Audit Logging:** Comprehensive security event tracking and monitoring

## Deployment Strategy

### Cloud Platform Deployment
```bash
# Heroku deployment configuration (currently disabled)
# deploy:
#   provider: heroku
#   api_key: $HEROKU_API_KEY
#   app: university-library
```

### Production Deployment
```bash
# Build production artifact
gradlew.bat build

# Execute with production configuration
java -Dspring.profiles.active=prod -jar build/libs/library-management-*.jar
```

## Development Guidelines

### Contribution Process
1. **Repository Fork:** Create a personal fork of the main repository
2. **Feature Branch:** Develop new features in dedicated branches
3. **Code Review:** Submit pull requests for peer review
4. **Quality Assurance:** Ensure all tests pass before merging
5. **Documentation:** Update relevant documentation for new features

## Licensing

This project is licensed under the MIT License, providing maximum flexibility for academic and commercial use.

## Support and Maintenance

For technical support and inquiries:
- **Issue Tracking:** Create detailed issues in the project repository
- **Development Team:** Contact the core development team for urgent matters
- **Documentation:** Refer to comprehensive project documentation

---

**Developed for Academic Excellence in Library Management**