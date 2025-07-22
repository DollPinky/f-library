package com.university.library.event;

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
     * Xử lý Book Events
     */
    @KafkaListener(topics = "book-events", groupId = "library-group")
    public void handleBookEvent(Object event) {
        log.info("Received book event: {}", event);
        
        try {
            if (event instanceof BookCreatedEvent) {
                handleBookCreated((BookCreatedEvent) event);
            } else if (event instanceof BookUpdatedEvent) {
                handleBookUpdated((BookUpdatedEvent) event);
            } else if (event instanceof BookDeletedEvent) {
                handleBookDeleted((BookDeletedEvent) event);
            } else if (event instanceof BookBorrowedEvent) {
                handleBookBorrowed((BookBorrowedEvent) event);
            } else if (event instanceof BookReturnedEvent) {
                handleBookReturned((BookReturnedEvent) event);
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
        log.info("Handling book created event for book: {} by user: {}", 
            event.getBookId(), event.getCreatedByUsername());
        
        // Clear cache
        clearBookCache();
        
        // Có thể thêm logic khác như:
        // - Gửi notification cho librarians
        // - Update search index
        // - Send email to campus administrators
        // - Update analytics dashboard
        // - Log audit trail
        
        log.info("Book created event handled successfully - Title: {}, Author: {}, ISBN: {}", 
            event.getTitle(), event.getAuthor(), event.getIsbn());
    }
    
    /**
     * Xử lý khi sách được cập nhật
     */
    private void handleBookUpdated(BookUpdatedEvent event) {
        log.info("Handling book updated event for book: {} by user: {}", 
            event.getBookId(), event.getUpdatedByUsername());
        
        // Clear cache
        clearBookCache();
        
        // Có thể thêm logic khác như:
        // - Update search index
        // - Send notification to readers who favorited this book
        // - Log change history
        // - Update analytics
        
        log.info("Book updated event handled successfully - Title: {} -> {}, Change Reason: {}", 
            event.getPreviousTitle(), event.getTitle(), event.getChangeReason());
    }
    
    /**
     * Xử lý khi sách được xóa
     */
    private void handleBookDeleted(BookDeletedEvent event) {
        log.info("Handling book deleted event for book: {} by user: {}", 
            event.getBookId(), event.getDeletedByUsername());
        
        // Clear cache
        clearBookCache();
        
        // Có thể thêm logic khác như:
        // - Remove from search index
        // - Send notification to librarians
        // - Update analytics
        // - Archive book data
        
        log.info("Book deleted event handled successfully - Title: {}, Reason: {}, Has Active Borrowings: {}", 
            event.getTitle(), event.getDeletionReason(), event.getHasActiveBorrowings());
    }
    
    /**
     * Xử lý khi sách được mượn
     */
    private void handleBookBorrowed(BookBorrowedEvent event) {
        log.info("Handling book borrowed event for book: {} by reader: {}", 
            event.getBookTitle(), event.getReaderFullName());
        
        // Có thể thêm logic khác như:
        // - Update reader's borrow count
        // - Send confirmation email to reader
        // - Update book availability
        // - Send notification to librarians
        // - Update analytics
        
        log.info("Book borrowed event handled successfully - Reader: {}, Due Date: {}, Is Overdue: {}", 
            event.getReaderFullName(), event.getDueDate(), event.getIsOverdue());
    }
    
    /**
     * Xử lý khi sách được trả
     */
    private void handleBookReturned(BookReturnedEvent event) {
        log.info("Handling book returned event for book: {} by reader: {}", 
            event.getBookTitle(), event.getReaderFullName());
        
        // Có thể thêm logic khác như:
        // - Update reader's borrow count
        // - Calculate and apply fines if overdue
        // - Update book availability
        // - Send confirmation email
        // - Update analytics
        
        log.info("Book returned event handled successfully - Reader: {}, Was Overdue: {}, Fine Amount: {}", 
            event.getReaderFullName(), event.getWasOverdue(), event.getFineAmount());
    }
    
    /**
     * Xóa cache liên quan đến sách
     */
    private void clearBookCache() {
        try {
            redisTemplate.delete(redisTemplate.keys("books:*"));
            log.info("Cleared book cache successfully");
        } catch (Exception e) {
            log.error("Error clearing book cache: ", e);
        }
    }
} 