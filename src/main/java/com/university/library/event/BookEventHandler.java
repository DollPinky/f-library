package com.university.library.event;

import com.university.library.constants.BookConstants;
import com.university.library.event.book.BookCreatedEvent;
import com.university.library.event.book.BookDeletedEvent;
import com.university.library.event.book.BookUpdatedEvent;
import com.university.library.service.ManualCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookEventHandler {

    private final ManualCacheService cacheService;

    /**
     * Xử lý Book Created Event
     * - Clear search cache để đảm bảo kết quả tìm kiếm mới nhất
     */
    @KafkaListener(topics = BookConstants.TOPIC_BOOK_CREATED, groupId = "book-events")
    public void handleBookCreated(BookCreatedEvent event) {
        log.info(BookConstants.LOG_KAFKA_EVENT_RECEIVED, BookConstants.EVENT_BOOK_CREATED, event.getBookId());
        
        try {
            // Clear search cache để đảm bảo kết quả tìm kiếm mới nhất
            cacheService.evictAll(BookConstants.CACHE_NAME);
            log.info("Cleared search cache after book creation: {}", event.getBookId());
            
            // Có thể thêm logic khác như:
            // - Gửi notification
            // - Update analytics
            // - Sync với external systems
            
        } catch (Exception e) {
            log.error("Error handling book created event for book: {} - {}", event.getBookId(), e.getMessage());
        }
    }

    /**
     * Xử lý Book Updated Event
     * - Clear book cache và search cache
     */
    @KafkaListener(topics = BookConstants.TOPIC_BOOK_UPDATED, groupId = "book-events")
    public void handleBookUpdated(BookUpdatedEvent event) {
        log.info(BookConstants.LOG_KAFKA_EVENT_RECEIVED, BookConstants.EVENT_BOOK_UPDATED, event.getBookId());
        
        try {
            // Clear specific book cache
            String bookCacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + event.getBookId();
            cacheService.evict(BookConstants.CACHE_NAME, bookCacheKey);
            log.info("Cleared book cache after update: {}", event.getBookId());
            
            // Clear search cache để đảm bảo kết quả tìm kiếm mới nhất
            cacheService.evictAll(BookConstants.CACHE_NAME);
            log.info("Cleared search cache after book update: {}", event.getBookId());
            
            // Có thể thêm logic khác như:
            // - Gửi notification về thay đổi
            // - Update audit log
            // - Sync với external systems
            
        } catch (Exception e) {
            log.error("Error handling book updated event for book: {} - {}", event.getBookId(), e.getMessage());
        }
    }

    /**
     * Xử lý Book Deleted Event
     * - Clear book cache và search cache
     */
    @KafkaListener(topics = BookConstants.TOPIC_BOOK_DELETED, groupId = "book-events")
    public void handleBookDeleted(BookDeletedEvent event) {
        log.info(BookConstants.LOG_KAFKA_EVENT_RECEIVED, BookConstants.EVENT_BOOK_DELETED, event.getBookId());
        
        try {
            // Clear specific book cache
            String bookCacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + event.getBookId();
            cacheService.evict(BookConstants.CACHE_NAME, bookCacheKey);
            log.info("Cleared book cache after deletion: {}", event.getBookId());
            
            // Clear search cache để đảm bảo kết quả tìm kiếm mới nhất
            cacheService.evictAll(BookConstants.CACHE_NAME);
            log.info("Cleared search cache after book deletion: {}", event.getBookId());
            
            // Có thể thêm logic khác như:
            // - Gửi notification về xóa sách
            // - Update analytics
            // - Archive data
            
        } catch (Exception e) {
            log.error("Error handling book deleted event for book: {} - {}", event.getBookId(), e.getMessage());
        }
    }

    /**
     * Xử lý Cache Evict Event từ các service khác
     * - Clear cache theo yêu cầu từ distributed system
     */
    @KafkaListener(topics = BookConstants.TOPIC_BOOK_CACHE_EVICT, groupId = "cache-events")
    public void handleCacheEvict(Object event) {
        try {
            // Parse event để lấy bookId
            // Trong thực tế, bạn sẽ có một DTO cụ thể cho event này
            log.info("Received cache evict event: {}", event);
            
            // Clear specific cache hoặc all cache tùy theo event
            cacheService.evictAll(BookConstants.CACHE_NAME);
            log.info("Cleared cache based on evict event");
            
        } catch (Exception e) {
            log.error("Error handling cache evict event: {}", e.getMessage());
        }
    }

    /**
     * Xử lý Book Borrowed Event
     * - Có thể cần update cache nếu có thông tin về availability
     */
    @KafkaListener(topics = BookConstants.TOPIC_BOOK_BORROWED, groupId = "book-events")
    public void handleBookBorrowed(Object event) {
        log.info("Received book borrowed event: {}", event);
        
        try {
            // Clear book cache để đảm bảo thông tin availability mới nhất
            // Trong thực tế, bạn sẽ parse event để lấy bookId
            cacheService.evictAll(BookConstants.CACHE_NAME);
            log.info("Cleared cache after book borrowed event");
            
        } catch (Exception e) {
            log.error("Error handling book borrowed event: {}", e.getMessage());
        }
    }

    /**
     * Xử lý Book Returned Event
     * - Có thể cần update cache nếu có thông tin về availability
     */
    @KafkaListener(topics = BookConstants.TOPIC_BOOK_RETURNED, groupId = "book-events")
    public void handleBookReturned(Object event) {
        log.info("Received book returned event: {}", event);
        
        try {
            // Clear book cache để đảm bảo thông tin availability mới nhất
            // Trong thực tế, bạn sẽ parse event để lấy bookId
            cacheService.evictAll(BookConstants.CACHE_NAME);
            log.info("Cleared cache after book returned event");
            
        } catch (Exception e) {
            log.error("Error handling book returned event: {}", e.getMessage());
        }
    }
} 