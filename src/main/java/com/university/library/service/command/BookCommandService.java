package com.university.library.service.command;

import com.university.library.constants.BookConstants;
import com.university.library.dto.BookResponse;
import com.university.library.dto.CreateBookCommand;
import com.university.library.entity.Book;
import com.university.library.entity.Category;
import com.university.library.event.book.BookCreatedEvent;
import com.university.library.event.book.BookDeletedEvent;
import com.university.library.event.book.BookUpdatedEvent;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.ManualCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookCommandService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final ManualCacheService cacheService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Tạo sách mới với Kafka event và cache management
     */
    @Transactional
    public BookResponse createBook(CreateBookCommand command) {
        log.info(BookConstants.LOG_CREATING_BOOK, command.getTitle());
        
        // Validate ISBN uniqueness
        if (bookRepository.existsByIsbn(command.getIsbn())) {
            log.error(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
            throw new RuntimeException(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
        }
        
        // Validate category exists
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));
        
        // Create book entity
        Book book = Book.builder()
            .title(command.getTitle())
            .author(command.getAuthor())
            .publisher(command.getPublisher())
            .year(command.getPublishYear())
            .isbn(command.getIsbn())
            .category(category)
            .build();
        
        Book savedBook = bookRepository.save(book);
        BookResponse bookResponse = BookResponse.fromEntity(savedBook);
        
        // Publish Kafka event
        publishBookCreatedEvent(savedBook);
        
        // Cache the new book
        cacheBook(bookResponse);
        
        // Clear search cache to ensure fresh results
        clearSearchCache();
        
        log.info(BookConstants.LOG_BOOK_CREATED, savedBook.getBookId());
        return bookResponse;
    }
    
    /**
     * Cập nhật sách với Kafka event và cache management
     */
    @Transactional
    public BookResponse updateBook(UUID bookId, CreateBookCommand command) {
        log.info(BookConstants.LOG_UPDATING_BOOK, bookId);
        
        Book existingBook = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));
        
        // Check ISBN uniqueness if changed
        if (!existingBook.getIsbn().equals(command.getIsbn()) && 
            bookRepository.existsByIsbn(command.getIsbn())) {
            log.error(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
            throw new RuntimeException(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
        }
        
        // Validate category exists
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));
        
        // Update book fields
        existingBook.setTitle(command.getTitle());
        existingBook.setAuthor(command.getAuthor());
        existingBook.setPublisher(command.getPublisher());
        existingBook.setYear(command.getPublishYear());
        existingBook.setIsbn(command.getIsbn());
        existingBook.setCategory(category);
        
        Book updatedBook = bookRepository.save(existingBook);
        BookResponse bookResponse = BookResponse.fromEntity(updatedBook);
        
        // Publish Kafka event
        publishBookUpdatedEvent(updatedBook);
        
        // Update cache
        cacheBook(bookResponse);
        
        // Clear search cache to ensure fresh results
        clearSearchCache();
        
        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);
        return bookResponse;
    }
    
    /**
     * Xóa sách với Kafka event và cache management
     */
    @Transactional
    public void deleteBook(UUID bookId) {
        log.info(BookConstants.LOG_DELETING_BOOK, bookId);
        
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));
        
        // Check if book is in use (has active borrowings)
        if (hasActiveBorrowings(bookId)) {
            log.error(BookConstants.ERROR_BOOK_IN_USE);
            throw new RuntimeException(BookConstants.ERROR_BOOK_IN_USE);
        }
        
        // Publish Kafka event before deletion
        publishBookDeletedEvent(book);
        
        // Delete from database
        bookRepository.deleteById(bookId);
        
        // Clear cache
        clearBookCache(bookId);
        clearSearchCache();
        
        log.info(BookConstants.LOG_BOOK_DELETED, bookId);
    }
    
    /**
     * Cache book với TTL phù hợp
     */
    private void cacheBook(BookResponse bookResponse) {
        String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookResponse.getBookId();
        Duration localTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_LOCAL);
        Duration distributedTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_BOOK_DETAIL);
        
        cacheService.put(BookConstants.CACHE_NAME, cacheKey, bookResponse, localTtl, distributedTtl);
        log.debug(BookConstants.LOG_CACHING_BOOK, bookResponse.getBookId());
    }
    
    /**
     * Publish Book Created Event
     */
    private void publishBookCreatedEvent(Book book) {
        BookCreatedEvent event = BookCreatedEvent.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .publisher(book.getPublisher())
            .publishYear(book.getYear())
            .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
            .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
            .createdAt(book.getCreatedAt())
            .build();
        
        kafkaTemplate.send(BookConstants.TOPIC_BOOK_CREATED, book.getBookId().toString(), event);
        log.info(BookConstants.LOG_KAFKA_EVENT_SENT, BookConstants.EVENT_BOOK_CREATED, book.getBookId());
    }
    
    /**
     * Publish Book Updated Event
     */
    private void publishBookUpdatedEvent(Book book) {
        BookUpdatedEvent event = BookUpdatedEvent.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .publisher(book.getPublisher())
            .publishYear(book.getYear())
            .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
            .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
            .updatedAt(book.getUpdatedAt())
            .build();
        
        kafkaTemplate.send(BookConstants.TOPIC_BOOK_UPDATED, book.getBookId().toString(), event);
        log.info(BookConstants.LOG_KAFKA_EVENT_SENT, BookConstants.EVENT_BOOK_UPDATED, book.getBookId());
    }
    
    /**
     * Publish Book Deleted Event
     */
    private void publishBookDeletedEvent(Book book) {
        BookDeletedEvent event = BookDeletedEvent.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .deletedAt(book.getUpdatedAt())
            .build();
        
        kafkaTemplate.send(BookConstants.TOPIC_BOOK_DELETED, book.getBookId().toString(), event);
        log.info(BookConstants.LOG_KAFKA_EVENT_SENT, BookConstants.EVENT_BOOK_DELETED, book.getBookId());
    }
    
    /**
     * Kiểm tra xem sách có đang được mượn không
     */
    private boolean hasActiveBorrowings(UUID bookId) {
        // TODO: Implement check for active borrowings
        // This would typically query the Borrowing entity
        return false;
    }
    
    /**
     * Xóa cache cho một book cụ thể
     */
    private void clearBookCache(UUID bookId) {
        String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookId;
        cacheService.evict(BookConstants.CACHE_NAME, cacheKey);
        log.info(BookConstants.LOG_CACHE_EVICTED, bookId);
    }
    
    /**
     * Xóa toàn bộ search cache
     */
    private void clearSearchCache() {
        cacheService.evictAll(BookConstants.CACHE_NAME);
        log.info(BookConstants.SUCCESS_CACHE_CLEARED);
    }
    
    /**
     * Publish Cache Evict Event cho distributed cache
     */
    public void publishCacheEvictEvent(UUID bookId) {
        CacheEvictEvent event = new CacheEvictEvent(BookConstants.EVENT_CACHE_EVICT, bookId, System.currentTimeMillis());
        
        kafkaTemplate.send(BookConstants.TOPIC_BOOK_CACHE_EVICT, bookId.toString(), event);
        log.info(BookConstants.LOG_KAFKA_EVENT_SENT, BookConstants.EVENT_CACHE_EVICT, bookId);
    }
    
    /**
     * Bulk cache eviction cho nhiều books
     */
    public void clearBooksCache(List<UUID> bookIds) {
        for (UUID bookId : bookIds) {
            clearBookCache(bookId);
            publishCacheEvictEvent(bookId);
        }
        log.info("Cleared cache for {} books", bookIds.size());
    }
    
    /**
     * Inner class cho Cache Evict Event
     */
    private static class CacheEvictEvent {
        private final String eventType;
        private final UUID bookId;
        private final long timestamp;
        
        public CacheEvictEvent(String eventType, UUID bookId, long timestamp) {
            this.eventType = eventType;
            this.bookId = bookId;
            this.timestamp = timestamp;
        }
        
        public String getEventType() { return eventType; }
        public UUID getBookId() { return bookId; }
        public long getTimestamp() { return timestamp; }
    }
} 