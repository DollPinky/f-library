# BookCopy Implementation Documentation

## Overview

This document describes the complete implementation of the BookCopy domain following the established architectural patterns in the Library Management System. The implementation includes DTOs, constants, repository, services (Query and Command), facade, and controller layers.

## Architecture Pattern

The BookCopy implementation follows the same architectural patterns as Book and Category:

- **CQRS (Command Query Responsibility Segregation)**: Separation of read and write operations
- **Facade Pattern**: Unified service layer that orchestrates operations
- **Multi-layer Caching**: Local (Caffeine) and distributed (Redis) caching
- **Event-driven Architecture**: Kafka events for domain changes
- **Repository Pattern**: Data access layer with JPA specifications
- **DTO Pattern**: Data transfer objects for API communication

## Files Created/Modified

### 1. Constants
- **File**: `src/main/java/com/university/library/constants/BookCopyConstants.java`
- **Purpose**: Centralized constants for BookCopy domain
- **Key Constants**:
  - Cache names and TTL values
  - Kafka topics for events
  - Error and success messages
  - API endpoint patterns
  - Validation messages

### 2. DTOs (Data Transfer Objects)

#### BookCopyResponse.java
- **File**: `src/main/java/com/university/library/dto/BookCopyResponse.java`
- **Purpose**: Response DTO for BookCopy data
- **Key Features**:
  - Nested `BookResponse` and `LibraryResponse`
  - QR code, status, shelf location
  - Borrowing count
  - `fromEntity()` and `fromEntitySimple()` methods
  - Status enum conversion

#### CreateBookCopyCommand.java
- **File**: `src/main/java/com/university/library/dto/CreateBookCopyCommand.java`
- **Purpose**: Command DTO for creating/updating BookCopy
- **Key Features**:
  - Validation annotations (`@NotBlank`, `@NotNull`, `@Size`)
  - Book ID and Library ID references
  - QR code and shelf location
  - Status enum with default value

#### BookCopySearchParams.java
- **File**: `src/main/java/com/university/library/dto/BookCopySearchParams.java`
- **Purpose**: Search parameters DTO for BookCopy queries
- **Key Features**:
  - Query string for text search
  - Book ID and Library ID filters
  - Status filtering
  - Available/Borrowed only flags
  - Pagination and sorting parameters

### 3. Repository Layer

#### BookCopyRepository.java
- **File**: `src/main/java/com/university/library/repository/BookCopyRepository.java`
- **Modifications**:
  - Extended `JpaSpecificationExecutor<BookCopy>`
  - Added custom query methods:
    - `findByBookBookId(UUID bookId)`
    - `findByLibraryLibraryId(UUID libraryId)`
    - `findByStatus(BookCopy.BookStatus status)`
    - `findByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status)`
    - `existsByQrCode(String qrCode)`
    - `findByQrCode(String qrCode)`
    - `findByShelfLocationContainingIgnoreCase(String shelfLocation)`
    - `countByStatus(BookCopy.BookStatus status)`
    - `countByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status)`

### 4. Service Layer

#### BookCopyQueryService.java
- **File**: `src/main/java/com/university/library/service/query/BookCopyQueryService.java`
- **Purpose**: Handles all read operations for BookCopy
- **Key Methods**:
  - `getBookCopyById(UUID bookCopyId)`
  - `searchBookCopies(BookCopySearchParams params)`
  - `getBookCopiesByBookId(UUID bookId)`
  - `getBookCopiesByLibraryId(UUID libraryId)`
  - `getAvailableBookCopiesByBookId(UUID bookId)`
  - `getBookCopyByQrCode(String qrCode)`
  - Cache management methods
  - Search specification building

#### BookCopyCommandService.java
- **File**: `src/main/java/com/university/library/service/command/BookCopyCommandService.java`
- **Purpose**: Handles all write operations for BookCopy
- **Key Methods**:
  - `createBookCopy(CreateBookCopyCommand command)`
  - `updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command)`
  - `deleteBookCopy(UUID bookCopyId)`
  - `changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus)`
  - Kafka event publishing
  - Cache invalidation
  - Business validations

#### BookCopyFacade.java
- **File**: `src/main/java/com/university/library/service/BookCopyFacade.java`
- **Purpose**: Unified service layer combining query and command operations
- **Key Features**:
  - Delegates to appropriate service (Query/Command)
  - Cache operations coordination
  - Health check functionality
  - Service orchestration

### 5. Controller Layer

#### BookCopyController.java
- **File**: `src/main/java/com/university/library/controller/BookCopyController.java`
- **Purpose**: REST API endpoints for BookCopy management
- **Key Endpoints**:

#### Query Endpoints
- `GET /api/v1/book-copies/{bookCopyId}` - Get book copy by ID
- `GET /api/v1/book-copies` - Search book copies with filters
- `GET /api/v1/book-copies/book/{bookId}` - Get copies by book ID
- `GET /api/v1/book-copies/library/{libraryId}` - Get copies by library ID
- `GET /api/v1/book-copies/available/book/{bookId}` - Get available copies by book ID
- `GET /api/v1/book-copies/qr/{qrCode}` - Get book copy by QR code

#### Command Endpoints
- `POST /api/v1/book-copies` - Create new book copy
- `PUT /api/v1/book-copies/{bookCopyId}` - Update book copy
- `DELETE /api/v1/book-copies/{bookCopyId}` - Delete book copy
- `PATCH /api/v1/book-copies/{bookCopyId}/status` - Change book copy status

