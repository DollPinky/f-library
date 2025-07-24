package com.university.library.constants;

/**
 * Constants cho Category domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class CategoryConstants {
    
    // Error Messages
    public static final String ERROR_CATEGORY_NOT_FOUND = "Category not found with ID: ";
    public static final String ERROR_CATEGORY_ALREADY_EXISTS = "Category already exists with name: ";
    public static final String ERROR_INVALID_CATEGORY_DATA = "Invalid category data provided";
    public static final String ERROR_CATEGORY_IN_USE = "Category is currently in use and cannot be deleted";
    public static final String ERROR_PARENT_CATEGORY_NOT_FOUND = "Parent category not found with ID: ";
    public static final String ERROR_CATEGORY_HAS_CHILDREN = "Cannot delete category with sub-categories";
    public static final String ERROR_CATEGORY_HAS_BOOKS = "Cannot delete category with associated books";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching categories";
    public static final String ERROR_DELETE_FAILED = "Error occurred while deleting category";
    public static final String ERROR_HEALTH_CHECK_FAILED = "Health check failed";
    public static final String ERROR_SERVICE_UNHEALTHY = "Service is unhealthy";
    
    // Success Messages
    public static final String SUCCESS_CATEGORY_CREATED = "Category created successfully";
    public static final String SUCCESS_CATEGORY_UPDATED = "Category updated successfully";
    public static final String SUCCESS_CATEGORY_DELETED = "Category deleted successfully";
    public static final String SUCCESS_CATEGORY_RETRIEVED = "Category retrieved successfully";
    public static final String SUCCESS_CATEGORIES_RETRIEVED = "Categories retrieved successfully";
    public static final String SUCCESS_SERVICE_HEALTHY = "Service is healthy";
    
    // Log Messages
    public static final String LOG_CATEGORY_CREATED = "Category created with ID: {}";
    public static final String LOG_CATEGORY_UPDATED = "Category updated with ID: {}";
    public static final String LOG_CATEGORY_DELETED = "Category deleted with ID: {}";
    public static final String LOG_GETTING_CATEGORY = "Getting category by ID: {}";
    public static final String LOG_SEARCHING_CATEGORIES = "Searching categories with params: {}";
    public static final String LOG_CREATING_CATEGORY = "Creating new category with name: {}";
    public static final String LOG_UPDATING_CATEGORY = "Updating category with ID: {}";
    public static final String LOG_DELETING_CATEGORY = "Deleting category with ID: {}";
    
    // Validation Messages
    public static final String VALIDATION_NAME_REQUIRED = "Category name is required";
    public static final String VALIDATION_NAME_LENGTH = "Category name must be between 1 and 255 characters";
    public static final String VALIDATION_DESCRIPTION_LENGTH = "Category description must not exceed 1000 characters";
    public static final String VALIDATION_PARENT_CATEGORY_EXISTS = "Parent category must exist if specified";
    public static final String VALIDATION_CIRCULAR_REFERENCE = "Cannot create circular reference in category hierarchy";
    
    // Default Values
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final String DEFAULT_SORT_FIELD = "name";
    public static final String DEFAULT_SORT_DIRECTION = "ASC";
    
    // Search Constants
    public static final String SEARCH_FIELD_NAME = "name";
    public static final String SEARCH_FIELD_DESCRIPTION = "description";
    public static final String SEARCH_FIELD_PARENT = "parentCategory";
    
    // Status Constants
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_INACTIVE = "INACTIVE";
    public static final String STATUS_DELETED = "DELETED";
    
    // Test Data Constants
    public static final String TEST_CATEGORY_NAME = "Technology";
    public static final String TEST_CATEGORY_DESCRIPTION = "Technology and computer science books";
    public static final String TEST_PARENT_CATEGORY_NAME = "Science";
    public static final String TEST_PARENT_CATEGORY_DESCRIPTION = "Scientific books and publications";
    public static final String TEST_SEARCH_QUERY = "Tech";
    public static final String TEST_SEARCH_QUERY_LONG = "Technology and Computer Science";
    public static final String TEST_OLD_NAME = "Old Category";
    public static final String TEST_OLD_DESCRIPTION = "Old category description";
    public static final String TEST_DIFFERENT_NAME = "Literature";
    
    // API Endpoints
    public static final String API_BASE_PATH = "/api/v1/categories";
    public static final String API_GET_CATEGORY = "GET /api/v1/categories/{} - Request received";
    public static final String API_SEARCH_CATEGORIES = "GET /api/v1/categories - Search request with params: {}";
    public static final String API_CREATE_CATEGORY = "POST /api/v1/categories - Create request for category: {}";
    public static final String API_UPDATE_CATEGORY = "PUT /api/v1/categories/{} - Update request";
    public static final String API_DELETE_CATEGORY = "DELETE /api/v1/categories/{} - Delete request";
    public static final String API_GET_HIERARCHY = "GET /api/v1/categories/hierarchy - Get category hierarchy request";
    public static final String API_GET_CHILDREN = "GET /api/v1/categories/{}/children - Get children categories request";
    
    private CategoryConstants() {
        // Private constructor to prevent instantiation
    }
} 

