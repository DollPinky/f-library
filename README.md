#  Library Management System

A production-ready Library Management System for managing multiple company branches.
Built on a monolithic Spring Boot architecture, ensuring stability, performance, and easy deployment.

## 🚀 Key Features
### 📚 Core Functionality
- **Comprehensive Book Management**
  - Manage detailed book information with categories and branches  
  - Track book conditions (available, borrowed, lost, damaged,reserved)  
  - Generate QR/barcodes for physical copies  
  - Handle book donation requests and approvals  

- **User & Access Control**
  - Role-based authentication (Admin, Reader)  
  - Secure login using JWT  
  - Profile and account self-management  
  - Fine-grained permission for administrative actions  

- **Loan & Circulation**
  - Borrow and return management with due date tracking  
  - Automatic fine calculation for late or lost books  
  - Real-time book availability status  
  - Loan history tracking across multiple branches  

- **Feedback & Interaction**
  - Comment and review system for readers  
  - Rating and feedback on borrowed or donated books  

- **Reporting & Analytics**
  - Generate reports for loans, donations, and user activities  
  - Track fines, lost books, and borrowing statistics by branch  
 
## 🏗️ System Architecture

### Technology Stack

#### Backend
- **Core Framework:** Spring Boot 3.2.0 (Java 21)
- **Persistence:** 
  - JPA/Hibernate 6.2
  - QueryDSL for type-safe queries
  - Flyway for database migrations
- **Caching:** 
  - Caffeine (L1 cache)
  - Redis (L2 cache)
  - Spring Cache abstraction
- **Messaging:**
  - Apache Kafka for event streaming
  - Spring Cloud Stream
- **Security:**
  - Spring Security 6.1
  - JWT authentication
  - OAuth 2.0 integration
- **API Documentation:**
  - SpringDoc OpenAPI 3.0
  - Swagger UI
- **Monitoring:**
  - Spring Boot Actuator
  - Micrometer + Prometheus
  - Distributed tracing with OpenTelemetry

#### Frontend
- **Framework:** React 18 + Vite  
- **Routing:** React Router DOM  
- **HTTP Client:** Axios  
- **Chart:** Chart.js / Recharts  

#### Infrastructure
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Grafana, Prometheus

### Cấu Trúc Thư Mục
```
Library-Management/
├── src/main/
│   ├── java/com/university/library/
│   │   ├── base/                # Base classes and utilities
│   │   ├── config/              # Spring configurations
│   │   ├── constants/           # Application constants
│   │   ├── controller/          # REST API endpoints
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── request/         # API request DTOs
│   │   │   ├── response/        # API response DTOs
│   │   ├── entity/              # JPA entities
│   │   ├── initnizer/           # Initialize default data 
│   │   ├── OAuth/               # Handles OAuth2 authentication and token management
│   │   ├── scheduler/           # Manages scheduled background tasks using Spring Scheduler
│   │   ├── exception/           # Custom exceptions
│   │   ├── mapper/              # Object mapping (MapStruct)
│   │   ├── repository/          # Data access layer
│   │   └── service/             # Defines service interfaces for business logic
│   │   └── serviceimpl/         # Service implementations
│   │   └── specification/       # Contains JPA Specifications for dynamic query building.
│   │   └── utils/               # Common utility/helper classes used across the project.
│   └── resources/               # Centralized configuration file 
|
frontend/
└── library-management/
    ├── src/
    │   ├── assets/       # Static assets (images, fonts, icons, etc.)
    │   ├── components/   # Reusable UI components
    │   ├── contexts/     # React Context API providers (global state)
    │   ├── data/         # Mock data or local JSON for testing
    │   ├── hooks/        # Custom React hooks (e.g., useFetch, useAuth)
    │   ├── lib/          # Helper libraries, constants, and configuration files
    │   ├── pages/        # Page components mapped to routes
    │   ├── routes/       # Application routing definitions
    │   ├── services/     # API request handlers (Axios, Fetch)
    │   ├── types/        # TypeScript type definitions and interfaces
    │   └── utils/        # Utility functions and helper modules

```
## 🚀 Quick Start

### Prerequisites

#### Development Environment
- **Java Development Kit (JDK) 21**
  - [JDK 21](https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe (sha256))
#### Containerization
- **Docker Desktop** (v24.0+)
  - [Download for Windows/Mac](https://www.docker.com/products/docker-desktop/)
  - Minimum 4GB RAM allocated to Docker

#### Frontend Development
- **Node.js** (v18+ LTS)
  - [Official Installer](https://nodejs.org/)
  - nvm (Node Version Manager) recommended

#### Recommended IDEs
- **Backend**: IntelliJ IDEA Ultimate, VS Code with Java extensions
- **Frontend**: VS Code, WebStorm
- **Database**: DBeaver, TablePlus

## 🏃‍♂️ Running the Application

### 1. Infrastructure Setup

#### Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# Verify all containers are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Setup (Alternative)
1. **Database**: Install and configure PostgreSQL 15
2. **Cache**: Set up Redis server
3. **Message Broker**: Configure Apache Kafka with Zookeeper

### 2. Backend Application

#### Development Mode
```bash
# Build and run with development profile
./gradlew bootRun --args='--spring.profiles.active=dev'

# Run tests with coverage report
./gradlew test jacocoTestReport

```
### 3. Frontend Application

#### Development
```bash
cd frontend/library-management

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

```

### 4. Access the System

#### Development Environment
- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api-docs
- **Swagger UI**: http://localhost:8080/swagger-ui.html

#### Admin Credentials
- **Username**: admin@company.com
- **Password**: admin123
### Docker Compose Configuration
```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg15
    container_name: library-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - library-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: library-redis
    ports:
      - "6380:6379"
    volumes:
      - redis_data:/data
    networks:
      - library-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    container_name: library-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - library-network
    healthcheck:
      test: ["CMD-SHELL", "echo ruok | nc localhost 2181"]
      interval: 10s
      timeout: 5s
      retries: 5

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    container_name: library-kafka
    depends_on:
      zookeeper:
        condition: service_healthy
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: -1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:${KAFKA_HOST_PORT}
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
      KAFKA_DELETE_TOPIC_ENABLE: "true"
    volumes:
      - kafka_data:/var/lib/kafka/data
    networks:
      - library-network
    healthcheck:
      test: ["CMD-SHELL", "kafka-topics --bootstrap-server localhost:9092 --list"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  postgres_data:
  redis_data:
  kafka_data:

networks:
  library-network:
    driver: bridge

```