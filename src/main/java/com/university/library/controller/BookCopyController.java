package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.BookCopySearchParams;
import com.university.library.dto.CreateBookCopyCommand;
import com.university.library.service.BookCopyFacade;
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
@RequestMapping("/api/v1/book-copies")
@RequiredArgsConstructor
@Tag(name = "Book Copy Management", description = "APIs for managing book copies in the library system")
public class BookCopyController {
    
    private final BookCopyFacade bookCopyFacade;
    
    @GetMapping("/{bookCopyId}")
    @Operation(summary = "Get book copy by ID", description = "Retrieve a specific book copy by its ID")
    public ResponseEntity<StandardResponse<BookCopyResponse>> getBookCopyById(
            @Parameter(description = "Book copy ID") @PathVariable UUID bookCopyId) {
        try {
            log.info(BookCopyConstants.API_GET_BOOK_COPY, bookCopyId);
            BookCopyResponse response = bookCopyFacade.getBookCopyById(bookCopyId);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPY_RETRIEVED, response));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_GET_BOOK_COPY, bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        }
    }
    
    @GetMapping
    @Operation(summary = "Search book copies", description = "Search and filter book copies with pagination")
    public ResponseEntity<StandardResponse<PagedResponse<BookCopyResponse>>> searchBookCopies(
            @Parameter(description = "Search parameters") @ModelAttribute BookCopySearchParams params) {
        try {
            log.info(BookCopyConstants.API_SEARCH_BOOK_COPIES, params);
            PagedResponse<BookCopyResponse> response = bookCopyFacade.searchBookCopies(params);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_SEARCH_BOOK_COPIES, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_SEARCH_FAILED));
        }
    }
    
    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get book copies by book ID", description = "Retrieve all copies of a specific book")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getBookCopiesByBookId(
            @Parameter(description = "Book ID") @PathVariable UUID bookId) {
        try {
            log.info(BookCopyConstants.API_GET_BY_BOOK, bookId);
            List<BookCopyResponse> response = bookCopyFacade.getBookCopiesByBookId(bookId);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting book copies by book ID: {} - {}", bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Error retrieving book copies"));
        }
    }
    
    @GetMapping("/library/{libraryId}")
    @Operation(summary = "Get book copies by library ID", description = "Retrieve all book copies in a specific library")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getBookCopiesByLibraryId(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId) {
        try {
            log.info(BookCopyConstants.API_GET_BY_LIBRARY, libraryId);
            List<BookCopyResponse> response = bookCopyFacade.getBookCopiesByLibraryId(libraryId);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting book copies by library ID: {} - {}", libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Error retrieving book copies"));
        }
    }
    
    @GetMapping("/available/book/{bookId}")
    @Operation(summary = "Get available book copies by book ID", description = "Retrieve available copies of a specific book")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getAvailableBookCopiesByBookId(
            @Parameter(description = "Book ID") @PathVariable UUID bookId) {
        try {
            List<BookCopyResponse> response = bookCopyFacade.getAvailableBookCopiesByBookId(bookId);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting available book copies by book ID: {} - {}", bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Error retrieving available book copies"));
        }
    }
    
    @GetMapping("/qr/{qrCode}")
    @Operation(summary = "Get book copy by QR code", description = "Retrieve a book copy by its QR code")
    public ResponseEntity<StandardResponse<BookCopyResponse>> getBookCopyByQrCode(
            @Parameter(description = "QR code") @PathVariable String qrCode) {
        try {
            BookCopyResponse response = bookCopyFacade.getBookCopyByQrCode(qrCode);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPY_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting book copy by QR code: {} - {}", qrCode, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardResponse.error("Book copy not found with QR code: " + qrCode));
        }
    }
    
    @PostMapping
    @Operation(summary = "Create book copy", description = "Create a new book copy")
    public ResponseEntity<StandardResponse<BookCopyResponse>> createBookCopy(
            @Parameter(description = "Book copy data") @Valid @RequestBody CreateBookCopyCommand command) {
        try {
            log.info(BookCopyConstants.API_CREATE_BOOK_COPY, command.getQrCode());
            BookCopyResponse response = bookCopyFacade.createBookCopy(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPY_CREATED, response));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_CREATE_BOOK_COPY, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{bookCopyId}")
    @Operation(summary = "Update book copy", description = "Update an existing book copy")
    public ResponseEntity<StandardResponse<BookCopyResponse>> updateBookCopy(
            @Parameter(description = "Book copy ID") @PathVariable UUID bookCopyId,
            @Parameter(description = "Updated book copy data") @Valid @RequestBody CreateBookCopyCommand command) {
        try {
            log.info(BookCopyConstants.API_UPDATE_BOOK_COPY, bookCopyId);
            BookCopyResponse response = bookCopyFacade.updateBookCopy(bookCopyId, command);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPY_UPDATED, response));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_UPDATE_BOOK_COPY, bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{bookCopyId}")
    @Operation(summary = "Delete book copy", description = "Delete a book copy")
    public ResponseEntity<StandardResponse<Void>> deleteBookCopy(
            @Parameter(description = "Book copy ID") @PathVariable UUID bookCopyId) {
        try {
            log.info(BookCopyConstants.API_DELETE_BOOK_COPY, bookCopyId);
            bookCopyFacade.deleteBookCopy(bookCopyId);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_BOOK_COPY_DELETED, null));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_DELETE_BOOK_COPY, bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/{bookCopyId}/status")
    @Operation(summary = "Change book copy status", description = "Change the status of a book copy")
    public ResponseEntity<StandardResponse<BookCopyResponse>> changeBookCopyStatus(
            @Parameter(description = "Book copy ID") @PathVariable UUID bookCopyId,
            @Parameter(description = "New status") @RequestParam CreateBookCopyCommand.BookStatus status) {
        try {
            log.info(BookCopyConstants.API_CHANGE_STATUS, bookCopyId);
            BookCopyResponse response = bookCopyFacade.changeBookCopyStatus(bookCopyId, status);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_STATUS_CHANGED, response));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_CHANGE_STATUS, bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{bookCopyId}/cache")
    @Operation(summary = "Clear book copy cache", description = "Clear cache for a specific book copy")
    public ResponseEntity<StandardResponse<BookCopyCacheStatus>> clearBookCopyCache(
            @Parameter(description = "Book copy ID") @PathVariable UUID bookCopyId) {
        try {
            log.info(BookCopyConstants.API_CLEAR_BOOK_COPY_CACHE, bookCopyId);
            boolean wasCached = bookCopyFacade.isBookCopyCached(bookCopyId);
            bookCopyFacade.clearBookCopyCache(bookCopyId);
            
            BookCopyCacheStatus status = new BookCopyCacheStatus(bookCopyId, wasCached, false);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_CACHE_CLEARED, status));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_CLEAR_CACHE, bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @DeleteMapping("/cache/search")
    @Operation(summary = "Clear search cache", description = "Clear all book copy search cache")
    public ResponseEntity<StandardResponse<Void>> clearSearchCache() {
        try {
            log.info(BookCopyConstants.API_CLEAR_SEARCH_CACHE);
            bookCopyFacade.clearSearchCache();
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_CLEAR_SEARCH_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @DeleteMapping("/cache")
    @Operation(summary = "Clear all cache", description = "Clear all book copy cache")
    public ResponseEntity<StandardResponse<Void>> clearAllCache() {
        try {
            log.info(BookCopyConstants.API_CLEAR_ALL_CACHE);
            bookCopyFacade.clearAllCache();
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_CLEAR_ALL_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @PostMapping("/cache/bulk-clear")
    @Operation(summary = "Bulk clear cache", description = "Clear cache for multiple book copies")
    public ResponseEntity<StandardResponse<Void>> bulkClearCache(
            @Parameter(description = "List of book copy IDs") @RequestBody List<UUID> bookCopyIds) {
        try {
            log.info(BookCopyConstants.API_BULK_CLEAR_CACHE, bookCopyIds.size());
            bookCopyFacade.clearBookCopiesCache(bookCopyIds);
            return ResponseEntity.ok(StandardResponse.success(String.format(BookCopyConstants.SUCCESS_CACHE_BULK_CLEARED, bookCopyIds.size()), null));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_BULK_CLEAR_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @GetMapping("/{bookCopyId}/cache/status")
    @Operation(summary = "Get cache status", description = "Get cache status for a specific book copy")
    public ResponseEntity<StandardResponse<BookCopyCacheStatus>> getCacheStatus(
            @Parameter(description = "Book copy ID") @PathVariable UUID bookCopyId) {
        try {
            log.info(BookCopyConstants.API_CACHE_STATUS, bookCopyId);
            boolean isCached = bookCopyFacade.isBookCopyCached(bookCopyId);
            Long ttl = bookCopyFacade.getBookCopyCacheTtl(bookCopyId);
            
            BookCopyCacheStatus status = new BookCopyCacheStatus(bookCopyId, isCached, ttl);
            return ResponseEntity.ok(StandardResponse.success(BookCopyConstants.SUCCESS_CACHE_STATUS_RETRIEVED, status));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_CACHE_STATUS, bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_CACHE_STATUS_FAILED));
        }
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check the health of the book copy service")
    public ResponseEntity<StandardResponse<HealthStatus>> healthCheck() {
        try {
            log.info(BookCopyConstants.API_HEALTH_CHECK);
            boolean isHealthy = bookCopyFacade.isHealthy();
            
            HealthStatus status = new HealthStatus(isHealthy, BookCopyConstants.SERVICE_NAME);
            String message = isHealthy ? BookCopyConstants.SUCCESS_SERVICE_HEALTHY : BookCopyConstants.ERROR_SERVICE_UNHEALTHY;
            
            return ResponseEntity.ok(StandardResponse.success(message, status));
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_LOG_HEALTH_CHECK, e.getMessage());
            HealthStatus status = new HealthStatus(false, BookCopyConstants.SERVICE_NAME);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(StandardResponse.error(BookCopyConstants.ERROR_SERVICE_UNHEALTHY, status));
        }
    }
    
    public static class BookCopyCacheStatus {
        private final UUID bookCopyId;
        private final boolean isCached;
        private final Long ttl;
        
        public BookCopyCacheStatus(UUID bookCopyId, boolean isCached, Long ttl) {
            this.bookCopyId = bookCopyId;
            this.isCached = isCached;
            this.ttl = ttl;
        }
        
        public BookCopyCacheStatus(UUID bookCopyId, boolean isCached, boolean wasCached) {
            this.bookCopyId = bookCopyId;
            this.isCached = isCached;
            this.ttl = null;
        }
        
        public UUID getBookCopyId() { return bookCopyId; }
        public boolean isCached() { return isCached; }
        public Long getTtl() { return ttl; }
    }
    
    public static class HealthStatus {
        private final boolean healthy;
        private final String serviceName;
        
        public HealthStatus(boolean healthy, String serviceName) {
            this.healthy = healthy;
            this.serviceName = serviceName;
        }
        
        public boolean isHealthy() { return healthy; }
        public String getServiceName() { return serviceName; }
    }
} 