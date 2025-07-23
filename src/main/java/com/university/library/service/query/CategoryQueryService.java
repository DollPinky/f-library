package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.constants.CategoryConstants;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CategorySearchParams;
import com.university.library.entity.Category;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.ManualCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryQueryService {

    private final CategoryRepository categoryRepository;
    private final ManualCacheService cacheService;

    /**
     * Lấy danh mục theo ID với cache
     */
    public CategoryResponse getCategoryById(UUID categoryId) {
        log.info(CategoryConstants.LOG_GETTING_CATEGORY, categoryId);
        
        String cacheKey = CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + categoryId;
        
        // Try to get from cache first
        var cachedResult = cacheService.get(CategoryConstants.CACHE_NAME, cacheKey, CategoryResponse.class);
        if (cachedResult.isPresent()) {
            log.info(CategoryConstants.LOG_CACHE_HIT, categoryId);
            return cachedResult.get();
        }
        
        log.info(CategoryConstants.LOG_CACHE_MISS, categoryId);
        
        // Get from database
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException(CategoryConstants.ERROR_CATEGORY_NOT_FOUND + categoryId));
        
        CategoryResponse categoryResponse = CategoryResponse.fromEntity(category);
        
        // Cache the result
        cacheCategory(categoryResponse);
        
        return categoryResponse;
    }

    /**
     * Tìm kiếm danh mục với cache
     */
    public PagedResponse<CategoryResponse> searchCategories(CategorySearchParams params) {
        log.info(CategoryConstants.LOG_SEARCHING_CATEGORIES, params);
        
        String cacheKey = buildSearchCacheKey(params);
        
        // Try to get from cache first
        var cachedResult = cacheService.get(CategoryConstants.CACHE_NAME, cacheKey, PagedResponse.class);
        if (cachedResult.isPresent()) {
            log.info(CategoryConstants.LOG_CACHE_HIT_SEARCH, cacheKey);
            return (PagedResponse<CategoryResponse>) cachedResult.get();
        }
        
        log.info(CategoryConstants.LOG_CACHE_MISS_SEARCH, cacheKey);
        
        // Create specification for search
        Specification<Category> spec = createSearchSpecification(params);
        
        // Create pageable
        Pageable pageable = PageRequest.of(
            params.getPage() != null ? params.getPage() : 0,
            params.getSize() != null ? params.getSize() : CategoryConstants.DEFAULT_PAGE_SIZE,
            Sort.by(
                Sort.Direction.fromString(params.getSortDirection() != null ? params.getSortDirection() : "ASC"),
                params.getSortBy() != null ? params.getSortBy() : CategoryConstants.DEFAULT_SORT_FIELD
            )
        );
        
        // Query database
        Page<Category> categories = categoryRepository.findAll(spec, pageable);
        
        // Convert to response
        List<CategoryResponse> categoryResponses = categories.getContent().stream()
            .map(CategoryResponse::fromEntitySimple)
            .collect(Collectors.toList());
        
        PagedResponse<CategoryResponse> result = PagedResponse.<CategoryResponse>builder()
            .content(categoryResponses)
            .totalElements(categories.getTotalElements())
            .totalPages(categories.getTotalPages())
            .build();
        
        // Cache the result
        Duration localTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_LOCAL);
        Duration distributedTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_CATEGORY_SEARCH);
        cacheService.put(CategoryConstants.CACHE_NAME, cacheKey, result, localTtl, distributedTtl);
        
        return result;
    }

    /**
     * Lấy cấu trúc phân cấp danh mục
     */
    public List<CategoryResponse> getCategoryHierarchy() {
        log.info("Getting category hierarchy");
        
        String cacheKey = CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + "hierarchy";
        
        // Try to get from cache first
        var cachedResult = cacheService.get(CategoryConstants.CACHE_NAME, cacheKey, List.class);
        if (cachedResult.isPresent()) {
            return (List<CategoryResponse>) cachedResult.get();
        }
        
        // Get root categories (no parent)
        List<Category> rootCategories = categoryRepository.findByParentCategoryIsNull();
        
        List<CategoryResponse> hierarchy = rootCategories.stream()
            .map(CategoryResponse::fromEntity)
            .collect(Collectors.toList());
        
        // Cache the result
        Duration localTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_LOCAL);
        Duration distributedTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_CATEGORY_LIST);
        cacheService.put(CategoryConstants.CACHE_NAME, cacheKey, hierarchy, localTtl, distributedTtl);
        
        return hierarchy;
    }

    /**
     * Lấy danh mục con của một danh mục
     */
    public List<CategoryResponse> getCategoryChildren(UUID parentCategoryId) {
        log.info("Getting children for category: {}", parentCategoryId);
        
        String cacheKey = CategoryConstants.CACHE_KEY_PREFIX_CHILDREN + parentCategoryId;
        
        // Try to get from cache first
        var cachedResult = cacheService.get(CategoryConstants.CACHE_NAME, cacheKey, List.class);
        if (cachedResult.isPresent()) {
            return (List<CategoryResponse>) cachedResult.get();
        }
        
        // Get children from database
        List<Category> children = categoryRepository.findByParentCategoryCategoryId(parentCategoryId);
        
        List<CategoryResponse> childrenResponses = children.stream()
            .map(CategoryResponse::fromEntitySimple)
            .collect(Collectors.toList());
        
        // Cache the result
        Duration localTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_LOCAL);
        Duration distributedTtl = Duration.ofMinutes(CategoryConstants.CACHE_TTL_CATEGORY_LIST);
        cacheService.put(CategoryConstants.CACHE_NAME, cacheKey, childrenResponses, localTtl, distributedTtl);
        
        return childrenResponses;
    }

    /**
     * Kiểm tra xem category có trong cache không
     */
    public boolean isCategoryCached(UUID categoryId) {
        String cacheKey = CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + categoryId;
        return cacheService.exists(CategoryConstants.CACHE_NAME, cacheKey);
    }

    /**
     * Lấy TTL của category trong cache
     */
    public Long getCategoryCacheTtl(UUID categoryId) {
        String cacheKey = CategoryConstants.CACHE_KEY_PREFIX_CATEGORY + categoryId;
        return cacheService.getTtl(CategoryConstants.CACHE_NAME, cacheKey);
    }

    // ==================== CACHE MANAGEMENT ====================

    /**
     * Xóa cache cho một category cụ thể
     */
    public void clearCategoryCache(UUID categoryId) {
        log.info(CategoryConstants.LOG_CACHE_EVICTED, categoryId);
        
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
        log.info(CategoryConstants.LOG_CLEARING_CACHE, categoryIds.size());
        
        categoryIds.forEach(this::clearCategoryCache);
    }

    /**
     * Xóa toàn bộ search cache
     */
    public void clearSearchCache() {
        log.info("Clearing all category search cache");
        cacheService.evictAll(CategoryConstants.CACHE_NAME);
    }

    /**
     * Xóa cache cho một tìm kiếm cụ thể
     */
    public void clearSearchCache(CategorySearchParams params) {
        String cacheKey = buildSearchCacheKey(params);
        log.info(CategoryConstants.LOG_CLEARING_SEARCH_CACHE, cacheKey);
        cacheService.evict(CategoryConstants.CACHE_NAME, cacheKey);
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

    /**
     * Tạo specification cho tìm kiếm
     */
    private Specification<Category> createSearchSpecification(CategorySearchParams params) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            
            // Search by query (name or description)
            if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm)
                ));
            }
            
            // Filter by parent category
            if (params.getParentCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("parentCategory").get("categoryId"), params.getParentCategoryId()));
            }
            
            // Filter root categories only
            if (params.getRootOnly() != null && params.getRootOnly()) {
                predicates.add(criteriaBuilder.isNull(root.get("parentCategory")));
            }
            
            // Filter categories with books
            if (params.getHasBooks() != null && params.getHasBooks()) {
                predicates.add(criteriaBuilder.isNotEmpty(root.get("books")));
            }
            
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    /**
     * Tạo cache key cho search
     */
    private String buildSearchCacheKey(CategorySearchParams params) {
        StringBuilder keyBuilder = new StringBuilder(CategoryConstants.CACHE_KEY_PREFIX_SEARCH);
        
        if (params.getQuery() != null) {
            keyBuilder.append(CategoryConstants.CACHE_KEY_PATTERN_QUERY).append(params.getQuery());
        }
        if (params.getParentCategoryId() != null) {
            keyBuilder.append(CategoryConstants.CACHE_KEY_SEPARATOR).append("parent=").append(params.getParentCategoryId());
        }
        if (params.getRootOnly() != null) {
            keyBuilder.append(CategoryConstants.CACHE_KEY_SEPARATOR).append("root=").append(params.getRootOnly());
        }
        if (params.getHasBooks() != null) {
            keyBuilder.append(CategoryConstants.CACHE_KEY_SEPARATOR).append("hasBooks=").append(params.getHasBooks());
        }
        keyBuilder.append(CategoryConstants.CACHE_KEY_SEPARATOR)
            .append(CategoryConstants.CACHE_KEY_PATTERN_PAGE).append(params.getPage())
            .append(CategoryConstants.CACHE_KEY_SEPARATOR)
            .append(CategoryConstants.CACHE_KEY_PATTERN_SIZE).append(params.getSize())
            .append(CategoryConstants.CACHE_KEY_SEPARATOR)
            .append("sort=").append(params.getSortBy()).append(",").append(params.getSortDirection());
        
        return keyBuilder.toString();
    }
} 