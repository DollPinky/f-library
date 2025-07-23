package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.service.command.BookCommandService;
import com.university.library.service.query.BookQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * BookFacade - Facade pattern để kết hợp Book Query và Command operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookFacade {

    private final BookQueryService bookQueryService;
    private final BookCommandService bookCommandService;
    private final ManualCacheService cacheService;

    // ==================== QUERY OPERATIONS ====================

    /**
     * Lấy thông tin sách theo ID với cache
     */
    public BookResponse getBookById(UUID bookId) {
        log.info("BookFacade: Getting book by ID: {}", bookId);
        return bookQueryService.getBookById(bookId);
    }

    /**
     * Tìm kiếm sách với cache
     */
    public PagedResponse<BookResponse> searchBooks(BookSearchParams params) {
        log.info("BookFacade: Searching books with params: {}", params);
        return bookQueryService.searchBooks(params);
    }

    /**
     * Kiểm tra xem book có trong cache không
     */
    public boolean isBookCached(UUID bookId) {
        return bookQueryService.isBookCached(bookId);
    }

    /**
     * Lấy TTL của book trong cache
     */
    public Long getBookCacheTtl(UUID bookId) {
        return bookQueryService.getBookCacheTtl(bookId);
    }

    // ==================== COMMAND OPERATIONS ====================

    /**
     * Tạo sách mới với Kafka events và cache management
     */
    public BookResponse createBook(CreateBookCommand command) {
        log.info("BookFacade: Creating new book with title: {}", command.getTitle());
        return bookCommandService.createBook(command);
    }

    /**
     * Cập nhật sách với Kafka events và cache management
     */
    public BookResponse updateBook(UUID bookId, CreateBookCommand command) {
        log.info("BookFacade: Updating book with ID: {}", bookId);
        return bookCommandService.updateBook(bookId, command);
    }

    /**
     * Xóa sách với Kafka events và cache management
     */
    public void deleteBook(UUID bookId) {
        log.info("BookFacade: Deleting book with ID: {}", bookId);
        bookCommandService.deleteBook(bookId);
    }

    // ==================== CACHE MANAGEMENT ====================

    /**
     * Xóa cache cho một book cụ thể
     */
    public void clearBookCache(UUID bookId) {
        log.info("BookFacade: Clearing cache for book: {}", bookId);
        bookQueryService.clearBookCache(bookId);
        bookCommandService.publishCacheEvictEvent(bookId);
    }

    /**
     * Xóa cache cho nhiều books
     */
    public void clearBooksCache(List<UUID> bookIds) {
        log.info("BookFacade: Clearing cache for {} books", bookIds.size());
        bookQueryService.clearBooksCache(bookIds);
        bookCommandService.clearBooksCache(bookIds);
    }

    /**
     * Xóa toàn bộ search cache
     */
    public void clearSearchCache() {
        log.info("BookFacade: Clearing all search cache");
        bookQueryService.clearSearchCache();
    }

    /**
     * Xóa cache cho một tìm kiếm cụ thể
     */
    public void clearSearchCache(BookSearchParams params) {
        log.info("BookFacade: Clearing search cache for specific params");
        bookQueryService.clearSearchCache(params);
    }

    /**
     * Xóa toàn bộ cache
     */
    public void clearAllCache() {
        log.info("BookFacade: Clearing all book cache");
        cacheService.evictAll(BookConstants.CACHE_NAME);
    }

    // ==================== CACHE STATISTICS ====================

    /**
     * Lấy thống kê cache
     */
    public CacheStatistics getCacheStatistics() {
        // Trong thực tế, bạn sẽ implement logic để lấy thống kê cache
        return CacheStatistics.builder()
            .cacheName(BookConstants.CACHE_NAME)
            .totalKeys(0) // TODO: Implement
            .hitRate(0.0) // TODO: Implement
            .build();
    }

    /**
     * Inner class cho cache statistics
     */
    public static class CacheStatistics {
        private String cacheName;
        private long totalKeys;
        private double hitRate;

        public CacheStatistics(String cacheName, long totalKeys, double hitRate) {
            this.cacheName = cacheName;
            this.totalKeys = totalKeys;
            this.hitRate = hitRate;
        }

        public static CacheStatisticsBuilder builder() {
            return new CacheStatisticsBuilder();
        }

        public String getCacheName() { return cacheName; }
        public long getTotalKeys() { return totalKeys; }
        public double getHitRate() { return hitRate; }

        public static class CacheStatisticsBuilder {
            private String cacheName;
            private long totalKeys;
            private double hitRate;

            public CacheStatisticsBuilder cacheName(String cacheName) {
                this.cacheName = cacheName;
                return this;
            }

            public CacheStatisticsBuilder totalKeys(long totalKeys) {
                this.totalKeys = totalKeys;
                return this;
            }

            public CacheStatisticsBuilder hitRate(double hitRate) {
                this.hitRate = hitRate;
                return this;
            }

            public CacheStatistics build() {
                return new CacheStatistics(cacheName, totalKeys, hitRate);
            }
        }
    }

    // ==================== HEALTH CHECK ====================

    /**
     * Health check cho Book service
     */
    public boolean isHealthy() {
        try {
            // Kiểm tra các dependencies
            // Trong thực tế, bạn sẽ kiểm tra database, cache, kafka connections
            return true;
        } catch (Exception e) {
            log.error("BookFacade health check failed: {}", e.getMessage());
            return false;
        }
    }
} 