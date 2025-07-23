package com.university.library.constants;

/**
 * Constants cho Library domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class LibraryConstants {
    
    // Cache Constants
    public static final String CACHE_NAME = "libraries";
    public static final String CACHE_KEY_PREFIX_LIBRARY = "library:";
    public static final String CACHE_KEY_PREFIX_SEARCH = "search:";
    public static final String CACHE_KEY_PREFIX_CAMPUS = "campus:";
    public static final String CACHE_KEY_PREFIX_CODE = "code:";
    
    // Kafka Topics
    public static final String TOPIC_LIBRARY_CREATED = "library.created";
    public static final String TOPIC_LIBRARY_UPDATED = "library.updated";
    public static final String TOPIC_LIBRARY_DELETED = "library.deleted";
    public static final String TOPIC_LIBRARY_CACHE_EVICT = "library.cache.evict";
    
    // Event Types
    public static final String EVENT_LIBRARY_CREATED = "LIBRARY_CREATED";
    public static final String EVENT_LIBRARY_UPDATED = "LIBRARY_UPDATED";
    public static final String EVENT_LIBRARY_DELETED = "LIBRARY_DELETED";
    public static final String EVENT_CACHE_EVICT = "CACHE_EVICT";
    
    // Cache TTL (in minutes)
    public static final int CACHE_TTL_LIBRARY_DETAIL = 30;
    public static final int CACHE_TTL_LIBRARY_SEARCH = 20;
    public static final int CACHE_TTL_LIBRARY_LIST = 35;
    public static final int CACHE_TTL_LOCAL = 10;
    
    // Error Messages
    public static final String ERROR_LIBRARY_NOT_FOUND = "Library not found with ID: ";
    public static final String ERROR_LIBRARY_ALREADY_EXISTS = "Library already exists with code: ";
    public static final String ERROR_INVALID_LIBRARY_DATA = "Invalid library data provided";
    public static final String ERROR_LIBRARY_IN_USE = "Library is currently in use and cannot be deleted";
    public static final String ERROR_CAMPUS_NOT_FOUND = "Campus not found with ID: ";
    public static final String ERROR_CODE_ALREADY_EXISTS = "Library code already exists: ";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching libraries";
    public static final String ERROR_CACHE_CLEAR_FAILED = "Error occurred while clearing cache";
    public static final String ERROR_CACHE_STATUS_FAILED = "Error occurred while getting cache status";
    public static final String ERROR_DELETE_FAILED = "Error occurred while deleting library";
    public static final String ERROR_HEALTH_CHECK_FAILED = "Health check failed";
    public static final String ERROR_SERVICE_UNHEALTHY = "Service is unhealthy";
    
    // Success Messages
    public static final String SUCCESS_LIBRARY_CREATED = "Library created successfully";
    public static final String SUCCESS_LIBRARY_UPDATED = "Library updated successfully";
    public static final String SUCCESS_LIBRARY_DELETED = "Library deleted successfully";
    public static final String SUCCESS_LIBRARY_RETRIEVED = "Library retrieved successfully";
    public static final String SUCCESS_LIBRARIES_RETRIEVED = "Libraries retrieved successfully";
    public static final String SUCCESS_CACHE_CLEARED = "Library cache cleared successfully";
    public static final String SUCCESS_CACHE_STATUS_RETRIEVED = "Cache status retrieved successfully";
    public static final String SUCCESS_SERVICE_HEALTHY = "Service is healthy";
    public static final String SUCCESS_CACHE_BULK_CLEARED = "Cache cleared for {} libraries";
    
    // Log Messages
    public static final String LOG_LIBRARY_CREATED = "Library created with ID: {}";
    public static final String LOG_LIBRARY_UPDATED = "Library updated with ID: {}";
    public static final String LOG_LIBRARY_DELETED = "Library deleted with ID: {}";
    public static final String LOG_CACHE_HIT = "Cache hit for library: {}";
    public static final String LOG_CACHE_MISS = "Cache miss for library: {}";
    public static final String LOG_CACHE_EVICTED = "Cache evicted for library: {}";
    public static final String LOG_KAFKA_EVENT_SENT = "Kafka event sent: {} for library: {}";
    public static final String LOG_KAFKA_EVENT_RECEIVED = "Kafka event received: {} for library: {}";
    public static final String LOG_GETTING_LIBRARY = "Getting library by ID: {}";
    public static final String LOG_SEARCHING_LIBRARIES = "Searching libraries with params: {}";
    public static final String LOG_CREATING_LIBRARY = "Creating new library with code: {}";
    public static final String LOG_UPDATING_LIBRARY = "Updating library with ID: {}";
    public static final String LOG_DELETING_LIBRARY = "Deleting library with ID: {}";
    public static final String LOG_CACHING_LIBRARY = "Cached library: {}";
    public static final String LOG_CLEARING_CACHE = "Cleared cache for {} libraries";
    public static final String LOG_CACHE_HIT_SEARCH = "Cache hit for libraries search: {}";
    public static final String LOG_CACHE_MISS_SEARCH = "Cache miss for libraries search: {}";
    public static final String LOG_CLEARING_SEARCH_CACHE = "Cleared libraries search cache for key: {}";
    
    // Validation Messages
    public static final String VALIDATION_NAME_REQUIRED = "Library name is required";
    public static final String VALIDATION_CODE_REQUIRED = "Library code is required";
    public static final String VALIDATION_CODE_UNIQUE = "Library code must be unique";
    public static final String VALIDATION_ADDRESS_REQUIRED = "Library address is required";
    public static final String VALIDATION_CAMPUS_REQUIRED = "Campus is required";
    public static final String VALIDATION_NAME_LENGTH = "Library name must not exceed 255 characters";
    public static final String VALIDATION_CODE_LENGTH = "Library code must not exceed 50 characters";
    public static final String VALIDATION_ADDRESS_LENGTH = "Library address must not exceed 1000 characters";
    
    // Default Values
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final String DEFAULT_SORT_FIELD = "name";
    public static final String DEFAULT_SORT_DIRECTION = "ASC";
    
    // Search Constants
    public static final String SEARCH_FIELD_NAME = "name";
    public static final String SEARCH_FIELD_CODE = "code";
    public static final String SEARCH_FIELD_ADDRESS = "address";
    public static final String SEARCH_FIELD_CAMPUS_NAME = "campus.name";
    
    // Test Data Constants
    public static final String TEST_LIBRARY_NAME = "Main Library";
    public static final String TEST_LIBRARY_CODE = "ML001";
    public static final String TEST_LIBRARY_ADDRESS = "123 University Street, City";
    public static final String TEST_SEARCH_QUERY = "Main";
    public static final String TEST_SEARCH_QUERY_LONG = "Main Library";
    public static final String TEST_OLD_NAME = "Old Library Name";
    public static final String TEST_OLD_CODE = "OL001";
    public static final String TEST_DIFFERENT_CODE = "ML002";
    
    // API Endpoints
    public static final String API_BASE_PATH = "/api/v1/libraries";
    public static final String API_GET_LIBRARY = "GET /api/v1/libraries/{} - Request received";
    public static final String API_SEARCH_LIBRARIES = "GET /api/v1/libraries - Search request with params: {}";
    public static final String API_CREATE_LIBRARY = "POST /api/v1/libraries - Create request for library: {}";
    public static final String API_UPDATE_LIBRARY = "PUT /api/v1/libraries/{} - Update request";
    public static final String API_DELETE_LIBRARY = "DELETE /api/v1/libraries/{} - Delete request";
    public static final String API_CLEAR_LIBRARY_CACHE = "DELETE /api/v1/libraries/{}/cache - Clear cache request";
    public static final String API_CLEAR_SEARCH_CACHE = "DELETE /api/v1/libraries/cache/search - Clear search cache request";
    public static final String API_CLEAR_ALL_CACHE = "DELETE /api/v1/libraries/cache - Clear all cache request";
    public static final String API_BULK_CLEAR_CACHE = "POST /api/v1/libraries/cache/bulk-clear - Clear cache for {} libraries";
    public static final String API_CACHE_STATUS = "GET /api/v1/libraries/{}/cache/status - Cache status request";
    public static final String API_HEALTH_CHECK = "GET /api/v1/libraries/health - Health check request";
    public static final String API_GET_BY_CAMPUS = "GET /api/v1/libraries/campus/{} - Get libraries by campus request";
    public static final String API_GET_BY_CODE = "GET /api/v1/libraries/code/{} - Get library by code request";
    
    // Error Log Messages
    public static final String ERROR_LOG_GET_LIBRARY = "Error getting library by ID: {} - {}";
    public static final String ERROR_LOG_SEARCH_LIBRARIES = "Error searching libraries: {}";
    public static final String ERROR_LOG_CREATE_LIBRARY = "Error creating library: {}";
    public static final String ERROR_LOG_UPDATE_LIBRARY = "Error updating library: {} - {}";
    public static final String ERROR_LOG_DELETE_LIBRARY = "Error deleting library: {} - {}";
    public static final String ERROR_LOG_CLEAR_CACHE = "Error clearing library cache: {} - {}";
    public static final String ERROR_LOG_CLEAR_SEARCH_CACHE = "Error clearing search cache: {}";
    public static final String ERROR_LOG_CLEAR_ALL_CACHE = "Error clearing all cache: {}";
    public static final String ERROR_LOG_BULK_CLEAR_CACHE = "Error clearing libraries cache: {}";
    public static final String ERROR_LOG_CACHE_STATUS = "Error getting cache status: {} - {}";
    public static final String ERROR_LOG_HEALTH_CHECK = "Health check failed: {}";
    public static final String ERROR_LOG_UNEXPECTED_CREATE = "Unexpected error creating library: {}";
    public static final String ERROR_LOG_UNEXPECTED_UPDATE = "Unexpected error updating library: {} - {}";
    public static final String ERROR_LOG_UNEXPECTED_DELETE = "Unexpected error deleting library: {} - {}";
    
    // Cache Key Patterns
    public static final String CACHE_KEY_PATTERN_PAGE = "page=";
    public static final String CACHE_KEY_PATTERN_SIZE = "size=";
    public static final String CACHE_KEY_PATTERN_QUERY = "query=";
    public static final String CACHE_KEY_SEPARATOR = ":";
    
    // Service Names
    public static final String SERVICE_NAME = "Library Service";
    
    private LibraryConstants() {
        // Private constructor to prevent instantiation
    }
}
