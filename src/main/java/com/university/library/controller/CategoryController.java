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
            return ResponseEntity.ok(StandardResponse.success("Lấy danh mục thành công", category));
        } catch (Exception e) {
            log.error("Error getting category by ID: {} - {}", categoryId, e.getMessage());
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
            return ResponseEntity.ok(StandardResponse.success("Lấy danh sách danh mục thành công", result));
        } catch (Exception e) {
            log.error("Error searching categories: {}", e.getMessage());
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
            CategoryResponse created = categoryFacade.createCategory(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORY_CREATED, created));
        } catch (Exception e) {
            log.error("Error creating category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
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
            CategoryResponse updated = categoryFacade.updateCategory(categoryId, command);
            return ResponseEntity.ok(StandardResponse.success(CategoryConstants.SUCCESS_CATEGORY_UPDATED, updated));
        } catch (Exception e) {
            log.error("Error updating category: {} - {}", categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
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
        } catch (Exception e) {
            log.error("Error deleting category: {} - {}", categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(StandardResponse.error(e.getMessage()));
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

