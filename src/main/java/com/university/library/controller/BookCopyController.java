package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.BookCopySearchParams;
import com.university.library.dto.CreateBookCopyCommand;
import com.university.library.dto.CreateBookCopyFromBookCommand;
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

    // ==================== QUERY ENDPOINTS ====================

    @GetMapping("/{bookCopyId}")
    @Operation(summary = "Get book copy by ID", description = "Retrieve detailed information about a specific book copy")
    public ResponseEntity<StandardResponse<BookCopyResponse>> getBookCopyById(
            @Parameter(description = "Book Copy ID", required = true)
            @PathVariable UUID bookCopyId) {
        
        log.info("Getting book copy by ID: {}", bookCopyId);
        
        try {
            BookCopyResponse bookCopy = bookCopyFacade.getBookCopyById(bookCopyId);
            return ResponseEntity.ok(StandardResponse.success("Book copy retrieved successfully", bookCopy));
        } catch (Exception e) {
            log.error("Error getting book copy {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error("Book copy not found"));
        }
    }

    @GetMapping
    @Operation(summary = "Search book copies", description = "Search book copies with pagination and filters")
    public ResponseEntity<StandardResponse<PagedResponse<BookCopyResponse>>> searchBookCopies(
            @Parameter(description = "Search parameters")
            @ModelAttribute BookCopySearchParams params) {
        
        log.info("Searching book copies with params: {}", params);
        
        try {
            PagedResponse<BookCopyResponse> result = bookCopyFacade.searchBookCopies(params);
            return ResponseEntity.ok(StandardResponse.success("Book copies retrieved successfully", result));
        } catch (Exception e) {
            log.error("Error searching book copies: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to search book copies"));
        }
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get book copies by book ID", description = "Retrieve all book copies for a specific book")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getBookCopiesByBookId(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId) {
        
        log.info("Getting book copies for book: {}", bookId);
        
        try {
            List<BookCopyResponse> bookCopies = bookCopyFacade.getBookCopiesByBookId(bookId);
            return ResponseEntity.ok(StandardResponse.success("Book copies retrieved successfully", bookCopies));
        } catch (Exception e) {
            log.error("Error getting book copies for book {}: {}", bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to get book copies"));
        }
    }

    @GetMapping("/book/{bookId}/available")
    @Operation(summary = "Get available book copies by book ID", description = "Retrieve available book copies for a specific book")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getAvailableBookCopiesByBookId(
            @Parameter(description = "Book ID", required = true)
            @PathVariable UUID bookId) {
        
        log.info("Getting available book copies for book: {}", bookId);
        
        try {
            List<BookCopyResponse> bookCopies = bookCopyFacade.getAvailableBookCopiesByBookId(bookId);
            return ResponseEntity.ok(StandardResponse.success("Available book copies retrieved successfully", bookCopies));
        } catch (Exception e) {
            log.error("Error getting available book copies for book {}: {}", bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to get available book copies"));
        }
    }

    @GetMapping("/library/{libraryId}")
    @Operation(summary = "Get book copies by library ID", description = "Retrieve all book copies in a specific library")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getBookCopiesByLibraryId(
            @Parameter(description = "Library ID", required = true)
            @PathVariable UUID libraryId) {
        
        log.info("Getting book copies for library: {}", libraryId);
        
        try {
            List<BookCopyResponse> bookCopies = bookCopyFacade.getBookCopiesByLibraryId(libraryId);
            return ResponseEntity.ok(StandardResponse.success("Book copies retrieved successfully", bookCopies));
        } catch (Exception e) {
            log.error("Error getting book copies for library {}: {}", libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to get book copies"));
        }
    }

    @GetMapping("/qr/{qrCode}")
    @Operation(summary = "Get book copy by QR code", description = "Retrieve book copy information by QR code")
    public ResponseEntity<StandardResponse<BookCopyResponse>> getBookCopyByQrCode(
            @Parameter(description = "QR Code", required = true)
            @PathVariable String qrCode) {
        
        log.info("Getting book copy by QR code: {}", qrCode);
        
        try {
            BookCopyResponse bookCopy = bookCopyFacade.getBookCopyByQrCode(qrCode);
            return ResponseEntity.ok(StandardResponse.success("Book copy retrieved successfully", bookCopy));
        } catch (Exception e) {
            log.error("Error getting book copy by QR code {}: {}", qrCode, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error("Book copy not found"));
        }
    }

    // ==================== COMMAND ENDPOINTS ====================

    @PostMapping
    @Operation(summary = "Create new book copy", description = "Create a new book copy in the library system")
    public ResponseEntity<StandardResponse<BookCopyResponse>> createBookCopy(
            @Parameter(description = "Book copy creation data", required = true)
            @Valid @RequestBody CreateBookCopyCommand command) {
        
        log.info("Creating new book copy with QR code: {}", command.getQrCode());
        
        try {
            BookCopyResponse createdBookCopy = bookCopyFacade.createBookCopy(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Book copy created successfully", createdBookCopy));
        } catch (RuntimeException e) {
            log.error("Error creating book copy: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating book copy: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to create book copy"));
        }
    }

    @PostMapping("/from-book")
    @Operation(summary = "Create book copies from book", description = "Create multiple book copies for an existing book")
    public ResponseEntity<StandardResponse<String>> createBookCopiesFromBook(
            @Parameter(description = "Book copy creation data", required = true)
            @Valid @RequestBody CreateBookCopyFromBookCommand command) {
        
        log.info("Creating {} book copies for book: {}", command.getCopies().size(), command.getBookId());
        
        try {
            bookCopyFacade.createBookCopiesFromBook(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success("Book copies created successfully", null));
        } catch (RuntimeException e) {
            log.error("Error creating book copies: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating book copies: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to create book copies"));
        }
    }

    @PutMapping("/{bookCopyId}")
    @Operation(summary = "Update book copy", description = "Update an existing book copy's information")
    public ResponseEntity<StandardResponse<BookCopyResponse>> updateBookCopy(
            @Parameter(description = "Book Copy ID", required = true)
            @PathVariable UUID bookCopyId,
            @Parameter(description = "Updated book copy data", required = true)
            @Valid @RequestBody CreateBookCopyCommand command) {
        
        log.info("Updating book copy: {}", bookCopyId);
        
        try {
            BookCopyResponse updatedBookCopy = bookCopyFacade.updateBookCopy(bookCopyId, command);
            return ResponseEntity.ok(StandardResponse.success("Book copy updated successfully", updatedBookCopy));
        } catch (RuntimeException e) {
            log.error("Error updating book copy {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error updating book copy {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to update book copy"));
        }
    }

    @PutMapping("/{bookCopyId}/status")
    @Operation(summary = "Change book copy status", description = "Change the status of a book copy")
    public ResponseEntity<StandardResponse<BookCopyResponse>> changeBookCopyStatus(
            @Parameter(description = "Book Copy ID", required = true)
            @PathVariable UUID bookCopyId,
            @Parameter(description = "New status", required = true)
            @RequestParam CreateBookCopyCommand.BookStatus status) {
        
        log.info("Changing book copy status: {} -> {}", bookCopyId, status);
        
        try {
            BookCopyResponse updatedBookCopy = bookCopyFacade.changeBookCopyStatus(bookCopyId, status);
            return ResponseEntity.ok(StandardResponse.success("Book copy status changed successfully", updatedBookCopy));
        } catch (RuntimeException e) {
            log.error("Error changing book copy status {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error changing book copy status {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to change book copy status"));
        }
    }

    @DeleteMapping("/{bookCopyId}")
    @Operation(summary = "Delete book copy", description = "Delete a book copy from the library system")
    public ResponseEntity<StandardResponse<String>> deleteBookCopy(
            @Parameter(description = "Book Copy ID", required = true)
            @PathVariable UUID bookCopyId) {
        
        log.info("Deleting book copy: {}", bookCopyId);
        
        try {
            bookCopyFacade.deleteBookCopy(bookCopyId);
            return ResponseEntity.ok(StandardResponse.success("Book copy deleted successfully", null));
        } catch (RuntimeException e) {
            log.error("Error deleting book copy {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error deleting book copy {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Failed to delete book copy"));
        }
    }

    // ==================== HEALTH CHECK ENDPOINT ====================

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check the health status of the book copy service")
    public ResponseEntity<StandardResponse<HealthStatus>> healthCheck() {
        
        log.info("Book copy service health check");
        
        try {
            boolean isHealthy = bookCopyFacade.isHealthy();
            HealthStatus status = new HealthStatus("BookCopyService", isHealthy, System.currentTimeMillis());
            
            if (isHealthy) {
                return ResponseEntity.ok(StandardResponse.success("Service is healthy", status));
            } else {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(StandardResponse.error("Service is unhealthy"));
            }
        } catch (Exception e) {
            log.error("Health check failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(StandardResponse.error("Health check failed"));
        }
    }

    // ==================== INNER CLASSES ====================

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

