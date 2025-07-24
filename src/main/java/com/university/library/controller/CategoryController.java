package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.constants.CategoryConstants;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CategorySearchParams;
import com.university.library.dto.CreateCategoryCommand;
import com.university.library.service.CategoryFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "APIs for managing categories in the library system")
public class CategoryController {

    private final CategoryFacade categoryFacade;

    // ==================== QUERY ENDPOINTS ====================

    @GetMapping("/{categoryId}")
    @Operation(summary = "Get category by ID", description = "Retrieve detailed information about a specific category")
    public ResponseEntity<StandardResponse<CategoryResponse>> getCategoryById(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID categoryId) {
        
        log.info(CategoryConstants.API_GET_CATEGORY, categoryId);
        
        try {
            CategoryResponse category = categoryFacade.getCategoryById(categoryId);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORY_RETRIEVED, category));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_GET_CATEGORY, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(StandardResponse.error(CategoryConstants.ERROR_CATEGORY_NOT_FOUND + categoryId));
        }
    }

    @GetMapping
    @Operation(summary = "Search categories", description = "Search categories with pagination and filters")
    public ResponseEntity<StandardResponse<PagedResponse<CategoryResponse>>> searchCategories(
            @Parameter(description = "Search parameters")
            @ModelAttribute CategorySearchParams params) {

        log.info(CategoryConstants.API_SEARCH_CATEGORIES, params);
        
        try {
            PagedResponse<CategoryResponse> result = categoryFacade.searchCategories(params);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORIES_RETRIEVED, result));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_SEARCH_CATEGORIES, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_SEARCH_FAILED));
        }
    }

    @GetMapping("/hierarchy")
    @Operation(summary = "Get category hierarchy", description = "Get the complete category hierarchy structure")
    public ResponseEntity<StandardResponse<List<CategoryResponse>>> getCategoryHierarchy() {
        
        log.info(CategoryConstants.API_GET_HIERARCHY);
        
        try {
            List<CategoryResponse> hierarchy = categoryFacade.getCategoryHierarchy();
            return ResponseEntity.ok(StandardResponse.success("Category hierarchy retrieved successfully", hierarchy));
        } catch (Exception e) {
            log.error("Error getting category hierarchy: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Error retrieving category hierarchy"));
        }
    }

    @GetMapping("/{categoryId}/children")
    @Operation(summary = "Get category children", description = "Get all sub-categories of a specific category")
    public ResponseEntity<StandardResponse<List<CategoryResponse>>> getCategoryChildren(
            @Parameter(description = "Parent Category ID", required = true)
            @PathVariable UUID categoryId) {
        
        log.info(CategoryConstants.API_GET_CHILDREN, categoryId);
        
        try {
            List<CategoryResponse> children = categoryFacade.getCategoryChildren(categoryId);
            return ResponseEntity.ok(StandardResponse.success("Category children retrieved successfully", children));
        } catch (Exception e) {
            log.error("Error getting category children: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Error retrieving category children"));
        }
    }

    // ==================== COMMAND ENDPOINTS ====================

    @PostMapping
    @Operation(summary = "Create new category", description = "Create a new category in the library system")
    public ResponseEntity<StandardResponse<CategoryResponse>> createCategory(
            @Parameter(description = "Category creation data", required = true)
            @Valid @RequestBody CreateCategoryCommand command) {
        
        log.info(CategoryConstants.API_CREATE_CATEGORY, command.getName());
        
        try {
            CategoryResponse createdCategory = categoryFacade.createCategory(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORY_CREATED, createdCategory));
        } catch (RuntimeException e) {
            log.error(CategoryConstants.ERROR_LOG_CREATE_CATEGORY, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_UNEXPECTED_CREATE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_INVALID_CATEGORY_DATA));
        }
    }

    @PutMapping("/{categoryId}")
    @Operation(summary = "Update category", description = "Update an existing category's information")
    public ResponseEntity<StandardResponse<CategoryResponse>> updateCategory(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID categoryId,
            @Parameter(description = "Updated category data", required = true)
            @Valid @RequestBody CreateCategoryCommand command) {
        
        log.info(CategoryConstants.API_UPDATE_CATEGORY, categoryId);
        
        try {
            CategoryResponse updatedCategory = categoryFacade.updateCategory(categoryId, command);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORY_UPDATED, updatedCategory));
        } catch (RuntimeException e) {
            log.error(CategoryConstants.ERROR_LOG_UPDATE_CATEGORY, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_UNEXPECTED_UPDATE, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_INVALID_CATEGORY_DATA));
        }
    }

    @DeleteMapping("/{categoryId}")
    @Operation(summary = "Delete category", description = "Delete a category from the library system")
    public ResponseEntity<StandardResponse<String>> deleteCategory(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID categoryId) {
        
        log.info(CategoryConstants.API_DELETE_CATEGORY, categoryId);
        
        try {
            categoryFacade.deleteCategory(categoryId);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORY_DELETED, null));
        } catch (RuntimeException e) {
            log.error(CategoryConstants.ERROR_LOG_DELETE_CATEGORY, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_UNEXPECTED_DELETE, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_DELETE_FAILED));
        }
    }

    // ==================== CACHE MANAGEMENT ENDPOINTS ====================

    @DeleteMapping("/{categoryId}/cache")
    @Operation(summary = "Clear category cache", description = "Clear cache for a specific category")
    public ResponseEntity<StandardResponse<String>> clearCategoryCache(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID categoryId) {
        
        log.info(CategoryConstants.API_CLEAR_CATEGORY_CACHE, categoryId);
        
        try {
            categoryFacade.clearCategoryCache(categoryId);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_CLEAR_CACHE, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    @DeleteMapping("/cache/search")
    @Operation(summary = "Clear search cache", description = "Clear all search cache")
    public ResponseEntity<StandardResponse<String>> clearSearchCache() {
        
        log.info(CategoryConstants.API_CLEAR_SEARCH_CACHE);
        
        try {
            categoryFacade.clearSearchCache();
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_CLEAR_SEARCH_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    @DeleteMapping("/cache")
    @Operation(summary = "Clear all cache", description = "Clear all category-related cache")
    public ResponseEntity<StandardResponse<String>> clearAllCache() {
        
        log.info(CategoryConstants.API_CLEAR_ALL_CACHE);
        
        try {
            categoryFacade.clearAllCache();
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_CLEAR_ALL_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    @PostMapping("/cache/bulk-clear")
    @Operation(summary = "Clear multiple categories cache", description = "Clear cache for multiple categories")
    public ResponseEntity<StandardResponse<String>> clearCategoriesCache(
            @Parameter(description = "List of category IDs", required = true)
            @RequestBody List<UUID> categoryIds) {
        
        log.info(CategoryConstants.API_BULK_CLEAR_CACHE, categoryIds.size());
        
        try {
            categoryFacade.clearCategoriesCache(categoryIds);
            return ResponseEntity.ok(StandardResponse.success(String.format(CategoryConstants.SUCCESS_CACHE_BULK_CLEARED, categoryIds.size()), null));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_BULK_CLEAR_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }

    // ==================== CACHE INFORMATION ENDPOINTS ====================

    @GetMapping("/{categoryId}/cache/status")
    @Operation(summary = "Get category cache status", description = "Check if a category is cached and get TTL")
    public ResponseEntity<StandardResponse<CategoryCacheStatus>> getCategoryCacheStatus(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID categoryId) {
        
        log.info(CategoryConstants.API_CACHE_STATUS, categoryId);
        
        try {
            boolean isCached = categoryFacade.isCategoryCached(categoryId);
            Long ttl = categoryFacade.getCategoryCacheTtl(categoryId);
            
            CategoryCacheStatus status = new CategoryCacheStatus(categoryId, isCached, ttl);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CACHE_STATUS_RETRIEVED, status));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_CACHE_STATUS, categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_CACHE_STATUS_FAILED));
        }
    }

    @GetMapping("/cache/statistics")
    @Operation(summary = "Get cache statistics", description = "Get cache performance statistics")
    public ResponseEntity<StandardResponse<CategoryFacade.CacheStatistics>> getCacheStatistics() {
        
        log.info(CategoryConstants.API_CACHE_STATS);
        
        try {
            CategoryFacade.CacheStatistics stats = categoryFacade.getCacheStatistics();
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CACHE_STATS_RETRIEVED, stats));
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_CACHE_STATS, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error(CategoryConstants.ERROR_CACHE_STATS_FAILED));
        }
    }

    // ==================== HEALTH CHECK ENDPOINT ====================

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check the health status of the category service")
    public ResponseEntity<StandardResponse<HealthStatus>> healthCheck() {
        
        log.info(CategoryConstants.API_HEALTH_CHECK);
        
        try {
            boolean isHealthy = categoryFacade.isHealthy();
            HealthStatus status = new HealthStatus(CategoryConstants.SERVICE_NAME, isHealthy, System.currentTimeMillis());
            
            if (isHealthy) {
                return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_SERVICE_HEALTHY, status));
            } else {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(StandardResponse.error(CategoryConstants.ERROR_SERVICE_UNHEALTHY));
            }
        } catch (Exception e) {
            log.error(CategoryConstants.ERROR_LOG_HEALTH_CHECK, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(StandardResponse.error(CategoryConstants.ERROR_HEALTH_CHECK_FAILED));
        }
    }

    // ==================== INNER CLASSES ====================

    public static class CategoryCacheStatus {
        private final UUID categoryId;
        private final boolean isCached;
        private final Long ttlSeconds;

        public CategoryCacheStatus(UUID categoryId, boolean isCached, Long ttlSeconds) {
            this.categoryId = categoryId;
            this.isCached = isCached;
            this.ttlSeconds = ttlSeconds;
        }

        public UUID getCategoryId() { return categoryId; }
        public boolean isCached() { return isCached; }
        public Long getTtlSeconds() { return ttlSeconds; }
    }

    public static class HealthStatus {
        private final String serviceName;
        private final boolean healthy;
        private final long timestamp;

        public HealthStatus(String serviceName, boolean healthy, long timestamp) {
            this.serviceName = serviceName;
            this.healthy = healthy;
            this.timestamp = timestamp;
        }

        public String getServiceName() { return serviceName; }
        public boolean isHealthy() { return healthy; }
        public long getTimestamp() { return timestamp; }
    }
} 

