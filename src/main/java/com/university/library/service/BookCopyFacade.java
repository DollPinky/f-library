package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.BookCopySearchParams;
import com.university.library.dto.CreateBookCopyCommand;
import com.university.library.service.command.BookCopyCommandService;
import com.university.library.service.query.BookCopyQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookCopyFacade {
    
    private final BookCopyQueryService bookCopyQueryService;
    private final BookCopyCommandService bookCopyCommandService;
    private final ManualCacheService cacheService;
    
    // Query Operations
    public BookCopyResponse getBookCopyById(UUID bookCopyId) {
        return bookCopyQueryService.getBookCopyById(bookCopyId);
    }
    
    public PagedResponse<BookCopyResponse> searchBookCopies(BookCopySearchParams params) {
        return bookCopyQueryService.searchBookCopies(params);
    }
    
    public List<BookCopyResponse> getBookCopiesByBookId(UUID bookId) {
        return bookCopyQueryService.getBookCopiesByBookId(bookId);
    }
    
    public List<BookCopyResponse> getBookCopiesByLibraryId(UUID libraryId) {
        return bookCopyQueryService.getBookCopiesByLibraryId(libraryId);
    }
    
    public List<BookCopyResponse> getAvailableBookCopiesByBookId(UUID bookId) {
        return bookCopyQueryService.getAvailableBookCopiesByBookId(bookId);
    }
    
    public BookCopyResponse getBookCopyByQrCode(String qrCode) {
        return bookCopyQueryService.getBookCopyByQrCode(qrCode);
    }
    
    public boolean isBookCopyCached(UUID bookCopyId) {
        return bookCopyQueryService.isBookCopyCached(bookCopyId);
    }
    
    public Long getBookCopyCacheTtl(UUID bookCopyId) {
        return bookCopyQueryService.getBookCopyCacheTtl(bookCopyId);
    }
    
    // Command Operations
    public BookCopyResponse createBookCopy(CreateBookCopyCommand command) {
        return bookCopyCommandService.createBookCopy(command);
    }
    
    public BookCopyResponse updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command) {
        return bookCopyCommandService.updateBookCopy(bookCopyId, command);
    }
    
    public void deleteBookCopy(UUID bookCopyId) {
        bookCopyCommandService.deleteBookCopy(bookCopyId);
    }
    
    public BookCopyResponse changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus) {
        return bookCopyCommandService.changeBookCopyStatus(bookCopyId, newStatus);
    }
    
    // Cache Operations
    public void clearBookCopyCache(UUID bookCopyId) {
        bookCopyQueryService.clearBookCopyCache(bookCopyId);
        bookCopyCommandService.clearBookCopyCache(bookCopyId);
    }
    
    public void clearBookCopiesCache(List<UUID> bookCopyIds) {
        bookCopyQueryService.clearBookCopiesCache(bookCopyIds);
        bookCopyCommandService.clearBookCopiesCache(bookCopyIds);
    }
    
    public void clearSearchCache() {
        bookCopyQueryService.clearSearchCache();
        bookCopyCommandService.clearSearchCache();
    }
    
    public void clearSearchCache(BookCopySearchParams params) {
        bookCopyQueryService.clearSearchCache(params);
    }
    
    public void clearAllCache() {
        log.info("Clearing all book copy cache");
        cacheService.evictAll(BookCopyConstants.CACHE_NAME);
    }
    
    // Health Check
    public boolean isHealthy() {
        try {
            // Basic health check - try to access cache service
            cacheService.exists(BookCopyConstants.CACHE_NAME, "health-check");
            return true;
        } catch (Exception e) {
            log.error(BookCopyConstants.ERROR_HEALTH_CHECK_FAILED, e.getMessage());
            return false;
        }
    }
} 