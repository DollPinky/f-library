package com.university.library.dto.response.category;

import com.university.library.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
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
    private String color;
    private CategoryResponse parentCategory;
    private List<CategoryResponse> subCategories;
    private Long bookCount;
    private Instant createdAt;
    private Instant updatedAt;
    
    public static CategoryResponse fromEntity(Category category) {
        if (category == null) {
            return null;
        }
        
        return CategoryResponse.builder()
            .categoryId(category.getCategoryId())
            .name(category.getName())
            .description(category.getDescription())
            .color(category.getColor())
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
            .color(category.getColor())
            .bookCount(0L) // Avoid lazy loading issues
            .createdAt(category.getCreatedAt())
            .updatedAt(category.getUpdatedAt())
            .build();
    }
} 

