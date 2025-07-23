package com.university.library.service.command;

import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.CreateBookCopyCommand;
import com.university.library.entity.BookCopy;
import com.university.library.repository.BookCopyRepository;
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
public class BookCopyCommandService {
    
    private final BookCopyRepository bookCopyRepository;
    private final ManualCacheService cacheService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Transactional
    public BookCopyResponse createBookCopy(CreateBookCopyCommand command) {
        log.info("Creating new book copy with QR code: {}", command.getQrCode());
        
        // Validate QR code uniqueness
        if (bookCopyRepository.existsByQrCode(command.getQrCode())) {
            throw new RuntimeException(BookCopyConstants.ERROR_QR_CODE_ALREADY_EXISTS + command.getQrCode());
        }
        
        BookCopy bookCopy = BookCopy.builder()
                .qrCode(command.getQrCode())
                .shelfLocation(command.getShelfLocation())
                .status(convertBookStatus(command.getStatus()))
                .build();
        
        // Set book and library relationships (assuming they exist)
        // This would typically involve fetching the book and library entities
        // For now, we'll assume they're set via the entity relationships
        
        BookCopy savedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(savedBookCopy);
        
        // Cache the new book copy
        cacheBookCopy(response);
        
        // Publish event
        publishBookCopyCreatedEvent(savedBookCopy);
        
        log.info(BookCopyConstants.LOG_BOOK_COPY_CREATED, savedBookCopy.getBookCopyId());
        return response;
    }
    
