package com.university.library.constants;

/**
 * Constants cho Category domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class CategoryConstants {
    
    // Error Messages
    public static final String ERROR_CATEGORY_NOT_FOUND = "Category not found with ID: ";
    public static final String ERROR_CATEGORY_ALREADY_EXISTS = "Category already exists with name: ";
    public static final String ERROR_PARENT_CATEGORY_NOT_FOUND = "Parent category not found with ID: ";
    public static final String ERROR_CATEGORY_HAS_CHILDREN = "Cannot delete category with sub-categories";
    public static final String ERROR_CATEGORY_HAS_BOOKS = "Cannot delete category with associated books";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching categories";

    // Success Messages
    public static final String SUCCESS_CATEGORY_CREATED = "Category created successfully";
    public static final String SUCCESS_CATEGORY_UPDATED = "Category updated successfully";
    public static final String SUCCESS_CATEGORY_DELETED = "Category deleted successfully";

    // Log Messages
    public static final String LOG_CATEGORY_CREATED = "Category created with ID: {}";
    public static final String LOG_CATEGORY_UPDATED = "Category updated with ID: {}";
    public static final String LOG_CATEGORY_DELETED = "Category deleted with ID: {}";
     public static final String LOG_UPDATING_CATEGORY = "Updating category with ID: {}";
    public static final String LOG_DELETING_CATEGORY = "Deleting category with ID: {}";
    
    // Validation Messages
       public static final String VALIDATION_CIRCULAR_REFERENCE = "Cannot create circular reference in category hierarchy";
    
    // Default Values

    // API Endpoints
    public static final String API_GET_CATEGORY = "GET /api/v1/categories/{} - Request received";
    public static final String API_SEARCH_CATEGORIES = "GET /api/v1/categories - Search request with params: {}";
    public static final String API_CREATE_CATEGORY = "POST /api/v1/categories - Create request for category: {}";
    public static final String API_UPDATE_CATEGORY = "PUT /api/v1/categories/{} - Update request";
    public static final String API_DELETE_CATEGORY = "DELETE /api/v1/categories/{} - Delete request";
    public static final String API_GET_HIERARCHY = "GET /api/v1/categories/hierarchy - Get category hierarchy request";
    public static final String API_GET_CHILDREN = "GET /api/v1/categories/{}/children - Get children categories request";
    
    private CategoryConstants() {

    }
} 