#### Cache Management Endpoints
- `DELETE /api/v1/book-copies/{bookCopyId}/cache` - Clear specific book copy cache
- `DELETE /api/v1/book-copies/cache/search` - Clear search cache
- `DELETE /api/v1/book-copies/cache` - Clear all cache
- `POST /api/v1/book-copies/cache/bulk-clear` - Bulk clear cache
- `GET /api/v1/book-copies/{bookCopyId}/cache/status` - Get cache status

#### Health Check Endpoint
- `GET /api/v1/book-copies/health` - Service health check

## Key Features

### 1. Caching Strategy
- **Multi-layer Caching**: Local (Caffeine) + Distributed (Redis)
- **Cache Keys**: Structured with prefixes for different types
- **TTL Management**: Different TTL for different data types
- **Cache Invalidation**: Automatic on data changes

### 2. Search and Filtering
- **Text Search**: QR code, shelf location, book title, author, library name
- **Status Filtering**: Available, borrowed, reserved, lost, damaged
- **Relationship Filtering**: By book ID, library ID
- **Pagination**: Page, size, total elements, total pages
- **Sorting**: Multiple fields with direction

### 3. Business Validations
- **QR Code Uniqueness**: Ensures unique QR codes across all book copies
- **Status Transitions**: Validates status changes
- **Deletion Constraints**: Prevents deletion of borrowed copies
- **Required Fields**: Validates mandatory data

### 4. Event Publishing
- **Kafka Events**: Domain events for all CRUD operations
- **Event Types**:
  - `book-copy.created`
  - `book-copy.updated`
  - `book-copy.deleted`
  - `book-copy.status.changed`
  - `book-copy.cache.evict`

### 5. Error Handling
- **Comprehensive Error Messages**: Localized error messages
- **Exception Handling**: Proper HTTP status codes
- **Logging**: Detailed logging for debugging
- **Validation**: Bean validation with custom messages

## API Examples

### Create Book Copy
```bash
POST /api/v1/book-copies
Content-Type: application/json

{
  "bookId": "123e4567-e89b-12d3-a456-426614174000",
  "libraryId": "123e4567-e89b-12d3-a456-426614174001",
  "qrCode": "QR-123456789",
  "shelfLocation": "A1-B2-C3",
  "status": "AVAILABLE"
}
```

### Search Book Copies
```bash
GET /api/v1/book-copies?query=QR-123&bookId=123e4567-e89b-12d3-a456-426614174000&status=AVAILABLE&page=0&size=10&sortBy=createdAt&sortDirection=DESC
```

### Change Status
```bash
PATCH /api/v1/book-copies/123e4567-e89b-12d3-a456-426614174002/status?status=BORROWED
```

### Get by QR Code
```bash
GET /api/v1/book-copies/qr/QR-123456789
```

## Cache Management

### Cache Keys Structure
- `book-copy:{bookCopyId}` - Individual book copy
- `book:{bookId}` - Book copies by book
- `library:{libraryId}` - Book copies by library
- `status:available:book:{bookId}` - Available copies by book
- `search:{query}:{filters}:{pagination}` - Search results

### Cache TTL Values
- **Book Copy Detail**: 20 minutes
- **Book Copy Search**: 15 minutes
- **Book Copy List**: 25 minutes
- **Local Cache**: 8 minutes

## Testing Considerations

### Unit Tests
- Service layer testing with mocks
- Repository layer testing
- DTO validation testing
- Cache behavior testing

### Integration Tests
- API endpoint testing
- Database integration testing
- Cache integration testing
- Kafka event testing

### Performance Tests
- Cache hit/miss ratio testing
- Search performance testing
- Bulk operations testing

## Monitoring and Observability

### Metrics
- Cache hit/miss ratios
- API response times
- Error rates
- Kafka event publishing success rates

### Logging
- Structured logging with correlation IDs
- Performance logging
- Error logging with stack traces
- Business event logging

### Health Checks
- Service availability
- Cache service health
- Database connectivity
- Kafka connectivity

## Future Enhancements

### Potential Improvements
1. **Bulk Operations**: Batch create/update/delete operations
2. **Advanced Search**: Full-text search with Elasticsearch
3. **Audit Trail**: Track all changes with timestamps
4. **Soft Delete**: Implement soft delete instead of hard delete
5. **Status Workflow**: Implement status transition rules
6. **QR Code Generation**: Automatic QR code generation
7. **Barcode Support**: Add barcode support alongside QR codes
8. **Location Tracking**: Track book copy movements
9. **Maintenance Scheduling**: Schedule maintenance for damaged copies
10. **Analytics**: Usage analytics and reporting

### Scalability Considerations
1. **Database Indexing**: Optimize database indexes for search queries
2. **Cache Partitioning**: Partition cache by library or region
3. **Read Replicas**: Use read replicas for query operations
4. **Event Sourcing**: Consider event sourcing for audit trails
5. **Microservices**: Split into separate microservice if needed

## Conclusion

The BookCopy implementation successfully follows the established architectural patterns and provides a comprehensive solution for managing book copies in the library system. The implementation includes all necessary layers (DTOs, repository, services, facade, controller) with proper caching, event publishing, and error handling.

The code is well-structured, follows best practices, and provides a solid foundation for future enhancements and scalability requirements. 