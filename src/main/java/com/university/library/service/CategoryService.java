package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.request.category.CategorySearchParams;
import com.university.library.dto.request.category.CreateCategoryCommand;
import com.university.library.dto.response.category.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    /**
     Category Query
     */
    CategoryResponse getCategoryById(UUID categoryId);
    PagedResponse<CategoryResponse> searchCategories(CategorySearchParams params);
    List<CategoryResponse> getCategoryHierarchy();
    List<CategoryResponse> getCategoryChildren(UUID parentCategoryId);

    /**
     * Category Command
     */
    CategoryResponse createCategory(CreateCategoryCommand command);
    CategoryResponse updateCategory(UUID categoryId, CreateCategoryCommand command);
    void deleteCategory(UUID categoryId);
}
