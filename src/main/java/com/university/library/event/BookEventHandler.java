package com.university.library.event;

import com.university.library.service.BookFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookEventHandler {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * Xử lý Book Created Event
     */
    @KafkaListener(topics = "book-events", groupId = "library-group")
    public void handleBookEvent(Object event) {
        try {
            if (event instanceof BookCreatedEvent) {
                handleBookCreated((BookCreatedEvent) event);
            } else if (event instanceof BookUpdatedEvent) {
                handleBookUpdated((BookUpdatedEvent) event);
            } else if (event instanceof BookDeletedEvent) {
                handleBookDeleted((BookDeletedEvent) event);
            } else {
                log.warn("Unknown event type: {}", event.getClass().getSimpleName());
            }
        } catch (Exception e) {
            log.error("Error handling book event: ", e);
        }
    }
    
    /**
     * Xử lý khi sách được tạo
     */
    private void handleBookCreated(BookCreatedEvent event) {
        log.info("Handling book created event for book: {}", event.getBookId());
        
        // Clear cache
        clearBookCache();
        
        // Có thể thêm logic khác như:
        // - Gửi notification
        // - Update search index
        // - Send email to librarians
        // - Update analytics
        
        log.info("Book created event handled successfully");
    }
    
    /**
     * Xử lý khi sách được cập nhật
     */
    private void handleBookUpdated(BookUpdatedEvent event) {
        log.info("Handling book updated event for book: {}", event.getBookId());
        
        // Clear cache
        clearBookCache();
        
        // Có thể thêm logic khác như:
        // - Update search index
        // - Send notification to readers who favorited this book
        
        log.info("Book updated event handled successfully");
    }
    
    /**
     * Xử lý khi sách được xóa
     */
    private void handleBookDeleted(BookDeletedEvent event) {
        log.info("Handling book deleted event for book: {}", event.getBookId());
        
        // Clear cache
        clearBookCache();
        
        // Có thể thêm logic khác như:
        // - Remove from search index
        // - Send notification to librarians
        // - Update analytics
        
        log.info("Book deleted event handled successfully");
    }
    
    /**
     * Xóa cache liên quan đến sách
     */
    private void clearBookCache() {
        try {
            // Xóa tất cả cache keys bắt đầu với "books:"
            redisTemplate.delete(redisTemplate.keys("books:*"));
            log.info("Cleared book cache successfully");
        } catch (Exception e) {
            log.error("Error clearing book cache: ", e);
        }
    }
} 