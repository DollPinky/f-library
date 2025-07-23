package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.service.BookFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@Tag(name = "Book Management", description = "APIs for managing books in the library system")
public class BookController {

    private final BookFacade bookFacade;

    // ==================== QUERY ENDPOINTS ====================

    @GetMapping("/{bookId}")
    @Operation(summary = "Get book by ID", description = "Retrieve detailed information about a specific book")
    public ResponseEntity<StandardResponse<BookResponse>> getBookById(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId) {
        
        log.info(BookConstants.API_GET_BOOK, bookId);
        
        try {
            BookResponse book = bookFacade.getBookById(bookId);
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_BOOK_RETRIEVED, book));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_GET_BOOK, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));
        }
    }

    @GetMapping
    @Operation(summary = "Search books", description = "Search books with pagination and filters")
    public ResponseEntity<StandardResponse<PagedResponse<BookResponse>>> searchBooks(
            @Parameter(description = "Search parameters")
            @ModelAttribute BookSearchParams params) {
        
        log.info(BookConstants.API_SEARCH_BOOKS, params);
        
        try {
            PagedResponse<BookResponse> result = bookFacade.searchBooks(params);
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_BOOKS_RETRIEVED, result));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_SEARCH_BOOKS, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_SEARCH_FAILED));
        }
    }

    // ==================== COMMAND ENDPOINTS ====================

    @PostMapping
    @Operation(summary = "Create new book", description = "Create a new book in the library system")
    public ResponseEntity<StandardResponse<BookResponse>> createBook(
            @Parameter(description = "Book creation data", required = true)
            @Valid @RequestBody CreateBookCommand command) {
        
        log.info(BookConstants.API_CREATE_BOOK, command.getTitle());
        
        try {
            BookResponse createdBook = bookFacade.createBook(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success(BookConstants.SUCCESS_BOOK_CREATED, createdBook));
        } catch (RuntimeException e) {
            log.error(BookConstants.ERROR_LOG_CREATE_BOOK, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_UNEXPECTED_CREATE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_INVALID_BOOK_DATA));
        }
    }

    @PutMapping("/{bookId}")
    @Operation(summary = "Update book", description = "Update an existing book's information")
    public ResponseEntity<StandardResponse<BookResponse>> updateBook(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId,
            @Parameter(description = "Updated book data", required = true)
            @Valid @RequestBody CreateBookCommand command) {
        
        log.info(BookConstants.API_UPDATE_BOOK, bookId);
        
        try {
            BookResponse updatedBook = bookFacade.updateBook(bookId, command);
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_BOOK_UPDATED, updatedBook));
        } catch (RuntimeException e) {
            log.error(BookConstants.ERROR_LOG_UPDATE_BOOK, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_UNEXPECTED_UPDATE, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_INVALID_BOOK_DATA));
        }
    }

    @DeleteMapping("/{bookId}")
    @Operation(summary = "Delete book", description = "Delete a book from the library system")
    public ResponseEntity<StandardResponse<String>> deleteBook(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId) {
        
        log.info(BookConstants.API_DELETE_BOOK, bookId);
        
        try {
            bookFacade.deleteBook(bookId);
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_BOOK_DELETED, null));
        } catch (RuntimeException e) {
            log.error(BookConstants.ERROR_LOG_DELETE_BOOK, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_UNEXPECTED_DELETE, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_DELETE_FAILED));
        }
    }

    // ==================== CACHE MANAGEMENT ENDPOINTS ====================

    @DeleteMapping("/{bookId}/cache")
    @Operation(summary = "Clear book cache", description = "Clear cache for a specific book")
    public ResponseEntity<StandardResponse<String>> clearBookCache(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId) {
        
        log.info(BookConstants.API_CLEAR_BOOK_CACHE, bookId);
        
        try {
            bookFacade.clearBookCache(bookId);
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_CLEAR_CACHE, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    @DeleteMapping("/cache/search")
    @Operation(summary = "Clear search cache", description = "Clear all search cache")
    public ResponseEntity<StandardResponse<String>> clearSearchCache() {
        
        log.info(BookConstants.API_CLEAR_SEARCH_CACHE);
        
        try {
            bookFacade.clearSearchCache();
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_CLEAR_SEARCH_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    @DeleteMapping("/cache")
    @Operation(summary = "Clear all cache", description = "Clear all book-related cache")
    public ResponseEntity<StandardResponse<String>> clearAllCache() {
        
        log.info(BookConstants.API_CLEAR_ALL_CACHE);
        
        try {
            bookFacade.clearAllCache();
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_CLEAR_ALL_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    @PostMapping("/cache/bulk-clear")
    @Operation(summary = "Clear multiple books cache", description = "Clear cache for multiple books")
    public ResponseEntity<StandardResponse<String>> clearBooksCache(
            @Parameter(description = "List of book IDs", required = true)
            @RequestBody List<UUID> bookIds) {
        
        log.info(BookConstants.API_BULK_CLEAR_CACHE, bookIds.size());
        
        try {
            bookFacade.clearBooksCache(bookIds);
            return ResponseEntity.ok(StandardResponse.success(String.format(BookConstants.SUCCESS_CACHE_BULK_CLEARED, bookIds.size()), null));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_BULK_CLEAR_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    // ==================== CACHE INFORMATION ENDPOINTS ====================

    @GetMapping("/{bookId}/cache/status")
    @Operation(summary = "Get book cache status", description = "Check if a book is cached and get TTL")
    public ResponseEntity<StandardResponse<BookCacheStatus>> getBookCacheStatus(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId) {
        
        log.info(BookConstants.API_CACHE_STATUS, bookId);
        
        try {
            boolean isCached = bookFacade.isBookCached(bookId);
            Long ttl = bookFacade.getBookCacheTtl(bookId);
            
            BookCacheStatus status = new BookCacheStatus(bookId, isCached, ttl);
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_CACHE_STATUS_RETRIEVED, status));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_CACHE_STATUS, bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_CACHE_STATUS_FAILED));
        }
    }

    @GetMapping("/cache/statistics")
    @Operation(summary = "Get cache statistics", description = "Get cache performance statistics")
    public ResponseEntity<StandardResponse<BookFacade.CacheStatistics>> getCacheStatistics() {
        
        log.info(BookConstants.API_CACHE_STATS);
        
        try {
            BookFacade.CacheStatistics stats = bookFacade.getCacheStatistics();
            return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_CACHE_STATS_RETRIEVED, stats));
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_CACHE_STATS, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(BookConstants.ERROR_CACHE_STATS_FAILED));
        }
    }

    // ==================== HEALTH CHECK ENDPOINT ====================

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check the health status of the book service")
    public ResponseEntity<StandardResponse<HealthStatus>> healthCheck() {
        
        log.info(BookConstants.API_HEALTH_CHECK);
        
        try {
            boolean isHealthy = bookFacade.isHealthy();
            HealthStatus status = new HealthStatus(BookConstants.SERVICE_NAME, isHealthy, System.currentTimeMillis());
            
            if (isHealthy) {
                return ResponseEntity.ok(StandardResponse.success(BookConstants.SUCCESS_SERVICE_HEALTHY, status));
            } else {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(StandardResponse.error(BookConstants.ERROR_SERVICE_UNHEALTHY));
            }
        } catch (Exception e) {
            log.error(BookConstants.ERROR_LOG_HEALTH_CHECK, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(StandardResponse.error(BookConstants.ERROR_HEALTH_CHECK_FAILED));
        }
    }

    // ==================== INNER CLASSES ====================

    public static class BookCacheStatus {
        private final UUID bookId;
        private final boolean isCached;
        private final Long ttlSeconds;

        public BookCacheStatus(UUID bookId, boolean isCached, Long ttlSeconds) {
            this.bookId = bookId;
            this.isCached = isCached;
            this.ttlSeconds = ttlSeconds;
        }

        public UUID getBookId() { return bookId; }
        public boolean isCached() { return isCached; }
        public Long getTtlSeconds() { return ttlSeconds; }
    }

    public static class HealthStatus {
        private final String serviceName;
        private final boolean healthy;
        private final long timestamp;

        public HealthStatus(String serviceName, boolean healthy, long timestamp) {
            this.serviceName = serviceName;
            this.healthy = healthy;
            this.timestamp = timestamp;
        }

        public String getServiceName() { return serviceName; }
        public boolean isHealthy() { return healthy; }
        public long getTimestamp() { return timestamp; }
    }
}
