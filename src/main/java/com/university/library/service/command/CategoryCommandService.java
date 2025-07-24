package com.university.library.service.command;

import com.university.library.constants.CategoryConstants;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CreateCategoryCommand;
import com.university.library.entity.Category;
import com.university.library.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    
    /**
     * Tạo danh mục mới
     */
    @Transactional
    public CategoryResponse createCategory(CreateCategoryCommand command) {
        if (categoryRepository.existsByName(command.getName())) {
            log.error(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
        }
        
        Category parentCategory = null;
        if (command.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(command.getParentCategoryId())
                .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_PARENT_CATEGORY_NOT_FOUND + command.getParentCategoryId()));
        }
        
        Category category = Category.builder()
            .name(command.getName())
            .description(command.getDescription())
            .color(command.getColor() != null ? command.getColor() : "#5a735a")
            .parentCategory(parentCategory)
            .build();
        
        Category savedCategory = categoryRepository.save(category);
        CategoryResponse categoryResponse = CategoryResponse.fromEntity(savedCategory);
        
        log.info(CategoryConstants.LOG_CATEGORY_CREATED, savedCategory.getCategoryId());
        return categoryResponse;
    }
    
    /**
     * Cập nhật danh mục
     */
    @Transactional
    public CategoryResponse updateCategory(UUID categoryId, CreateCategoryCommand command) {
        log.info(CategoryConstants.LOG_UPDATING_CATEGORY, categoryId);
        
        Category existingCategory = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_CATEGORY_NOT_FOUND + categoryId));
        
        if (!existingCategory.getName().equals(command.getName()) && 
            categoryRepository.existsByName(command.getName())) {
            log.error(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_ALREADY_EXISTS + command.getName());
        }
        
        Category parentCategory = null;
        if (command.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(command.getParentCategoryId())
                .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_PARENT_CATEGORY_NOT_FOUND + command.getParentCategoryId()));
            
            if (command.getParentCategoryId().equals(categoryId)) {
                throw new RuntimeException(CategoryConstants.VALIDATION_CIRCULAR_REFERENCE);
            }
        }
        
        existingCategory.setName(command.getName());
        existingCategory.setDescription(command.getDescription());
        existingCategory.setColor(command.getColor() != null ? command.getColor() : "#5a735a");
        existingCategory.setParentCategory(parentCategory);
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        CategoryResponse categoryResponse = CategoryResponse.fromEntity(updatedCategory);
        
        log.info(CategoryConstants.LOG_CATEGORY_UPDATED, categoryId);
        return categoryResponse;
    }
    
    /**
     * Xóa danh mục
     */
    @Transactional
    public void deleteCategory(UUID categoryId) {
        log.info(CategoryConstants.LOG_DELETING_CATEGORY, categoryId);
        
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_CATEGORY_NOT_FOUND + categoryId));
        
        if (!category.getSubCategories().isEmpty()) {
            log.error(CategoryConstants.ERROR_CATEGORY_HAS_CHILDREN);
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_HAS_CHILDREN);
        }
        
        if (!category.getBooks().isEmpty()) {
            log.error(CategoryConstants.ERROR_CATEGORY_HAS_BOOKS);
            throw new RuntimeException(CategoryConstants.ERROR_CATEGORY_HAS_BOOKS);
        }
        
        categoryRepository.delete(category);
        
        log.info(CategoryConstants.LOG_CATEGORY_DELETED, categoryId);
    }
} 

