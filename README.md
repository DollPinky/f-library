# University Library Management System

A comprehensive, production-ready library management solution designed for multi-campus university environments. This system features a modern microservices architecture with event-driven design patterns, multi-layer caching, and real-time capabilities.

[![Java](https://img.shields.io/badge/Java-21-orange?logo=java&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## 🚀 Key Features

### 📚 Core Functionality
- **Comprehensive Book Management**
  - Multi-attribute book catalog with advanced search
  - Barcode/QR code generation for physical copies
  - Batch import/export capabilities
  - Digital asset management for e-books and resources

- **User & Access Control**
  - Multi-role authentication (Admin, Librarian, Faculty, Student)
  - OAuth 2.0 and JWT token-based authentication
  - Fine-grained permission system
  - Self-service account management

- **Loan & Circulation**
  - Flexible loan policies based on user roles
  - Automated fine calculation and notifications
  - Real-time availability tracking
  - Multi-branch inventory management

### 🛠️ Technical Highlights
- **Performance Optimizations**
  - Multi-layer caching (Caffeine + Redis)
  - Database query optimization
  - Asynchronous processing for heavy operations
  - Connection pooling with HikariCP

- **Architecture**
  - Clean Architecture principles
  - CQRS pattern implementation
  - Event-driven microservices
  - API Gateway pattern

- **Integration & Extensibility**
  - RESTful APIs with OpenAPI documentation
  - WebSocket for real-time updates
  - Webhook support for external systems
  - Plugin system for custom extensions

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
- **Framework:** Next.js 14 with React 18
- **State Management:** React Query + Zustand
- **Styling:** Tailwind CSS + Headless UI
- **Data Visualization:** Chart.js
- **Form Handling:** React Hook Form
- **Internationalization:** next-i18next
- **Testing:** Jest, React Testing Library, Cypress

#### Infrastructure
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Code Quality:** SonarQube, Checkstyle
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Monitoring:** Grafana, Prometheus
- **Documentation:** MkDocs + Material for MkDocs

### Cấu Trúc Thư Mục
```
Library-Management/
├── src/main/
│   ├── java/com/university/library/
│   │   ├── annotation/          # Custom annotations
│   │   ├── aspect/              # AOP aspects
│   │   ├── base/                # Base classes and utilities
│   │   ├── config/              # Spring configurations
│   │   ├── constants/           # Application constants
│   │   ├── controller/          # REST API endpoints
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── request/        # API request DTOs
│   │   │   ├── response/       # API response DTOs
│   │   │   └── event/          # Event DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── event/              # Domain events
│   │   ├── exception/          # Custom exceptions
│   │   ├── mapper/             # Object mapping (MapStruct)
│   │   ├── repository/         # Data access layer
│   │   └── service/            # Business logic
│   │       ├── command/        # Command services (CUD operations)
│   │       ├── query/          # Query services (R operations)
│   │       └── impl/           # Service implementations
│   └── resources/
│       ├── db/migration/      # Database migrations
│       ├── i18n/              # Internationalization files
│       ├── static/            # Static resources
│       └── templates/         # Email templates
│
├── frontend/                   # Next.js application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── app/              # App router
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── services/         # API services
│   │   ├── stores/           # State management
│   │   └── styles/           # Global styles
│   └── tests/                # Test files
│
├── docs/                      # Project documentation
├── scripts/                   # Utility scripts
└── docker/                    # Docker-related files
```

## 🏛 Domain Model

### Core Entities

#### 1. Book & BookCopy
- **Book**: Represents a title in the catalog
  - ISBN, title, authors, publisher, publication year
  - Categories, tags, and subjects
  - Digital content and metadata
- **BookCopy**: Physical or digital instance of a book
  - Barcode/QR code
  - Location and status tracking
  - Condition and maintenance history

#### 2. User Management
- **Account**: User authentication and profile
- **Roles**: Fine-grained access control
- **Preferences**: UI/UX customization

#### 3. Loan System
- **Borrowing**: Loan records
- **Reservations**: Hold management
- **Fines**: Automated calculation and tracking

#### 4. Library Infrastructure
- **Campus**: Multi-campus support
- **Library**: Physical locations
- **Inventory**: Stock management

## 🚀 Quick Start

### Prerequisites

#### Development Environment
- **Java Development Kit (JDK) 21**
  - [Eclipse Temurin](https://adoptium.net/)
  - [Amazon Corretto](https://aws.amazon.com/corretto/)
  - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)

#### Containerization
- **Docker Desktop** (v24.0+)
  - [Download for Windows/Mac](https://www.docker.com/products/docker-desktop/)
  - Minimum 4GB RAM allocated to Docker

#### Frontend Development
- **Node.js** (v18+ LTS)
  - [Official Installer](https://nodejs.org/)
  - nvm (Node Version Manager) recommended

#### Database
- **PostgreSQL 15** (or use Docker)
  - [PostgreSQL Downloads](https://www.postgresql.org/download/)
  - pgAdmin 4 for database management

#### Build Tools
- **Gradle 8.5+**
  - Included in the project (gradle-wrapper)
  - [Manual Installation](https://gradle.org/install/)

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

# Build Docker image
docker build -t library-management .
```

#### Production Mode
```bash
# Build production JAR
./gradlew bootJar

# Run with production profile
java -Dspring.profiles.active=prod -jar build/libs/library-management-*.jar
```

### 3. Frontend Application

#### Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 4. Access the System

#### Development Environment
- **Frontend Application**: http://localhost:3002
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api-docs
- **Swagger UI**: http://localhost:8080/swagger-ui.html

#### Admin Credentials
- **Username**: admin@university.edu
- **Password**: admin123

#### Monitoring & Management
- **Kafka UI**: http://localhost:8081
- **Redis Commander**: http://localhost:8082
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601

## 🏛 Domain Model

### Core Entities

#### 1. Book & BookCopy
- **Book**: Represents a title in the catalog
  - ISBN, title, authors, publisher, publication year
  - Categories, tags, and subjects
  - Digital content and metadata
- **BookCopy**: Physical or digital instance of a book
  - Barcode/QR code
  - Location and status tracking
  - Condition and maintenance history

#### 2. User Management
- **Account**: User authentication and profile
- **Roles**: Fine-grained access control
- **Preferences**: UI/UX customization

#### 3. Loan System
- **Borrowing**: Loan records
- **Reservations**: Hold management
- **Fines**: Automated calculation and tracking

#### 4. Library Infrastructure
- **Campus**: Multi-campus support
- **Library**: Physical locations
- **Inventory**: Stock management

#### 1. BaseEntity (Abstract)

```java
import java.time.Instant;

@MappedSuperclass
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {
    @Builder.Default
    private Boolean isDeleted = false;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
```

#### 2. Book Entity
```java
@Entity
@Table(name = "books")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Book extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "book_id")
    private UUID bookId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;
    
    @Column(name = "author", length = 255)
    private String author;
    
    @Column(name = "publisher", length = 255)
    private String publisher;
    
    @Column(name = "year")
    private Integer year;
    
    @Column(name = "isbn", length = 20)
    private String isbn;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BookCopy> bookCopies = new ArrayList<>();
}
```

#### 3. BookCopy Entity
```java
@Entity
@Table(name = "book_copies")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BookCopy extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "copy_id")
    private UUID copyId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id", nullable = false)
    private Library library;
    
    @Column(name = "qr_code", unique = true, nullable = false)
    private String qrCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BookStatus status = BookStatus.AVAILABLE;
    
    @Column(name = "shelf_location")
    private String shelfLocation;
    
    @OneToMany(mappedBy = "bookCopy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Borrowing> borrowings = new ArrayList<>();
    
    public enum BookStatus {
        AVAILABLE, BORROWED, RESERVED, MAINTENANCE, LOST
    }
}
```

#### 4. Library Entity
```java
@Entity
@Table(name = "libraries")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Library extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "library_id")
    private UUID libraryId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id", nullable = false)
    private Campus campus;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Staff> staff = new ArrayList<>();
    
    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BookCopy> bookCopies = new ArrayList<>();
}
```

### Quan Hệ Dữ Liệu
```
Campus (1) ←→ (N) Library
Library (1) ←→ (N) BookCopy
Book (1) ←→ (N) BookCopy
User (1) ←→ (N) Borrowing
BookCopy (1) ←→ (N) Borrowing
Category (1) ←→ (N) Book
```

## 🏛️ Kiến Trúc Phần Mềm

### 1. Multi-Layer Caching Architecture

#### Cache Annotations
```java
// Cache với multi-layer (Caffeine + Redis)
@MultiLayerCache(value = "books", key = "#id", localTtl = 10, distributedTtl = 30)
public Book getBookById(UUID id) {
    return bookRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Book not found: " + id));
}

// Xóa cache
@MultiLayerCacheEvict(value = {"books"}, allEntries = true)
public Book createBook(CreateBookCommand command) {
    // Business logic
}

// Cập nhật cache
@MultiLayerCachePut(value = "books", key = "#result.bookId")
public Book updateBook(UUID id, CreateBookCommand command) {
    // Business logic
}
```

#### Cache Configuration
```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean("caffeineCacheManager")
    @Primary
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .expireAfterAccess(5, TimeUnit.MINUTES)
                .recordStats());
        return cacheManager;
    }

    @Bean("redisCacheManager")
    public CacheManager redisCacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                    .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                    .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .withCacheConfiguration("books", 
                    RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(15)))
                .withCacheConfiguration("categories", 
                    RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(60)))
                .withCacheConfiguration("libraries", 
                    RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(60)))
                .build();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Cấu hình serializer cho key
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // Cấu hình serializer cho value với type info
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.activateDefaultTyping(
            LaissezFaireSubTypeValidator.instance,
            ObjectMapper.DefaultTyping.NON_FINAL,
            JsonTypeInfo.As.PROPERTY
        );
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

