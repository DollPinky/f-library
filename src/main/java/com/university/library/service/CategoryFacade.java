package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.constants.CategoryConstants;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CategorySearchParams;
import com.university.library.dto.CreateCategoryCommand;
import com.university.library.service.command.CategoryCommandService;
import com.university.library.service.query.CategoryQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * CategoryFacade - Facade pattern để kết hợp Category Query và Command operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryFacade {

    private final CategoryQueryService categoryQueryService;
    private final CategoryCommandService categoryCommandService;
    private final ManualCacheService cacheService;

    // ==================== QUERY OPERATIONS ====================

    /**
     * Lấy thông tin danh mục theo ID với cache
     */
    public CategoryResponse getCategoryById(UUID categoryId) {
        log.info("CategoryFacade: Getting category by ID: {}", categoryId);
        return categoryQueryService.getCategoryById(categoryId);
    }

    /**
     * Tìm kiếm danh mục với cache
     */
    public PagedResponse<CategoryResponse> searchCategories(CategorySearchParams params) {
        log.info("CategoryFacade: Searching categories with params: {}", params);
        return categoryQueryService.searchCategories(params);
    }

    /**
     * Lấy cấu trúc phân cấp danh mục
     */
    public List<CategoryResponse> getCategoryHierarchy() {
        log.info("CategoryFacade: Getting category hierarchy");
        return categoryQueryService.getCategoryHierarchy();
    }

    /**
     * Lấy danh mục con của một danh mục
     */
    public List<CategoryResponse> getCategoryChildren(UUID parentCategoryId) {
        log.info("CategoryFacade: Getting children for category: {}", parentCategoryId);
        return categoryQueryService.getCategoryChildren(parentCategoryId);
    }

    /**
     * Kiểm tra xem category có trong cache không
     */
    public boolean isCategoryCached(UUID categoryId) {
        return categoryQueryService.isCategoryCached(categoryId);
    }

    /**
     * Lấy TTL của category trong cache
     */
    public Long getCategoryCacheTtl(UUID categoryId) {
        return categoryQueryService.getCategoryCacheTtl(categoryId);
    }

    // ==================== COMMAND OPERATIONS ====================

    /**
     * Tạo danh mục mới với Kafka events và cache management
     */
    public CategoryResponse createCategory(CreateCategoryCommand command) {
        log.info("CategoryFacade: Creating new category with name: {}", command.getName());
        return categoryCommandService.createCategory(command);
    }

    /**
     * Cập nhật danh mục với Kafka events và cache management
     */
    public CategoryResponse updateCategory(UUID categoryId, CreateCategoryCommand command) {
        log.info("CategoryFacade: Updating category with ID: {}", categoryId);
        return categoryCommandService.updateCategory(categoryId, command);
    }

    /**
     * Xóa danh mục với Kafka events và cache management
     */
    public void deleteCategory(UUID categoryId) {
        log.info("CategoryFacade: Deleting category with ID: {}", categoryId);
        categoryCommandService.deleteCategory(categoryId);
    }

    // ==================== CACHE MANAGEMENT ====================

    /**
     * Xóa cache cho một category cụ thể
     */
    public void clearCategoryCache(UUID categoryId) {
        log.info("CategoryFacade: Clearing cache for category: {}", categoryId);
        categoryQueryService.clearCategoryCache(categoryId);
        categoryCommandService.publishCacheEvictEvent(categoryId);
    }

    /**
     * Xóa cache cho nhiều categories
     */
    public void clearCategoriesCache(List<UUID> categoryIds) {
        log.info("CategoryFacade: Clearing cache for {} categories", categoryIds.size());
        categoryQueryService.clearCategoriesCache(categoryIds);
        categoryCommandService.clearCategoriesCache(categoryIds);
    }

    /**
     * Xóa toàn bộ search cache
     */
    public void clearSearchCache() {
        log.info("CategoryFacade: Clearing all search cache");
        categoryQueryService.clearSearchCache();
    }

    /**
     * Xóa cache cho một tìm kiếm cụ thể
     */
    public void clearSearchCache(CategorySearchParams params) {
        log.info("CategoryFacade: Clearing search cache for specific params");
        categoryQueryService.clearSearchCache(params);
    }

    /**
     * Xóa toàn bộ cache
     */
    public void clearAllCache() {
        log.info("CategoryFacade: Clearing all category cache");
        cacheService.evictAll(CategoryConstants.CACHE_NAME);
    }

    // ==================== CACHE STATISTICS ====================

    /**
     * Lấy thống kê cache
     */
    public CacheStatistics getCacheStatistics() {
        // Trong thực tế, bạn sẽ implement logic để lấy thống kê cache
        return CacheStatistics.builder()
            .cacheName(CategoryConstants.CACHE_NAME)
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
     * Health check cho Category service
     */
    public boolean isHealthy() {
        try {
            // Kiểm tra các dependencies
            // Trong thực tế, bạn sẽ kiểm tra database, cache, kafka connections
            return true;
        } catch (Exception e) {
            log.error("CategoryFacade health check failed: {}", e.getMessage());
            return false;
        }
    }
} 