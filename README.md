# Hệ Thống Quản Lý Thư Viện Đại Học

Hệ thống quản lý thư viện hiện đại cho môi trường đại học đa phân hiệu với multi-layer caching và event-driven architecture

## 🏗️ Kiến Trúc Hệ Thống

### Công Nghệ Sử Dụng
- **Backend:** Java 21 + Spring Boot 3.2.0
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** PostgreSQL 15 (production), H2 (development)
- **Cache:** Redis + Caffeine (multi-layer caching)
- **Message Queue:** Apache Kafka
- **Build Tool:** Gradle 8.5+
- **Container:** Docker + Docker Compose

### Cấu Trúc Thư Mục
```
Library-Management/
├── src/main/java/com/university/library/
│   ├── annotation/              # Custom annotations
│   │   ├── MultiLayerCache.java
│   │   ├── MultiLayerCacheEvict.java
│   │   └── MultiLayerCachePut.java
│   ├── aspect/                  # AOP aspects
│   │   └── MultiLayerCacheAspect.java
│   ├── base/                    # Base classes và utilities
│   ├── config/                  # Cấu hình Spring
│   ├── constants/               # Constants và enums
│   ├── controller/              # REST Controllers
│   ├── dto/                     # Data Transfer Objects
│   ├── entity/                  # JPA Entities
│   ├── event/                   # Event classes
│   ├── facade/                  # Facade layer (CQRS)
│   ├── service/                 # Business logic services
│   │   ├── command/            # Command services (CUD operations)
│   │   └── query/              # Query services (R operations)
│   ├── repository/              # Data access layer
│   └── mapper/                  # Object mapping
├── frontend/                    # Next.js frontend
└── docker-compose.yml          # Infrastructure services
```

## 🚀 Cách Chạy Dự Án

### Yêu Cầu Hệ Thống
- Java 21 trở lên
- Docker Desktop
- Node.js 18+ (cho frontend)

### Bước 1: Khởi động Infrastructure
```bash
# Khởi động PostgreSQL, Redis, Kafka, Zookeeper
docker-compose up -d

# Kiểm tra services
docker-compose ps
```

### Bước 2: Chạy Backend
```bash
# Build project
./gradlew build

# Chạy với profile docker
./gradlew bootRun --args='--spring.profiles.active=docker'
```

### Bước 3: Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

### Truy Cập Hệ Thống
- **Backend API:** http://localhost:8080
- **Frontend:** http://localhost:3002
- **API Docs:** http://localhost:8080/swagger-ui.html
- **Kafka UI:** http://localhost:8081
- **Redis Commander:** http://localhost:8082

## 📊 Mô Hình Dữ Liệu

### Entities Chính

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

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Support

- **Issues:** Tạo issue trên GitHub
- **Documentation:** Xem docs trong thư mục docs/
- **Email:** library-support@university.edu.vn

---

**Phát triển bởi Đội ngũ Công nghệ Thông tin Đại học**