# Library Implementation Documentation

## Overview

This document describes the complete implementation of the Library domain following the established architectural patterns in the Library Management System. The implementation includes DTOs, constants, repository, services (Query and Command), facade, and controller layers.

## Architecture Pattern

The Library implementation follows the same architectural patterns as Book, Category, and BookCopy:

- **CQRS (Command Query Responsibility Segregation)**: Separation of read and write operations
- **Facade Pattern**: Unified service layer that orchestrates operations
- **Multi-layer Caching**: Local (Caffeine) and distributed (Redis) caching
- **Event-driven Architecture**: Kafka events for domain changes
- **Repository Pattern**: Data access layer with JPA specifications
- **DTO Pattern**: Data transfer objects for API communication

## Files Created/Modified

### 1. Constants
- **File**: `src/main/java/com/university/library/constants/LibraryConstants.java`
- **Purpose**: Centralized constants for Library domain
- **Key Constants**:
  - Cache names and TTL values
  - Kafka topics for events
  - Error and success messages
  - API endpoint patterns
  - Validation messages

### 2. DTOs (Data Transfer Objects)

#### LibraryResponse.java
- **File**: `src/main/java/com/university/library/dto/LibraryResponse.java`
- **Purpose**: Response DTO for Library data
- **Key Features**:
  - Nested `CampusResponse` data
  - Library name, code, address
  - Book copy count and staff count
  - `fromEntity()` and `fromEntitySimple()` methods
  - Campus relationship handling

#### CreateLibraryCommand.java
- **File**: `src/main/java/com/university/library/dto/CreateLibraryCommand.java`
- **Purpose**: Command DTO for creating/updating Library
- **Key Features**:
  - Validation annotations (`@NotBlank`, `@NotNull`, `@Size`)
  - Library name, code, address
  - Campus ID reference
  - Field length constraints

#### LibrarySearchParams.java
- **File**: `src/main/java/com/university/library/dto/LibrarySearchParams.java`
- **Purpose**: Search parameters DTO for Library queries
- **Key Features**:
  - Query string for text search
  - Campus ID filtering
  - Has book copies/staff flags
  - Pagination and sorting parameters

### 3. Repository Layer

#### LibraryRepository.java
- **File**: `src/main/java/com/university/library/repository/LibraryRepository.java`
- **Modifications**:
  - Extended `JpaSpecificationExecutor<Library>`
  - Added custom query methods:
    - `findByCode(String code)`
    - `findByCampusCampusId(UUID campusId)`
    - `existsByCode(String code)`
    - `findByNameContainingIgnoreCase(String name)`
    - `findByCodeContainingIgnoreCase(String code)`
    - `findByAddressContainingIgnoreCase(String address)`
    - `countBooksByLibraryId(UUID libraryId)`
    - `countStaffByLibraryId(UUID libraryId)`

#### CampusRepository.java
- **File**: `src/main/java/com/university/library/repository/CampusRepository.java`
- **Purpose**: Repository for Campus entity
- **Key Methods**:
  - `findByCode(String code)`
  - `existsByCode(String code)`

### 4. Service Layer

#### LibraryQueryService.java
- **File**: `src/main/java/com/university/library/service/query/LibraryQueryService.java`
- **Purpose**: Handles all read operations for Library
- **Key Methods**:
  - `getLibraryById(UUID libraryId)`
  - `searchLibraries(LibrarySearchParams params)`
  - `getLibrariesByCampusId(UUID campusId)`
  - `getLibraryByCode(String code)`
  - `getAllLibraries()`
  - Cache management methods
  - Search specification building

#### LibraryCommandService.java
- **File**: `src/main/java/com/university/library/service/command/LibraryCommandService.java`
- **Purpose**: Handles all write operations for Library
- **Key Methods**:
  - `createLibrary(CreateLibraryCommand command)`
  - `updateLibrary(UUID libraryId, CreateLibraryCommand command)`
  - `deleteLibrary(UUID libraryId)`
  - Kafka event publishing
  - Cache invalidation
  - Business validations

#### LibraryFacade.java
- **File**: `src/main/java/com/university/library/service/LibraryFacade.java`
- **Purpose**: Unified service layer combining query and command operations
- **Key Features**:
  - Delegates to appropriate service (Query/Command)
  - Cache operations coordination
  - Health check functionality
  - Service orchestration

### 5. Controller Layer

#### LibraryController.java
- **File**: `src/main/java/com/university/library/controller/LibraryController.java`
- **Purpose**: REST API endpoints for Library management
- **Key Endpoints**:

