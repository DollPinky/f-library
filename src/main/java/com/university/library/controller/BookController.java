package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.entity.Book;
import com.university.library.service.BookFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    
    private final BookFacade bookFacade;
    
    @GetMapping
    public ResponseEntity<StandardResponse<PagedResponse<Book>>> getBooks(
            @Valid BookSearchParams params) {
        log.info("GET /api/books with params: {}", params);
        
        try {
            PagedResponse<Book> books = bookFacade.searchBooks(params);
            StandardResponse<PagedResponse<Book>> response = StandardResponse.success(
                "Lấy danh sách sách thành công", books);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting books: ", e);
            StandardResponse<PagedResponse<Book>> response = StandardResponse.error(
                "Không thể lấy danh sách sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Lấy thông tin sách theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse<Book>> getBook(@PathVariable Long id) {
        log.info("GET /api/books/{}", id);
        
        try {
            Book book = bookFacade.getBookById(id);
            StandardResponse<Book> response = StandardResponse.success(
                "Lấy thông tin sách thành công", book);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Book not found with id: {}", id);
            StandardResponse<Book> response = StandardResponse.error(
                "Không tìm thấy sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            log.error("Error getting book: ", e);
            StandardResponse<Book> response = StandardResponse.error(
                "Không thể lấy thông tin sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Tạo sách mới
     */
    @PostMapping
    public ResponseEntity<StandardResponse<Book>> createBook(
            @Valid @RequestBody CreateBookCommand command) {
        log.info("POST /api/books with title: {}", command.getTitle());
        
        try {
            Book book = bookFacade.createBook(command);
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
    
    /**
     * Cập nhật thông tin sách
     */
    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse<Book>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody CreateBookCommand command) {
        log.info("PUT /api/books/{} with title: {}", id, command.getTitle());
        
        try {
            Book book = bookFacade.updateBook(id, command);
            StandardResponse<Book> response = StandardResponse.success(
                "Cập nhật sách thành công", book);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error updating book: ", e);
            StandardResponse<Book> response = StandardResponse.error(
                "Không thể cập nhật sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Error updating book: ", e);
            StandardResponse<Book> response = StandardResponse.error(
                "Không thể cập nhật sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Xóa sách
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse<Void>> deleteBook(@PathVariable Long id) {
        log.info("DELETE /api/books/{}", id);
        
        try {
            bookFacade.deleteBook(id);
            StandardResponse<Void> response = StandardResponse.success(
                "Xóa sách thành công", null);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error deleting book: ", e);
            StandardResponse<Void> response = StandardResponse.error(
                "Không thể xóa sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Error deleting book: ", e);
            StandardResponse<Void> response = StandardResponse.error(
                "Không thể xóa sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Tìm kiếm sách theo từ khóa
     */
    @GetMapping("/search")
    public ResponseEntity<StandardResponse<PagedResponse<Book>>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("GET /api/books/search with keyword: {}", keyword);
        
        try {
            BookSearchParams params = BookSearchParams.builder()
                .query(keyword)
                .page(page)
                .size(size)
                .build();
            
            PagedResponse<Book> books = bookFacade.searchBooks(params);
            StandardResponse<PagedResponse<Book>> response = StandardResponse.success(
                "Tìm kiếm sách thành công", books);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error searching books: ", e);
            StandardResponse<PagedResponse<Book>> response = StandardResponse.error(
                "Không thể tìm kiếm sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