#### Cache Service Helper
```java
@Service
@Slf4j
@RequiredArgsConstructor
public class CacheService {

    private final CacheManager caffeineCacheManager;
    private final CacheManager redisCacheManager;
    private final RedisTemplate<String, Object> redisTemplate;

    // Lấy giá trị từ Caffeine cache
    public Object getFromCaffeine(String cacheName, String key) {
        Cache cache = caffeineCacheManager.getCache(cacheName);
        if (cache != null) {
            Cache.ValueWrapper wrapper = cache.get(key);
            return wrapper != null ? wrapper.get() : null;
        }
        return null;
    }

    // Lưu giá trị vào Redis cache với TTL
    public void putToRedis(String key, Object value, Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
        log.debug("Stored in Redis cache: {} with TTL: {}", key, ttl);
    }

    // Xóa tất cả cache (Caffeine + Redis)
    public void clearAllCaches(String cacheName) {
        clearCaffeine(cacheName);
        clearRedisByPattern(cacheName + ":*");
        log.info("Cleared all caches: {}", cacheName);
    }
}
```

### 2. Event-Driven Architecture với Kafka

#### Event Classes
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCreatedEvent {
    private UUID bookId;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private UUID categoryId;
    private String categoryName;
    private UUID createdByAccountId;
    private String createdByUsername;
    private String createdByFullName;
    private String createdByUserType;
    private String createdByStaffRole;
    private String createdByEmployeeId;
    private UUID libraryId;
    private String libraryName;
    private UUID campusId;
    private String campusName;
    private Instant createdAt;
    private int totalCopies;
    private int availableCopies;
    
    @Builder.Default
    private String eventType = "BOOK_CREATED";
}
```

#### Event Publishing trong Facade

```java
import java.time.Instant;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookFacade {

    private final BookQueryService bookQueryService;
    private final BookCommandService bookCommandService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Book createBook(CreateBookCommand command, Account currentAccount) {
        log.info("Creating new book: {} by user: {}", command.getTitle(), currentAccount.getUsername());

        // Tạo sách
        Book book = bookCommandService.createBook(command);

        // Gửi event qua Kafka với đầy đủ thông tin
        BookCreatedEvent event = BookCreatedEvent.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .publishYear(book.getYear())
                .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .createdByAccountId(currentAccount.getAccountId())
                .createdByUsername(currentAccount.getUsername())
                .createdByFullName(currentAccount.getFullName())
                .createdByUserType(currentAccount.getUserType().name())
                .createdByStaffRole(currentAccount.isStaff() ? getStaffRole(currentAccount) : null)
                .createdByEmployeeId(currentAccount.isStaff() ? getEmployeeId(currentAccount) : null)
                .libraryId(command.getCopies() != null && !command.getCopies().isEmpty() ?
                        command.getCopies().get(0).getLibraryId() : null)
                .libraryName("") // Sẽ được populate từ service
                .campusId(currentAccount.getCampus() != null ? currentAccount.getCampus().getCampusId() : null)
                .campusName(currentAccount.getCampus() != null ? currentAccount.getCampus().getName() : null)
                .createdAt(Instant.now())
                .totalCopies(command.getCopies() != null ?
                        command.getCopies().stream().mapToInt(c -> c.getQuantity()).sum() : 0)
                .availableCopies(command.getCopies() != null ?
                        command.getCopies().stream().mapToInt(c -> c.getQuantity()).sum() : 0)
                .build();

        kafkaTemplate.send("book-events", event);

        log.info("Book created successfully with id: {} and event sent", book.getBookId());
        return book;
    }
}
```

### 3. Controller Layer (REST API)
```java
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Slf4j
public class BookController {
    