    @Transactional
    public BookCopyResponse updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command) {
        log.info("Updating book copy with ID: {}", bookCopyId);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        
        // Check QR code uniqueness if it's being changed
        if (!bookCopy.getQrCode().equals(command.getQrCode()) && 
            bookCopyRepository.existsByQrCode(command.getQrCode())) {
            throw new RuntimeException(BookCopyConstants.ERROR_QR_CODE_ALREADY_EXISTS + command.getQrCode());
        }
        
        // Update fields
        bookCopy.setQrCode(command.getQrCode());
        bookCopy.setShelfLocation(command.getShelfLocation());
        bookCopy.setStatus(convertBookStatus(command.getStatus()));
        
        BookCopy updatedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(updatedBookCopy);
        
        // Update cache
        cacheBookCopy(response);
        
        // Publish event
        publishBookCopyUpdatedEvent(updatedBookCopy);
        
        log.info(BookCopyConstants.LOG_BOOK_COPY_UPDATED, bookCopyId);
        return response;
    }
    
    @Transactional
    public void deleteBookCopy(UUID bookCopyId) {
        log.info("Deleting book copy with ID: {}", bookCopyId);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        
        // Check if book copy can be deleted (not currently borrowed)
        if (bookCopy.getStatus() == BookCopy.BookStatus.BORROWED) {
            throw new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_IN_USE);
        }
        
        bookCopyRepository.delete(bookCopy);
        
        // Clear cache
        clearBookCopyCache(bookCopyId);
        
        // Publish event
        publishBookCopyDeletedEvent(bookCopy);
        
        log.info(BookCopyConstants.LOG_BOOK_COPY_DELETED, bookCopyId);
    }
    
    @Transactional
    public BookCopyResponse changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus) {
        log.info("Changing book copy status: {} -> {}", bookCopyId, newStatus);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        
        BookCopy.BookStatus oldStatus = bookCopy.getStatus();
        bookCopy.setStatus(convertBookStatus(newStatus));
        
        BookCopy updatedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(updatedBookCopy);
        
        // Update cache
        cacheBookCopy(response);
        
        // Publish status change event
        publishBookCopyStatusChangedEvent(updatedBookCopy, oldStatus);
        
        log.info(BookCopyConstants.LOG_STATUS_CHANGED, oldStatus, newStatus);
        return response;
    }
    
    public void clearBookCopyCache(UUID bookCopyId) {
        log.info("Clearing cache for book copy: {}", bookCopyId);
        String cacheKey = BookCopyConstants.CACHE_KEY_PREFIX_BOOK_COPY + bookCopyId;
        cacheService.evict(BookCopyConstants.CACHE_NAME, cacheKey);
    }
    
    public void clearBookCopiesCache(List<UUID> bookCopyIds) {
        log.info("Clearing cache for {} book copies", bookCopyIds.size());
        bookCopyIds.forEach(this::clearBookCopyCache);
    }
    
    public void clearSearchCache() {
        log.info("Clearing all book copy search cache");
        cacheService.evictAll(BookCopyConstants.CACHE_NAME);
    }
    
    private void publishBookCopyCreatedEvent(BookCopy bookCopy) {
        try {
            kafkaTemplate.send(BookCopyConstants.TOPIC_BOOK_COPY_CREATED, bookCopy.getBookCopyId().toString(), bookCopy);
            log.info(BookCopyConstants.LOG_KAFKA_EVENT_SENT, BookCopyConstants.EVENT_BOOK_COPY_CREATED, bookCopy.getBookCopyId());
        } catch (Exception e) {
            log.error("Failed to publish book copy created event: {}", e.getMessage());
        }
    }
    
    private void publishBookCopyUpdatedEvent(BookCopy bookCopy) {
        try {
            kafkaTemplate.send(BookCopyConstants.TOPIC_BOOK_COPY_UPDATED, bookCopy.getBookCopyId().toString(), bookCopy);
            log.info(BookCopyConstants.LOG_KAFKA_EVENT_SENT, BookCopyConstants.EVENT_BOOK_COPY_UPDATED, bookCopy.getBookCopyId());
        } catch (Exception e) {
            log.error("Failed to publish book copy updated event: {}", e.getMessage());
        }
    }
    
    private void publishBookCopyDeletedEvent(BookCopy bookCopy) {
        try {
            kafkaTemplate.send(BookCopyConstants.TOPIC_BOOK_COPY_DELETED, bookCopy.getBookCopyId().toString(), bookCopy);
            log.info(BookCopyConstants.LOG_KAFKA_EVENT_SENT, BookCopyConstants.EVENT_BOOK_COPY_DELETED, bookCopy.getBookCopyId());
        } catch (Exception e) {
            log.error("Failed to publish book copy deleted event: {}", e.getMessage());
        }
    }
    
    private void publishBookCopyStatusChangedEvent(BookCopy bookCopy, BookCopy.BookStatus oldStatus) {
        try {
            var statusChangeEvent = new StatusChangeEvent(bookCopy.getBookCopyId(), oldStatus, bookCopy.getStatus());
            kafkaTemplate.send(BookCopyConstants.TOPIC_BOOK_COPY_STATUS_CHANGED, bookCopy.getBookCopyId().toString(), statusChangeEvent);
            log.info(BookCopyConstants.LOG_KAFKA_EVENT_SENT, BookCopyConstants.EVENT_BOOK_COPY_STATUS_CHANGED, bookCopy.getBookCopyId());
        } catch (Exception e) {
            log.error("Failed to publish book copy status changed event: {}", e.getMessage());
        }
    }
    
    public void publishCacheEvictEvent(UUID bookCopyId) {
        try {
            kafkaTemplate.send(BookCopyConstants.TOPIC_BOOK_COPY_CACHE_EVICT, bookCopyId.toString(), bookCopyId);
            log.info(BookCopyConstants.LOG_KAFKA_EVENT_SENT, BookCopyConstants.EVENT_CACHE_EVICT, bookCopyId);
        } catch (Exception e) {
            log.error("Failed to publish cache evict event: {}", e.getMessage());
        }
    }
    
    private void cacheBookCopy(BookCopyResponse bookCopyResponse) {
        String cacheKey = BookCopyConstants.CACHE_KEY_PREFIX_BOOK_COPY + bookCopyResponse.getBookCopyId();
        cacheService.put(BookCopyConstants.CACHE_NAME, cacheKey, bookCopyResponse, 
                Duration.ofMinutes(BookCopyConstants.CACHE_TTL_BOOK_COPY_DETAIL), 
                Duration.ofMinutes(BookCopyConstants.CACHE_TTL_LOCAL));
    }
    
    private BookCopy.BookStatus convertBookStatus(CreateBookCopyCommand.BookStatus status) {
        if (status == null) {
            return BookCopy.BookStatus.AVAILABLE;
        }
        
        switch (status) {
            case AVAILABLE:
                return BookCopy.BookStatus.AVAILABLE;
            case BORROWED:
                return BookCopy.BookStatus.BORROWED;
            case RESERVED:
                return BookCopy.BookStatus.RESERVED;
            case LOST:
                return BookCopy.BookStatus.LOST;
            case DAMAGED:
                return BookCopy.BookStatus.DAMAGED;
            default:
                return BookCopy.BookStatus.AVAILABLE;
        }
    }
    
    // Inner class for status change events
    public static class StatusChangeEvent {
        private final UUID bookCopyId;
        private final BookCopy.BookStatus oldStatus;
        private final BookCopy.BookStatus newStatus;
        
        public StatusChangeEvent(UUID bookCopyId, BookCopy.BookStatus oldStatus, BookCopy.BookStatus newStatus) {
            this.bookCopyId = bookCopyId;
            this.oldStatus = oldStatus;
            this.newStatus = newStatus;
        }
        
        public UUID getBookCopyId() { return bookCopyId; }
        public BookCopy.BookStatus getOldStatus() { return oldStatus; }
        public BookCopy.BookStatus getNewStatus() { return newStatus; }
    }
} 