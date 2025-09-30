package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.dto.response.bookCopy.BookCopyResponse;
import com.university.library.dto.request.bookCopy.BookCopySearchParams;
import com.university.library.dto.request.bookCopy.CreateBookCopyCommand;
import com.university.library.dto.request.bookCopy.CreateBookCopyFromBookCommand;
import com.university.library.entity.BookCopy;
import com.university.library.service.BookCopyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    private final BookCopyService bookCopyService;

    // ==================== QUERY ENDPOINTS ====================



    @GetMapping(value = "/generate-all-qr-codes", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Generate PDF with all QR codes", description = "Generate a PDF file containing all QR codes with book information")
    public ResponseEntity<byte[]> generateAllQRCodesPDF() {
        log.info("Generating PDF with all QR codes");

        try {
            byte[] pdfBytes = bookCopyService.generateAllQRCodesPDF();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=all-book-qr-codes.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            log.error("Error generating QR codes PDF: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Failed to generate PDF: " + e.getMessage()).getBytes());
        }
    }


    @GetMapping(value = "/generate-qr/{bookCopyid}", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate QR code image for booking")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable String bookCopyid) {
        try {
            byte[] qrImage = bookCopyService.generateQRCodeImage(bookCopyid);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrImage);
        } catch (Exception e) {
            log.error("Failed to generate QR code", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{bookCopyId}")
    @Operation(summary = "Get book copy by ID", description = "Retrieve detailed information about a specific book copy")
    public ResponseEntity<StandardResponse<BookCopyResponse>> getBookCopyById(
            @Parameter(description = "Book Copy ID", required = true)
            @PathVariable String bookCopyId) {

        log.info("Getting book copy by ID: {}", bookCopyId);

        try {
            BookCopyResponse bookCopy = bookCopyService.getBookCopyById(bookCopyId);
            return ResponseEntity.ok(StandardResponse.success("Book copy retrieved successfully", bookCopy));
        } catch (Exception e) {
            log.error("Error getting book copy {}: {}", bookCopyId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error("Book copy not found"));
        }
    }




    @GetMapping("/search")
    @Operation(summary = "Search book copies", description = "Search book copies with pagination and filters")
    public ResponseEntity<StandardResponse<PagedResponse<BookCopyResponse>>> searchBookCopies(
            @Parameter(description = "Search parameters")
            @ModelAttribute BookCopySearchParams params) {

        log.info("Searching book copies with params: {}", params);

        try {
            PagedResponse<BookCopyResponse> result = bookCopyService.searchBookCopies(params);
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
            List<BookCopyResponse> bookCopies = bookCopyService.getBookCopiesByBookId(bookId);
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
            List<BookCopyResponse> bookCopies = bookCopyService.getAvailableBookCopiesByBookId(bookId);
            return ResponseEntity.ok(StandardResponse.success("Available book copies retrieved successfully", bookCopies));
        } catch (Exception e) {
            log.error("Error getting available book copies for book {}: {}", bookId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Failed to get available book copies"));
        }
    }




    // ==================== COMMAND ENDPOINTS ====================

    @PostMapping("/create")
    @Operation(summary = "Create book copies from book", description = "Create multiple book copies for an existing book")
    public ResponseEntity<StandardResponse<String>> createBookCopiesFromBook(
            @Parameter(description = "Book copy creation data", required = true)
            @Valid @RequestBody CreateBookCopyFromBookCommand command) {

        log.info("Creating {} book copies for book: {}", command.getCopies().size(), command.getBookId());

        try {
            bookCopyService.createBookCopiesFromBook(command);
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
            @PathVariable String bookCopyId,
            @Parameter(description = "Updated book copy data", required = true)
            @Valid @RequestBody CreateBookCopyCommand command) {

        log.info("Updating book copy: {}", bookCopyId);

        try {
            BookCopyResponse updatedBookCopy = bookCopyService.updateBookCopy(bookCopyId, command);
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
            @PathVariable String bookCopyId,
            @Parameter(description = "New status", required = true)
            @RequestParam CreateBookCopyCommand.BookStatus status) {

        log.info("Changing book copy status: {} -> {}", bookCopyId, status);

        try {
            BookCopyResponse updatedBookCopy = bookCopyService.changeBookCopyStatus(bookCopyId, status);
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
            @PathVariable String bookCopyId) {

        log.info("Deleting book copy: {}", bookCopyId);

        try {
            bookCopyService.deleteBookCopy(bookCopyId);
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

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getByCategory(@PathVariable UUID categoryId) {
        List<BookCopyResponse> copies = bookCopyService.findByCategory(categoryId);
        return ResponseEntity.ok(StandardResponse.success(copies));
    }

    @GetMapping("/category/{categoryId}/status/{status}")
    public ResponseEntity<StandardResponse<List<BookCopyResponse>>> getByCategoryAndStatus(
            @PathVariable UUID categoryId,
            @PathVariable BookCopy.BookStatus status) {
        List<BookCopyResponse> copies = bookCopyService.findByCategoryAndStatus(categoryId, status);
        return ResponseEntity.ok(StandardResponse.success(copies));
    }
}

