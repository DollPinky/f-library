package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.dto.UpdateBookCommand;
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
            @Valid @RequestBody UpdateBookCommand command) {
        
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

    @GetMapping("/all")
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return ResponseEntity.ok(bookFacade.getAllBooks());
    }
}