#### Query Endpoints
- `GET /api/v1/libraries/{libraryId}` - Get library by ID
- `GET /api/v1/libraries` - Search libraries with filters
- `GET /api/v1/libraries/campus/{campusId}` - Get libraries by campus ID
- `GET /api/v1/libraries/code/{code}` - Get library by code
- `GET /api/v1/libraries/all` - Get all libraries

#### Command Endpoints
- `POST /api/v1/libraries` - Create new library
- `PUT /api/v1/libraries/{libraryId}` - Update library
- `DELETE /api/v1/libraries/{libraryId}` - Delete library

#### Cache Management Endpoints
- `DELETE /api/v1/libraries/{libraryId}/cache` - Clear specific library cache
- `DELETE /api/v1/libraries/cache/search` - Clear search cache
- `DELETE /api/v1/libraries/cache` - Clear all cache
- `POST /api/v1/libraries/cache/bulk-clear` - Bulk clear cache
- `GET /api/v1/libraries/{libraryId}/cache/status` - Get cache status

#### Health Check Endpoint
- `GET /api/v1/libraries/health` - Service health check

## Key Features

### 1. Caching Strategy
- **Multi-layer Caching**: Local (Caffeine) + Distributed (Redis)
- **Cache Keys**: Structured with prefixes for different types
- **TTL Management**: Different TTL for different data types
- **Cache Invalidation**: Automatic on data changes

### 2. Search and Filtering
- **Text Search**: Library name, code, address, campus name
- **Campus Filtering**: By campus ID
- **Relationship Filtering**: Has book copies, has staff
- **Pagination**: Page, size, total elements, total pages
- **Sorting**: Multiple fields with direction

### 3. Business Validations
- **Code Uniqueness**: Ensures unique library codes across all libraries
- **Campus Validation**: Validates campus exists when creating/updating
- **Deletion Constraints**: Prevents deletion of libraries with book copies or staff
- **Required Fields**: Validates mandatory data

### 4. Event Publishing
- **Kafka Events**: Domain events for all CRUD operations
- **Event Types**:
  - `library.created`
  - `library.updated`
  - `library.deleted`
  - `library.cache.evict`

### 5. Error Handling
- **Comprehensive Error Messages**: Localized error messages
- **Exception Handling**: Proper HTTP status codes
- **Logging**: Detailed logging for debugging
- **Validation**: Bean validation with custom messages

## API Examples

### Create Library
```bash
POST /api/v1/libraries
Content-Type: application/json

{
  "name": "Main Library",
  "code": "ML001",
  "address": "123 University Street, City",
  "campusId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Search Libraries
```bash
GET /api/v1/libraries?query=Main&campusId=123e4567-e89b-12d3-a456-426614174000&hasBookCopies=true&page=0&size=10&sortBy=name&sortDirection=ASC
```

### Get by Code
```bash
GET /api/v1/libraries/code/ML001
```

### Get by Campus
```bash
GET /api/v1/libraries/campus/123e4567-e89b-12d3-a456-426614174000
```

## Cache Management

### Cache Keys Structure
- `library:{libraryId}` - Individual library
- `campus:{campusId}` - Libraries by campus
- `code:{code}` - Library by code
- `all` - All libraries
- `search:{query}:{filters}:{pagination}` - Search results

### Cache TTL Values
- **Library Detail**: 30 minutes
- **Library Search**: 20 minutes
- **Library List**: 35 minutes
- **Local Cache**: 10 minutes

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
5. **Library Hierarchy**: Support for library branches and sub-libraries
6. **Capacity Management**: Track library capacity and usage
7. **Operating Hours**: Manage library operating hours
8. **Contact Information**: Add contact details for libraries
9. **Location Services**: Add GPS coordinates and maps integration
10. **Analytics**: Usage analytics and reporting

### Scalability Considerations
1. **Database Indexing**: Optimize database indexes for search queries
2. **Cache Partitioning**: Partition cache by campus or region
3. **Read Replicas**: Use read replicas for query operations
4. **Event Sourcing**: Consider event sourcing for audit trails
5. **Microservices**: Split into separate microservice if needed

## Conclusion

The Library implementation successfully follows the established architectural patterns and provides a comprehensive solution for managing libraries in the library system. The implementation includes all necessary layers (DTOs, repository, services, facade, controller) with proper caching, event publishing, and error handling.

The code is well-structured, follows best practices, and provides a solid foundation for future enhancements and scalability requirements.

## Note on Controller Issues

There are some linter errors in the `LibraryController.java` related to `StandardResponse.success()` method parameter order. These need to be fixed by ensuring the correct parameter order: `success(String message, T data)` instead of `success(T data, String message)`. The same pattern should be applied to all similar method calls throughout the controller. 