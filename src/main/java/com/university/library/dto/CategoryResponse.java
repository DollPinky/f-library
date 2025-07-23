package com.university.library.dto;

import com.university.library.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private UUID categoryId;
    private String name;
    private String description;
    private CategoryResponse parentCategory;
    private List<CategoryResponse> subCategories;
    private Long bookCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static CategoryResponse fromEntity(Category category) {
        if (category == null) {
            return null;
        }
        
        return CategoryResponse.builder()
            .categoryId(category.getCategoryId())
            .name(category.getName())
            .description(category.getDescription())
            .parentCategory(category.getParentCategory() != null ? 
                CategoryResponse.fromEntity(category.getParentCategory()) : null)
            .subCategories(category.getSubCategories() != null ? 
                category.getSubCategories().stream()
                    .filter(subCategory -> subCategory != null)
                    .map(subCategory -> {
                        try {
                            return CategoryResponse.fromEntity(subCategory);
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(response -> response != null)
                    .collect(Collectors.toList()) : null)
            .bookCount(category.getBooks() != null ? (long) category.getBooks().size() : 0L)
            .createdAt(category.getCreatedAt())
            .updatedAt(category.getUpdatedAt())
            .build();
    }
    
    /**
     * Simplified version without nested relationships for performance
     */
    public static CategoryResponse fromEntitySimple(Category category) {
        if (category == null) {
            return null;
        }
        
        return CategoryResponse.builder()
            .categoryId(category.getCategoryId())
            .name(category.getName())
            .description(category.getDescription())
            .bookCount(category.getBooks() != null ? (long) category.getBooks().size() : 0L)
            .createdAt(category.getCreatedAt())
            .updatedAt(category.getUpdatedAt())
            .build();
    }
} 