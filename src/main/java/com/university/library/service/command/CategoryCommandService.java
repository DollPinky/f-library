package com.university.library.service.command;

import com.university.library.constants.CategoryConstants;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CreateCategoryCommand;
import com.university.library.entity.Category;
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
public class CategoryCommandService {

    private final CategoryRepository categoryRepository;
    private final ManualCacheService cacheService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Tạo danh mục mới với Kafka event và cache management
     */
    @Transactional
    public CategoryResponse createCategory(CreateCategoryCommand command) {
        log.info(CategoryConstants.LOG_CREATING_CATEGORY, command.getName());
        
        // Validate name uniqueness
        if (categoryRepository.existsByName(command.getName())) {
            log.error(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
        }
        
        // Validate parent category exists if specified
        Category parentCategory = null;
        if (command.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(command.getParentCategoryId())
                .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_PARENT_CATEGORY_NOT_FOUND + command.getParentCategoryId()));
        }
        
        // Create category entity
        Category category = Category.builder()
            .name(command.getName())
            .description(command.getDescription())
            .parentCategory(parentCategory)
            .build();
        
        Category savedCategory = categoryRepository.save(category);
        CategoryResponse categoryResponse = CategoryResponse.fromEntity(savedCategory);
        
        // Publish Kafka event
        publishCategoryCreatedEvent(savedCategory);
        
        // Cache the new category
        cacheCategory(categoryResponse);
        
        // Clear search cache to ensure fresh results
        clearSearchCache();
        
        log.info(CategoryConstants.LOG_CATEGORY_CREATED, savedCategory.getCategoryId());
        return categoryResponse;
    }
    
    /**
     * Cập nhật danh mục với Kafka event và cache management
     */
    @Transactional
    public CategoryResponse updateCategory(UUID categoryId, CreateCategoryCommand command) {
        log.info(CategoryConstants.LOG_UPDATING_CATEGORY, categoryId);
        
        Category existingCategory = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_CATEGORY_NOT_FOUND + categoryId));
        
        // Check name uniqueness if changed
        if (!existingCategory.getName().equals(command.getName()) && 
            categoryRepository.existsByName(command.getName())) {
            log.error(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
        }
        
        // Validate parent category exists if specified
        Category parentCategory = null;
        if (command.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(command.getParentCategoryId())
                .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_PARENT_CATEGORY_NOT_FOUND + command.getParentCategoryId()));
            
            // Check for circular reference
            if (command.getParentCategoryId().equals(categoryId)) {
                throw new RuntimeException(CategoryConstants.VALIDATION_CIRCULAR_REFERENCE);
            }
        }
        
        // Update category fields
        existingCategory.setName(command.getName());
        existingCategory.setDescription(command.getDescription());
        existingCategory.setParentCategory(parentCategory);
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        CategoryResponse categoryResponse = CategoryResponse.fromEntity(updatedCategory);
        
        // Publish Kafka event
        publishCategoryUpdatedEvent(updatedCategory);
        
        // Update cache
        cacheCategory(categoryResponse);
        
        // Clear search cache to ensure fresh results
        clearSearchCache();
        
        log.info(CategoryConstants.LOG_CATEGORY_UPDATED, categoryId);
        return categoryResponse;
    }
    
    /**
     * Xóa danh mục với Kafka event và cache management
     */
    @Transactional
    public void deleteCategory(UUID categoryId) {
        log.info(CategoryConstants.LOG_DELETING_CATEGORY, categoryId);
        
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_CATEGORY_NOT_FOUND + categoryId));
        
        // Check if category has children
        if (!category.getSubCategories().isEmpty()) {
            log.error(CategoryConstants.ERROR_CATEGORY_HAS_CHILDREN);
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_HAS_CHILDREN);
        }
        
        // Check if category has books
        if (!category.getBooks().isEmpty()) {
            log.error(CategoryConstants.ERROR_CATEGORY_HAS_BOOKS);
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_HAS_BOOKS);
        }
        
        categoryRepository.delete(category);
        
        // Publish Kafka event
        publishCategoryDeletedEvent(category);
        
        // Clear cache
        clearCategoryCache(categoryId);
        
        // Clear search cache
        clearSearchCache();
        
        log.info(CategoryConstants.LOG_CATEGORY_DELETED, categoryId);
    }

    // ==================== CACHE MANAGEMENT ====================

    /**
     * Xóa cache cho một category cụ thể
     */
    public void clearCategoryCache(UUID categoryId) {
        String categoryKey = CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + categoryId;
        String childrenKey = CategoryConstants.CACHE_KEY_PREFIX_CHILDREN + categoryId;
        
        cacheService.evict(CategoryConstants.CACHE_NAME, categoryKey);
        cacheService.evict(CategoryConstants.CACHE_NAME, childrenKey);
        
        // Clear hierarchy cache as well
        cacheService.evict(CategoryConstants.CACHE_NAME, CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + "hierarchy");
    }

    /**
     * Xóa cache cho nhiều categories
     */
    public void clearCategoriesCache(List<UUID> categoryIds) {
        categoryIds.forEach(this::clearCategoryCache);
    }

    /**
     * Xóa toàn bộ search cache
     */
    public void clearSearchCache() {
        cacheService.evictAll(CategoryConstants.CACHE_NAME);
    }

    // ==================== KAFKA EVENTS ====================

    /**
     * Publish category created event
     */
    private void publishCategoryCreatedEvent(Category category) {
        try {
            // TODO: Implement CategoryCreatedEvent
            log.info(CategoryConstants.LOG_KAFKA_EVENT_SENT, CategoryConstants.EVENT_CATEGORY_CREATED, category.getCategoryId());
        } catch (Exception e) {
            log.error("Error publishing category created event: {}", e.getMessage());
        }
    }

    /**
     * Publish category updated event
     */
    private void publishCategoryUpdatedEvent(Category category) {
        try {
            // TODO: Implement CategoryUpdatedEvent
            log.info(CategoryConstants.LOG_KAFKA_EVENT_SENT, CategoryConstants.EVENT_CATEGORY_UPDATED, category.getCategoryId());
        } catch (Exception e) {
            log.error("Error publishing category updated event: {}", e.getMessage());
        }
    }

    /**
     * Publish category deleted event
     */
    private void publishCategoryDeletedEvent(Category category) {
        try {
            // TODO: Implement CategoryDeletedEvent
            log.info(CategoryConstants.LOG_KAFKA_EVENT_SENT, CategoryConstants.EVENT_CATEGORY_DELETED, category.getCategoryId());
        } catch (Exception e) {
            log.error("Error publishing category deleted event: {}", e.getMessage());
        }
    }

    /**
     * Publish cache evict event
     */
    public void publishCacheEvictEvent(UUID categoryId) {
        try {
            // TODO: Implement CacheEvictEvent
            log.info(CategoryConstants.LOG_KAFKA_EVENT_SENT, CategoryConstants.EVENT_CACHE_EVICT, categoryId);
        } catch (Exception e) {
            log.error("Error publishing cache evict event: {}", e.getMessage());
        }
    }

    // ==================== PRIVATE METHODS ====================

    /**
     * Cache một category
     */
    private void cacheCategory(CategoryResponse categoryResponse) {
        String cacheKey = CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + categoryResponse.getCategoryId();
        Duration localTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_LOCAL);
        Duration distributedTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_CATEGORY_DETAIL);
        cacheService.put(CategoryConstants.CACHE_NAME, cacheKey, categoryResponse, localTtl, distributedTtl);
        log.info(CategoryConstants.LOG_CACHING_CATEGORY, categoryResponse.getCategoryId());
    }
} 