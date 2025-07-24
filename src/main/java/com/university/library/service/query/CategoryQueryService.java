package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CategorySearchParams;
import com.university.library.entity.Category;
import com.university.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryQueryService {

    private final CategoryRepository categoryRepository;

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
    public PagedResponse<CategoryResponse> searchCategories(CategorySearchParams params) {
        log.info("Searching categories with params: {}", params);
        
        Specification<Category> spec = createSearchSpecification(params);
        
        Pageable pageable = PageRequest.of(
            params.getPage(),
            params.getSize(),
            Sort.by(
                Sort.Direction.fromString(params.getSortDirection()),
                params.getSortBy()
            )
        );
        
        Page<Category> categories = categoryRepository.findAll(spec, pageable);
        
        List<CategoryResponse> categoryResponses = categories.getContent().stream()
            .map(category -> {
                CategoryResponse response = CategoryResponse.fromEntitySimple(category);
                // Get book count for each category
                Long bookCount = categoryRepository.countBooksByCategoryId(category.getCategoryId());
                response.setBookCount(bookCount);
                return response;
            })
            .collect(Collectors.toList());
        
        PagedResponse<CategoryResponse> result = PagedResponse.of(
            categoryResponses,
            categories.getNumber(),
            categories.getSize(),
            categories.getTotalElements()
        );
        
        return result;
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
     * Tạo specification cho tìm kiếm
     */
    private Specification<Category> createSearchSpecification(CategorySearchParams params) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            
            if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm)
                ));
            }
                
            if (params.getParentCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("parentCategory").get("categoryId"), params.getParentCategoryId()));
            }
            
            if (params.getRootOnly() != null && params.getRootOnly()) {
                predicates.add(criteriaBuilder.isNull(root.get("parentCategory")));
            }
            
            if (params.getHasBooks() != null && params.getHasBooks()) {
                predicates.add(criteriaBuilder.isNotEmpty(root.get("books")));
            }
            
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
} 