    private final BookFacade bookFacade;

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse<Book>> getBook(@PathVariable UUID id) {
        log.info("GET /api/books/{}", id);
        
        try {
            Book book = bookFacade.getBookById(id);
            StandardResponse<Book> response = StandardResponse.success(
                "Lấy thông tin sách thành công", book);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting book: ", e);
            StandardResponse<Book> response = StandardResponse.error(
                "Không thể lấy thông tin sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<StandardResponse<Book>> createBook(
            @Valid @RequestBody CreateBookCommand command) {
        log.info("POST /api/books with title: {}", command.getTitle());
        
        try {
            // TODO: Lấy current account từ SecurityContext
            Account currentAccount = createMockAccount();
            
            Book book = bookFacade.createBook(command, currentAccount);
            StandardResponse<Book> response = StandardResponse.success(
                "Tạo sách thành công", book);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Error creating book: ", e);
            StandardResponse<Book> response = StandardResponse.error(
                "Không thể tạo sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Error creating book: ", e);
            StandardResponse<Book> response = StandardResponse.error(
                "Không thể tạo sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
```

### 4. Service Layer (CQRS)
```java
// Query Service - Chỉ đọc dữ liệu với multi-layer cache
@Slf4j
@Service
@RequiredArgsConstructor
public class BookQueryService {
    
    private final BookRepository bookRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @MultiLayerCache(value = "books", key = "#params.hashCode()", localTtl = 5, distributedTtl = 15)
    public PagedResponse<Book> searchBooks(BookSearchParams params) {
        log.info("Searching books with params: {}", params);
        
        // Tạo specification cho search
        Specification<Book> spec = createSearchSpecification(params);
        
        // Tạo pageable
        Pageable pageable = PageRequest.of(
            params.getPage() != null ? params.getPage() : 0,
            params.getSize() != null ? params.getSize() : 20
        );
        
        // Query database
        Page<Book> books = bookRepository.findAll(spec, pageable);
        PagedResponse<Book> response = PagedResponse.fromPage(books);
        
        return response;
    }
    
    @MultiLayerCache(value = "books", key = "#id", localTtl = 10, distributedTtl = 30)
    public Book getBookById(UUID id) {
        log.info("Getting book by id: {}", id);
        return bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }
}

// Command Service - Chỉ thay đổi dữ liệu
@Slf4j
@Service
@RequiredArgsConstructor
public class BookCommandService {
    
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final CategoryRepository categoryRepository;
    private final LibraryRepository libraryRepository;
    
    @Transactional
    @MultiLayerCacheEvict(value = {"books"}, allEntries = true)
    public Book createBook(CreateBookCommand command) {
        log.info("Creating new book: {}", command.getTitle());
        
        // Validate business rules
        validateBookCreation(command);
        
        // Tìm category
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found: " + command.getCategoryId()));
        
        // Tạo sách mới
        Book book = Book.builder()
            .title(command.getTitle())
            .author(command.getAuthor())
            .isbn(command.getIsbn())
            .publisher(command.getPublisher())
            .year(command.getPublishYear())
            .category(category)
            .build();
        
        Book savedBook = bookRepository.save(book);
        log.info("Book created successfully: {}", savedBook.getBookId());
        
        // Tạo các bản sao sách nếu có
        if (command.getCopies() != null && !command.getCopies().isEmpty()) {
            createBookCopies(savedBook, command.getCopies());
        }
        
        return savedBook;
    }
}
```

### 5. Repository Layer
```java
@Repository
public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {
    
    /**
     * Tìm sách theo danh mục
     */
    List<Book> findByCategoryId(Long categoryId);
    
    /**
     * Tìm sách theo ISBN
     */
    Book findByIsbn(String isbn);
    
    /**
     * Tìm kiếm sách theo từ khóa (title, author, isbn)
     */
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Kiểm tra ISBN đã tồn tại chưa
     */
    boolean existsByIsbn(String isbn);
    
    /**
     * Đếm số sách theo danh mục
     */
    long countByCategoryId(Long categoryId);
}
```

## 🔧 Cấu Hình Hệ Thống

### Application Properties
```yaml
# Database
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true

# Redis Cache
spring:
  redis:
    host: localhost
    port: 6379
  cache:
    type: redis

# Kafka
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: library-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

### Docker Compose Configuration
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: library-postgres
    environment:
      POSTGRES_DB: library
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - library-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: library-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - library-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Zookeeper for Kafka
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

  # Apache Kafka
  kafka:
    image: confluentinc/cp-kafka:7.4.0
    container_name: library-kafka
    depends_on:
      zookeeper:
        condition: service_healthy
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
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

  # Kafka UI
  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: library-kafka-ui
    depends_on:
      kafka:
        condition: service_healthy
    ports:
      - "8081:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181
    networks:
      - library-network

  # Redis Commander
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: library-redis-commander
    depends_on:
      redis:
        condition: service_healthy
    ports:
      - "8082:8081"
    environment:
      REDIS_HOSTS: local:redis:6379
    networks:
      - library-network

volumes:
  postgres_data:
  redis_data:
  kafka_data:

networks:
  library-network:
    driver: bridge
```

## 📱 Frontend Architecture

### Cấu Trúc Thư Mục
```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin pages
│   ├── books/             # Book management
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Utilities
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── store/               # State management
└── types/               # TypeScript types
```

### API Integration
```typescript
// Standard response format
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Pagination response
interface PaginatedResponse<T> {
  content: T[];
  number: number;        // pageNumber
  size: number;          // pageSize
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}
```

## 🧪 Testing Strategy

### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class BookQueryServiceTest {
    
    @Mock
    private BookRepository bookRepository;
    
    @Mock
    private RedisTemplate<String, Object> redisTemplate;
    
    @InjectMocks
    private BookQueryService queryService;
    
    @Test
    void searchBooks_ShouldReturnCachedResult() {
        // Given
        BookSearchParams params = new BookSearchParams();
        PagedResponse<Book> expected = PagedResponse.empty();
        
        when(redisTemplate.opsForValue().get(anyString()))
            .thenReturn(expected);
        
        // When
        PagedResponse<Book> result = queryService.searchBooks(params);
        
        // Then
        assertEquals(expected, result);
        verify(bookRepository, never()).searchBooks(any());
    }
}
```

### Integration Tests
```java
@SpringBootTest
@Testcontainers
class BookControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
    
    @Container
    static RedisContainer<?> redis = new RedisContainer<>("redis:7");
    
    @Test
    void getBooks_ShouldReturnPaginatedResponse() {
        // Test API endpoints với real database
    }
}
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Indexes cho queries thường xuyên
CREATE INDEX idx_book_title_author ON books(title, author);
CREATE INDEX idx_book_category ON books(category_id);
CREATE INDEX idx_book_isbn ON books(isbn);
CREATE INDEX idx_book_copy_status ON book_copies(status);
CREATE INDEX idx_book_copy_library ON book_copies(library_id);
CREATE INDEX idx_borrowing_status ON borrowings(status);
CREATE INDEX idx_borrowing_dates ON borrowings(borrow_date, due_date);
```

### Multi-Layer Cache Strategy
- **L1 Cache (Caffeine):** In-memory cache cho hot data (5-10 phút)
- **L2 Cache (Redis):** Distributed cache cho shared data (15-60 phút)
- **Cache Keys:** Structured naming convention
- **TTL:** Different TTL cho different data types
- **Cache Patterns:** Cache-aside, Write-through, Write-behind

### Query Optimization
- Sử dụng pagination cho tất cả list queries
- Lazy loading cho relationships
- Batch processing cho bulk operations
- Connection pooling optimization
- Specification pattern cho dynamic queries

## 🔒 Security

### Input Validation
```java
@Validated
@RestController
public class BookController {
    
    @PostMapping
    public ResponseEntity<StandardResponse<Book>> createBook(
            @Valid @RequestBody CreateBookCommand request) {
        // Validation tự động với @Valid
    }
}
```

### Authentication & Authorization
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/librarian/**").hasRole("LIBRARIAN")
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM openjdk:21-jdk-slim
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Configuration
```yaml
# application-prod.yml
spring:
  profiles: prod
  datasource:
    url: ${JDBC_DATABASE_URL}
    username: ${JDBC_DATABASE_USERNAME}
    password: ${JDBC_DATABASE_PASSWORD}
  redis:
    host: ${REDIS_HOST}
    password: ${REDIS_PASSWORD}
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS}
```

## 📋 Development Guidelines

### Code Standards
- **Naming:** Descriptive names, không viết tắt
- **Comments:** Chỉ comment cho business logic phức tạp
- **Constants:** Sử dụng constants thay vì hardcoded strings
- **Error Handling:** Consistent error handling pattern
- **Logging:** Structured logging với appropriate levels

### Git Workflow
1. **Feature Branch:** Tạo branch cho mỗi feature
2. **Commit Messages:** Descriptive commit messages
3. **Pull Request:** Code review trước khi merge
4. **Testing:** Tất cả tests phải pass

### Code Review Checklist
- [ ] Business logic đúng
- [ ] Performance considerations
- [ ] Security implications
- [ ] Error handling
- [ ] Test coverage
- [ ] Documentation updates
- [ ] Cache strategy
- [ ] Event handling

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Book management với multi-layer caching
- [x] User management
- [x] Borrowing system
- [x] Event-driven architecture với Kafka
- [x] Multi-layer caching (Caffeine + Redis)
- [x] Basic reporting

### Phase 2: Advanced Features
- [ ] QR code scanning
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Advanced search với Elasticsearch

### Phase 3: Enterprise Features
- [ ] Multi-tenant support
- [ ] Advanced security
- [ ] Integration APIs
- [ ] Performance monitoring
- [ ] Microservices architecture

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report Bugs**
   - Check existing issues to avoid duplicates
   - Provide detailed reproduction steps
   - Include environment details and logs

2. **Suggest Enhancements**
   - Open an issue with the `enhancement` label
   - Describe the use case and benefits
   - Include mockups if applicable

3. **Submit Code Changes**
   ```bash
   # Fork the repository
   git clone https://github.com/your-username/Library-Management.git
   cd Library-Management
   
   # Create a feature branch
   git checkout -b feature/amazing-feature
   
   # Make your changes
   git add .
   git commit -m "Add amazing feature"
   
   # Push to the branch
   git push origin feature/amazing-feature
   
   # Open a Pull Request
   ```

4. **Code Review Process**
   - All PRs require at least two approvals
   - Ensure all tests pass
   - Update documentation as needed
   - Follow the code style guide

## 📚 Documentation

- [API Reference](/docs/api/README.md)
- [Deployment Guide](/docs/deployment/README.md)
- [Developer Guide](/docs/development/README.md)
- [Architecture Decision Records](/docs/adr/README.md)

## 🛠️ Development Workflow

### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

### Commit Message Convention
```
<type>(<scope>): <subject>
<BLANK LINE>
[optional body]
<BLANK LINE>
[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code changes that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

## 📈 Monitoring & Operations

### Health Checks
- Application Health: `GET /actuator/health`
- Database Health: `GET /actuator/health/db`
- Disk Space: `GET /actuator/health/diskSpace`

### Metrics
- Prometheus: `GET /actuator/prometheus`
- Metrics Dashboard: `GET /actuator/metrics`

### Logging
- Log Levels: `POST /actuator/loggers/{logger.name}
- Logfile: `GET /actuator/logfile`

## 📞 Support

### Need Help?
- **Documentation**: Check our [documentation site](https://library-docs.university.edu)
- **Community**: Join our [Discord server](https://discord.gg/library-community)
- **Email**: support@library.university.edu
- **Office Hours**: Monday-Friday, 9AM-5PM (GMT+7)

### Security Issues
Please report security vulnerabilities to security@library.university.edu. We appreciate your efforts to responsibly disclose your findings.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ by University IT Team**  
© 2025 University Library Management System. All rights reserved.