package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.CategoryResponse;
import com.university.library.dto.CategorySearchParams;
import com.university.library.entity.Category;
import com.university.library.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import org.mockito.MockedStatic;

@ExtendWith(MockitoExtension.class)
class CategoryQueryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryQueryService categoryQueryService;

    private Category testCategory;
    private UUID testCategoryId;

    @BeforeEach
    void setUp() {
        testCategoryId = UUID.randomUUID();
        testCategory = Category.builder()
                .categoryId(testCategoryId)
                .name("Test Category")
                .description("Test Description")
                .color("#5a735a")
                .books(new ArrayList<>())
                .subCategories(new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    void testGetCategoryByIdReturnsValidCategory() {
        when(categoryRepository.findById(testCategoryId)).thenReturn(Optional.of(testCategory));

        CategoryResponse result = categoryQueryService.getCategoryById(testCategoryId);

        assertNotNull(result);
        assertEquals(testCategoryId, result.getCategoryId());
        assertEquals("Test Category", result.getName());
        assertEquals("Test Description", result.getDescription());
        assertEquals("#5a735a", result.getColor());
    }

    @Test
    void testSearchCategoriesWithValidParamsReturnsPaginatedResults() {
        CategorySearchParams params = CategorySearchParams.builder()
                .query("test")
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("ASC")
                .build();

        List<Category> categories = List.of(testCategory);
        Page<Category> categoryPage = new PageImpl<>(categories, Pageable.ofSize(10), 1);

        when(categoryRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(categoryPage);
        when(categoryRepository.countBooksByCategoryId(testCategoryId)).thenReturn(5L);

        PagedResponse<CategoryResponse> result = categoryQueryService.searchCategories(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testCategoryId, result.getContent().get(0).getCategoryId());
        assertEquals(5L, result.getContent().get(0).getBookCount());
        assertEquals(0, result.getNumber());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetCategoryHierarchyReturnsRootCategoriesWithBookCounts() {
        List<Category> rootCategories = List.of(testCategory);

        when(categoryRepository.findByParentCategoryIsNull()).thenReturn(rootCategories);
        when(categoryRepository.countBooksByCategoryId(testCategoryId)).thenReturn(3L);

        List<CategoryResponse> result = categoryQueryService.getCategoryHierarchy();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCategoryId, result.get(0).getCategoryId());
        assertEquals("Test Category", result.get(0).getName());
        assertEquals(3L, result.get(0).getBookCount());
    }

    @Test
    void testGetCategoryByIdThrowsExceptionForNonExistentId() {
        UUID nonExistentId = UUID.randomUUID();
        when(categoryRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryQueryService.getCategoryById(nonExistentId);
        });

        assertTrue(exception.getMessage().contains("Category not found with ID"));
        assertTrue(exception.getMessage().contains(nonExistentId.toString()));
    }

    @Test
    void testGetCategoryChildrenReturnsEmptyListForCategoryWithNoChildren() {
        UUID parentCategoryId = UUID.randomUUID();
        when(categoryRepository.findByParentCategoryCategoryId(parentCategoryId))
                .thenReturn(new ArrayList<>());

        List<CategoryResponse> result = categoryQueryService.getCategoryChildren(parentCategoryId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testSearchCategoriesHandlesNullOrEmptyQueryParameters() {
        CategorySearchParams params = CategorySearchParams.builder()
                .query(null)
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("ASC")
                .build();

        List<Category> categories = List.of(testCategory);
        Page<Category> categoryPage = new PageImpl<>(categories, Pageable.ofSize(10), 1);

        when(categoryRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(categoryPage);
        when(categoryRepository.countBooksByCategoryId(testCategoryId)).thenReturn(0L);

        PagedResponse<CategoryResponse> result = categoryQueryService.searchCategories(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testCategoryId, result.getContent().get(0).getCategoryId());
    }

    @Test
    void testGetCategoryChildrenReturnsValidChildrenWithBookCounts() {
        UUID parentCategoryId = UUID.randomUUID();
        Category childCategory = Category.builder()
                .categoryId(UUID.randomUUID())
                .name("Child Category")
                .description("Child Description")
                .color("#5a735a")
                .books(new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        List<Category> children = List.of(childCategory);

        when(categoryRepository.findByParentCategoryCategoryId(parentCategoryId)).thenReturn(children);
        when(categoryRepository.countBooksByCategoryId(childCategory.getCategoryId())).thenReturn(2L);

        List<CategoryResponse> result = categoryQueryService.getCategoryChildren(parentCategoryId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(childCategory.getCategoryId(), result.get(0).getCategoryId());
        assertEquals("Child Category", result.get(0).getName());
        assertEquals(2L, result.get(0).getBookCount());
    }

    @Test
    void testCreateSearchSpecificationHandlesMultipleFiltersCorrectly() {
        UUID parentCategoryId = UUID.randomUUID();
        CategorySearchParams params = CategorySearchParams.builder()
                .query("technology")
                .parentCategoryId(parentCategoryId)
                .rootOnly(false)
                .hasBooks(true)
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("ASC")
                .build();

        List<Category> categories = List.of(testCategory);
        Page<Category> categoryPage = new PageImpl<>(categories, Pageable.ofSize(10), 1);

        when(categoryRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(categoryPage);
        when(categoryRepository.countBooksByCategoryId(testCategoryId)).thenReturn(1L);

        PagedResponse<CategoryResponse> result = categoryQueryService.searchCategories(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testCategoryId, result.getContent().get(0).getCategoryId());
        assertEquals(1L, result.getContent().get(0).getBookCount());
    }

    @Test
    void testSearchCategoriesFiltersByParentCategoryIdReturnsChildCategories() {
        UUID parentCategoryId = UUID.randomUUID();
        CategorySearchParams params = CategorySearchParams.builder()
                .parentCategoryId(parentCategoryId)
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("ASC")
                .build();

        Category childCategory = Category.builder()
                .categoryId(UUID.randomUUID())
                .name("Child Category")
                .description("Child Description")
                .color("#5a735a")
                .books(new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        List<Category> categories = List.of(childCategory);
        Page<Category> categoryPage = new PageImpl<>(categories, Pageable.ofSize(10), 1);

        when(categoryRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(categoryPage);
        when(categoryRepository.countBooksByCategoryId(childCategory.getCategoryId())).thenReturn(1L);

        PagedResponse<CategoryResponse> result = categoryQueryService.searchCategories(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(childCategory.getCategoryId(), result.getContent().get(0).getCategoryId());
    }

    @Test
    void testSearchCategoriesHandlesInvalidSortDirection() {
        CategorySearchParams params = CategorySearchParams.builder()
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("INVALID")
                .build();

        assertThrows(IllegalArgumentException.class, () -> {
            categoryQueryService.searchCategories(params);
        });
    }

    @Test
    void testServiceHandlesDatabaseExceptionsFromRepository() {
        UUID categoryId = UUID.randomUUID();
        when(categoryRepository.findById(categoryId))
                .thenThrow(new RuntimeException("Database connection failed"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryQueryService.getCategoryById(categoryId);
        });

        assertEquals("Database connection failed", exception.getMessage());
    }

    @Test
    void testGetCategoryByIdWithNonExistentUuidThrowsException() {
        UUID nonExistentId = UUID.randomUUID();
        when(categoryRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryQueryService.getCategoryById(nonExistentId);
        });

        assertTrue(exception.getMessage().contains("Category not found with ID"));
        assertTrue(exception.getMessage().contains(nonExistentId.toString()));
    }

    @Test
    void testGetCategoryChildrenWithNullParentIdHandlesConstraintViolation() {
        when(categoryRepository.findByParentCategoryCategoryId(null))
                .thenThrow(new RuntimeException("Database constraint violation"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryQueryService.getCategoryChildren(null);
        });

        assertEquals("Database constraint violation", exception.getMessage());
    }
}
