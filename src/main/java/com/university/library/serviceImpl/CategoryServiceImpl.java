package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.CategoryConstants;
import com.university.library.dto.request.category.CategorySearchParams;
import com.university.library.dto.request.category.CreateCategoryCommand;
import com.university.library.dto.response.category.CategoryResponse;
import com.university.library.entity.Category;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.CategoryService;
import com.university.library.specification.CategorySpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    /**
     * category query
     */
    /**
     * Lấy danh mục theo ID
     */
    public CategoryResponse getCategoryById(UUID categoryId) {
        log.info("Getting category by ID: {}", categoryId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));

        CategoryResponse categoryResponse = CategoryResponse.fromEntity(category);

        return categoryResponse;
    }

    /**
     * Tìm kiếm danh mục
     */
    // CategoryServiceImpl.java - update searchCategories method
    public PagedResponse<CategoryResponse> searchCategories(CategorySearchParams params) {
        log.info("Searching categories with params: {}", params);

        // Create specification from search params
        Specification<Category> spec = CategorySpecification.withSearchParams(params);

        // Create pageable with sorting
        Sort.Direction direction = Sort.Direction.fromString(params.getSortDirection());
        Sort sort = Sort.by(direction, params.getSortBy());
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);

        // Execute query
        Page<Category> categoryPage = categoryRepository.findAll(spec, pageable);

        // Convert to response
        List<CategoryResponse> content = categoryPage.getContent().stream()
                .map(category -> {
                    CategoryResponse response = CategoryResponse.fromEntity(category);
                    Long bookCount = categoryRepository.countBooksByCategoryId(category.getCategoryId());
                    response.setBookCount(bookCount);
                    return response;
                })
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                categoryPage.getNumber(),
                categoryPage.getSize(),
                categoryPage.getTotalElements()
        );
    }

    /**
     * Lấy cấu trúc phân cấp danh mục
     */
    public List<CategoryResponse> getCategoryHierarchy() {
        log.info("Getting category hierarchy");

        List<Category> rootCategories = categoryRepository.findByParentCategoryIsNull();

        List<CategoryResponse> hierarchy = rootCategories.stream()
                .map(category -> {
                    CategoryResponse response = CategoryResponse.fromEntity(category);
                    // Get book count for each category
                    Long bookCount = categoryRepository.countBooksByCategoryId(category.getCategoryId());
                    response.setBookCount(bookCount);
                    return response;
                })
                .collect(Collectors.toList());

        return hierarchy;
    }

    /**
     * Lấy danh mục con của một danh mục
     */
    public List<CategoryResponse> getCategoryChildren(UUID parentCategoryId) {
        log.info("Getting children for category: {}", parentCategoryId);

        List<Category> children = categoryRepository.findByParentCategoryCategoryId(parentCategoryId);

        List<CategoryResponse> childrenResponses = children.stream()
                .map(category -> {
                    CategoryResponse response = CategoryResponse.fromEntitySimple(category);
                    // Get book count for each category
                    Long bookCount = categoryRepository.countBooksByCategoryId(category.getCategoryId());
                    response.setBookCount(bookCount);
                    return response;
                })
                .collect(Collectors.toList());

        return childrenResponses;
    }


    /**
     * Category Command
     */
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
