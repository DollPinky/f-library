# Hệ Thống Quản Lý Thư Viện Đại Học

Hệ thống quản lý thư viện hiện đại cho môi trường đại học đa phân hiệu

## 🏗️ Kiến Trúc Hệ Thống

### Công Nghệ Sử Dụng
- **Backend:** Java 21 + Spring Boot 3.2.0
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** PostgreSQL 15 (production), H2 (development)
- **Cache:** Redis + Caffeine (multi-tier caching)
- **Message Queue:** Apache Kafka
- **Build Tool:** Gradle 8.5+
- **Container:** Docker + Docker Compose

### Cấu Trúc Thư Mục
```
Library-Management/
├── src/main/java/com/university/library/
│   ├── base/                    # Base classes và utilities
│   ├── config/                  # Cấu hình Spring
│   ├── constants/               # Constants và enums
│   ├── controller/              # REST Controllers
│   ├── dto/                     # Data Transfer Objects
│   ├── entity/                  # JPA Entities
│   ├── facade/                  # Facade layer (CQRS)
│   ├── service/                 # Business logic services
│   │   ├── command/            # Command services (CUD operations)
│   │   └── query/              # Query services (R operations)
│   ├── repository/              # Data access layer
│   ├── mapper/                  # Object mapping
│   └── event/                   # Event handling
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
# Khởi động PostgreSQL, Redis, Kafka
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
- **Redis UI:** http://localhost:8082

## 📊 Mô Hình Dữ Liệu

### Entities Chính
- **Campus:** Phân hiệu đại học (Hà Nội, TP.HCM, Đà Nẵng)
- **Library:** Thư viện tại mỗi phân hiệu
- **User:** Người dùng (Reader, Librarian, Admin, Manager)
- **Category:** Danh mục sách (hierarchical)
- **Book:** Thông tin sách (ISBN level)
- **BookCopy:** Bản sao vật lý (QR code tracking)
- **Borrowing:** Giao dịch mượn/trả sách

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

### 1. Controller Layer (REST API)
```java
@RestController
@RequestMapping("/api/books")
public class BookController {
    
    @GetMapping
    public ResponseEntity<StandardResponse<PagedResponse<Book>>> getBooks(
            BookSearchParams params) {
        // Chỉ xử lý HTTP request/response
        // Không chứa business logic
    }
}
```

**Nguyên tắc:**
- Chỉ xử lý HTTP request/response
- Validate input parameters
- Gọi Facade service
- Return ResponseEntity<StandardResponse<T>>
- Không chứa business logic

### 2. Facade Layer (CQRS Pattern)
```java
@Service
public class BookFacade {
    
    private final BookQueryService queryService;
    private final BookCommandService commandService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public PagedResponse<Book> searchBooks(BookSearchParams params) {
        return queryService.searchBooks(params);
    }
    
    public Book createBook(CreateBookCommand command) {
        Book book = commandService.createBook(command);
        // Gửi event qua Kafka
        kafkaTemplate.send("book-events", new BookCreatedEvent(book));
        return book;
    }
}
```

**Nguyên tắc:**
- Orchestrate giữa Query và Command services
- Xử lý events và notifications
- Không chứa business logic phức tạp

### 3. Service Layer (CQRS)
```java
// Query Service - Chỉ đọc dữ liệu
@Service
public class BookQueryService {
    
    private final BookRepository bookRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    
    public PagedResponse<Book> searchBooks(BookSearchParams params) {
        // Cache key
        String cacheKey = "books:search:" + params.hashCode();
        
        // Kiểm tra cache
        PagedResponse<Book> cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        // Query database
        Page<Book> books = bookRepository.searchBooks(params);
        PagedResponse<Book> response = PagedResponse.fromPage(books);
        
        // Cache kết quả
        redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(10));
        
        return response;
    }
}

// Command Service - Chỉ thay đổi dữ liệu
@Service
public class BookCommandService {
    
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    
    @Transactional
    public Book createBook(CreateBookCommand command) {
        // Validate business rules
        validateBookCreation(command);
        
        // Create book
        Book book = BookMapper.toEntity(command);
        book = bookRepository.save(book);
        
        // Create book copies
        createBookCopies(book, command.getCopies());
        
        return book;
    }
}
```

**Nguyên tắc:**
- **Query Service:** Chỉ đọc dữ liệu, sử dụng cache, không có transaction
- **Command Service:** Chỉ thay đổi dữ liệu, có transaction, gửi events
- Tách biệt rõ ràng giữa đọc và ghi

### 4. Repository Layer
```java
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // Chỉ sử dụng method names, không @Query
    List<Book> findByCategoryIdAndStatus(Long categoryId, String status);
    
    // Sử dụng Specification cho complex queries
    Page<Book> findAll(Specification<Book> spec, Pageable pageable);
    
    // Custom query chỉ khi thực sự cần thiết
    @Query("SELECT b FROM Book b WHERE b.title LIKE %:keyword% OR b.author LIKE %:keyword%")
    Page<Book> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
```

**Nguyên tắc:**
- Không viết derived queries phức tạp
- Sử dụng method names đơn giản
- Chỉ dùng @Query khi thực sự cần thiết
- Tối ưu truy vấn với indexes

### 5. Event Handling
```java
@Component
public class BookEventHandler {
    
    @KafkaListener(topics = "book-events")
    public void handleBookEvent(BookEvent event) {
        switch (event.getType()) {
            case BOOK_CREATED:
                handleBookCreated((BookCreatedEvent) event);
                break;
            case BOOK_UPDATED:
                handleBookUpdated((BookUpdatedEvent) event);
                break;
        }
    }
    
    private void handleBookCreated(BookCreatedEvent event) {
        // Update cache
        // Send notifications
        // Update search index
    }
}
```

## 🔧 Cấu Hình Hệ Thống

### Application Properties
```yaml
# Database
spring.datasource.url: jdbc:postgresql://localhost:5432/library
spring.datasource.username: postgres
spring.datasource.password: password

# Redis Cache
spring.redis.host: localhost
spring.redis.port: 6379
spring.cache.type: redis

# Kafka
spring.kafka.bootstrap-servers: localhost:9092
spring.kafka.consumer.group-id: library-group

# JPA
spring.jpa.hibernate.ddl-auto: validate
spring.jpa.show-sql: false
spring.jpa.properties.hibernate.format_sql: true
```

### Cache Strategy
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
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
CREATE INDEX idx_borrowing_status ON borrowings(status);
CREATE INDEX idx_borrowing_dates ON borrowings(borrow_date, due_date);
```

### Cache Strategy
- **L1 Cache (Caffeine):** In-memory cache cho hot data
- **L2 Cache (Redis):** Distributed cache cho shared data
- **Cache Keys:** Structured naming convention
- **TTL:** Different TTL cho different data types

### Query Optimization
- Sử dụng pagination cho tất cả list queries
- Lazy loading cho relationships
- Batch processing cho bulk operations
- Connection pooling optimization

## 🔒 Security

### Input Validation
```java
@Validated
@RestController
public class BookController {
    
    @PostMapping
    public ResponseEntity<StandardResponse<Book>> createBook(
            @Valid @RequestBody CreateBookRequest request) {
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

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Book management
- [x] User management
- [x] Borrowing system
- [x] Basic reporting

### Phase 2: Advanced Features
- [ ] QR code scanning
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 3: Enterprise Features
- [ ] Multi-tenant support
- [ ] Advanced security
- [ ] Integration APIs
- [ ] Performance monitoring

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