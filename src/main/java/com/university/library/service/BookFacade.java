package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.entity.Book;
import com.university.library.event.BookDeletedEvent;
import com.university.library.event.BookUpdatedEvent;
import com.university.library.service.command.BookCommandService;
import com.university.library.service.query.BookQueryService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookFacade {
    
    private final BookQueryService bookQueryService;
    private final BookCommandService bookCommandService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    /**
     * Tìm kiếm sách với pagination và caching
     */
    public PagedResponse<Book> searchBooks(BookSearchParams params) {
        log.info("Searching books with params: {}", params);
        return bookQueryService.searchBooks(params);
    }
    
    /**
     * Lấy thông tin sách theo ID
     */
    public Book getBookById(Long id) {
        log.info("Getting book by id: {}", id);
        return bookQueryService.getBookById(id);
    }
    
    /**
     * Tạo sách mới với event publishing
     */
    public Book createBook(CreateBookCommand command) {
        log.info("Creating new book: {}", command.getTitle());
        
        // Tạo sách
        Book book = bookCommandService.createBook(command);
        
        // Gửi event qua Kafka
        BookCreatedEvent event = new BookCreatedEvent(book.getBookId(), book.getTitle());
        kafkaTemplate.send("book-events", event);
        
        log.info("Book created successfully with id: {}", book.getBookId());
        return book;
    }
    
    /**
     * Cập nhật thông tin sách
     */
    public Book updateBook(Long id, CreateBookCommand command) {
        log.info("Updating book with id: {}", id);
        
        Book book = bookCommandService.updateBook(id, command);
        
        BookUpdatedEvent event = new BookUpdatedEvent(id, book.getTitle());
        kafkaTemplate.send("book-events", event);
        
        return book;
    }
    
    /**
     * Xóa sách
     */
    public void deleteBook(Long id) {
        log.info("Deleting book with id: {}", id);
        
        bookCommandService.deleteBook(id);

        BookDeletedEvent event = new BookDeletedEvent(id);
        kafkaTemplate.send("book-events", event);
    }
} 