package com.university.library.constants;

/**
 * Constants cho BookCopy domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class BookCopyConstants {
    
    // Cache Constants
    public static final String CACHE_NAME = "book-copies";
    public static final String CACHE_KEY_PREFIX_BOOK_COPY = "book-copy:";
    public static final String CACHE_KEY_PREFIX_SEARCH = "search:";
    public static final String CACHE_KEY_PREFIX_BOOK = "book:";
    public static final String CACHE_KEY_PREFIX_LIBRARY = "library:";
    public static final String CACHE_KEY_PREFIX_STATUS = "status:";
    
    // Kafka Topics
    public static final String TOPIC_BOOK_COPY_CREATED = "book-copy.created";
    public static final String TOPIC_BOOK_COPY_UPDATED = "book-copy.updated";
    public static final String TOPIC_BOOK_COPY_DELETED = "book-copy.deleted";
    public static final String TOPIC_BOOK_COPY_STATUS_CHANGED = "book-copy.status.changed";
    public static final String TOPIC_BOOK_COPY_CACHE_EVICT = "book-copy.cache.evict";
    
    // Event Types
    public static final String EVENT_BOOK_COPY_CREATED = "BOOK_COPY_CREATED";
    public static final String EVENT_BOOK_COPY_UPDATED = "BOOK_COPY_UPDATED";
    public static final String EVENT_BOOK_COPY_DELETED = "BOOK_COPY_DELETED";
    public static final String EVENT_BOOK_COPY_STATUS_CHANGED = "BOOK_COPY_STATUS_CHANGED";
    public static final String EVENT_CACHE_EVICT = "CACHE_EVICT";
    
    // Cache TTL (in minutes)
    public static final int CACHE_TTL_BOOK_COPY_DETAIL = 20;
    public static final int CACHE_TTL_BOOK_COPY_SEARCH = 15;
    public static final int CACHE_TTL_BOOK_COPY_LIST = 25;
    public static final int CACHE_TTL_LOCAL = 8;
    
    // Error Messages
    public static final String ERROR_BOOK_COPY_NOT_FOUND = "Book copy not found with ID: ";
    public static final String ERROR_BOOK_COPY_ALREADY_EXISTS = "Book copy already exists with QR code: ";
    public static final String ERROR_INVALID_BOOK_COPY_DATA = "Invalid book copy data provided";
    public static final String ERROR_BOOK_COPY_IN_USE = "Book copy is currently in use and cannot be deleted";
    public static final String ERROR_BOOK_NOT_FOUND = "Book not found with ID: ";
    public static final String ERROR_LIBRARY_NOT_FOUND = "Library not found with ID: ";
    public static final String ERROR_QR_CODE_ALREADY_EXISTS = "QR code already exists: ";
    public static final String ERROR_INVALID_STATUS_TRANSITION = "Invalid status transition from {} to {}";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching book copies";
    public static final String ERROR_CACHE_CLEAR_FAILED = "Error occurred while clearing cache";
    public static final String ERROR_CACHE_STATUS_FAILED = "Error occurred while getting cache status";
    public static final String ERROR_CACHE_STATS_FAILED = "Error occurred while getting cache statistics";
    public static final String ERROR_DELETE_FAILED = "Error occurred while deleting book copy";
    public static final String ERROR_HEALTH_CHECK_FAILED = "Health check failed";
    public static final String ERROR_SERVICE_UNHEALTHY = "Service is unhealthy";
    
    // Success Messages
    public static final String SUCCESS_BOOK_COPY_CREATED = "Book copy created successfully";
    public static final String SUCCESS_BOOK_COPY_UPDATED = "Book copy updated successfully";
    public static final String SUCCESS_BOOK_COPY_DELETED = "Book copy deleted successfully";
    public static final String SUCCESS_BOOK_COPY_RETRIEVED = "Book copy retrieved successfully";
    public static final String SUCCESS_BOOK_COPIES_RETRIEVED = "Book copies retrieved successfully";
    public static final String SUCCESS_STATUS_CHANGED = "Book copy status changed successfully";
    public static final String SUCCESS_CACHE_CLEARED = "Book copy cache cleared successfully";
    public static final String SUCCESS_CACHE_STATUS_RETRIEVED = "Cache status retrieved successfully";
    public static final String SUCCESS_CACHE_STATS_RETRIEVED = "Cache statistics retrieved successfully";
    public static final String SUCCESS_SERVICE_HEALTHY = "Service is healthy";
    public static final String SUCCESS_CACHE_BULK_CLEARED = "Cache cleared for {} book copies";
    
    // Log Messages
    public static final String LOG_BOOK_COPY_CREATED = "Book copy created with ID: {}";
    public static final String LOG_BOOK_COPY_UPDATED = "Book copy updated with ID: {}";
    public static final String LOG_BOOK_COPY_DELETED = "Book copy deleted with ID: {}";
    public static final String LOG_STATUS_CHANGED = "Book copy status changed: {} -> {}";
    public static final String LOG_CACHE_HIT = "Cache hit for book copy: {}";
    public static final String LOG_CACHE_MISS = "Cache miss for book copy: {}";
    public static final String LOG_CACHE_EVICTED = "Cache evicted for book copy: {}";
    public static final String LOG_KAFKA_EVENT_SENT = "Kafka event sent: {} for book copy: {}";
    public static final String LOG_KAFKA_EVENT_RECEIVED = "Kafka event received: {} for book copy: {}";
    public static final String LOG_GETTING_BOOK_COPY = "Getting book copy by ID: {}";
    public static final String LOG_SEARCHING_BOOK_COPIES = "Searching book copies with params: {}";
    public static final String LOG_CREATING_BOOK_COPY = "Creating new book copy with QR code: {}";
    public static final String LOG_UPDATING_BOOK_COPY = "Updating book copy with ID: {}";
    public static final String LOG_DELETING_BOOK_COPY = "Deleting book copy with ID: {}";
    public static final String LOG_CACHING_BOOK_COPY = "Cached book copy: {}";
    public static final String LOG_CLEARING_CACHE = "Cleared cache for {} book copies";
    public static final String LOG_CACHE_HIT_SEARCH = "Cache hit for book copies search: {}";
    public static final String LOG_CACHE_MISS_SEARCH = "Cache miss for book copies search: {}";
    public static final String LOG_CLEARING_SEARCH_CACHE = "Cleared book copies search cache for key: {}";
    
    // Validation Messages
    public static final String VALIDATION_QR_CODE_REQUIRED = "QR code is required";
    public static final String VALIDATION_QR_CODE_UNIQUE = "QR code must be unique";
    public static final String VALIDATION_BOOK_REQUIRED = "Book is required";
    public static final String VALIDATION_LIBRARY_REQUIRED = "Library is required";
    public static final String VALIDATION_STATUS_REQUIRED = "Status is required";
    public static final String VALIDATION_SHELF_LOCATION_LENGTH = "Shelf location must not exceed 100 characters";
    public static final String VALIDATION_QR_CODE_LENGTH = "QR code must not exceed 255 characters";
    public static final String VALIDATION_STATUS_TRANSITION = "Invalid status transition";
    
    // Default Values
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";
    
    // Search Constants
    public static final String SEARCH_FIELD_QR_CODE = "qrCode";
    public static final String SEARCH_FIELD_STATUS = "status";
    public static final String SEARCH_FIELD_SHELF_LOCATION = "shelfLocation";
    public static final String SEARCH_FIELD_BOOK_TITLE = "book.title";
    public static final String SEARCH_FIELD_LIBRARY_NAME = "library.name";
    
    // Status Constants
    public static final String STATUS_AVAILABLE = "AVAILABLE";
    public static final String STATUS_BORROWED = "BORROWED";
    public static final String STATUS_RESERVED = "RESERVED";
    public static final String STATUS_LOST = "LOST";
    public static final String STATUS_DAMAGED = "DAMAGED";
    
    // Test Data Constants
    public static final String TEST_QR_CODE = "QR-123456789";
    public static final String TEST_SHELF_LOCATION = "A1-B2-C3";
    public static final String TEST_BOOK_TITLE = "Test Book";
    public static final String TEST_LIBRARY_NAME = "Main Library";
    public static final String TEST_SEARCH_QUERY = "QR-123";
    public static final String TEST_SEARCH_QUERY_LONG = "QR-123456789";
    public static final String TEST_OLD_QR_CODE = "QR-OLD-123";
    public static final String TEST_OLD_SHELF_LOCATION = "OLD-A1-B2";
    public static final String TEST_DIFFERENT_QR_CODE = "QR-987654321";
    
    // API Endpoints
    public static final String API_BASE_PATH = "/api/v1/book-copies";
    public static final String API_GET_BOOK_COPY = "GET /api/v1/book-copies/{} - Request received";
    public static final String API_SEARCH_BOOK_COPIES = "GET /api/v1/book-copies - Search request with params: {}";
    public static final String API_CREATE_BOOK_COPY = "POST /api/v1/book-copies - Create request for book copy: {}";
    public static final String API_UPDATE_BOOK_COPY = "PUT /api/v1/book-copies/{} - Update request";
    public static final String API_DELETE_BOOK_COPY = "DELETE /api/v1/book-copies/{} - Delete request";
    public static final String API_CHANGE_STATUS = "PATCH /api/v1/book-copies/{}/status - Status change request";
    public static final String API_CLEAR_BOOK_COPY_CACHE = "DELETE /api/v1/book-copies/{}/cache - Clear cache request";
    public static final String API_CLEAR_SEARCH_CACHE = "DELETE /api/v1/book-copies/cache/search - Clear search cache request";
    public static final String API_CLEAR_ALL_CACHE = "DELETE /api/v1/book-copies/cache - Clear all cache request";
    public static final String API_BULK_CLEAR_CACHE = "POST /api/v1/book-copies/cache/bulk-clear - Clear cache for {} book copies";
    public static final String API_CACHE_STATUS = "GET /api/v1/book-copies/{}/cache/status - Cache status request";
    public static final String API_CACHE_STATS = "GET /api/v1/book-copies/cache/statistics - Cache statistics request";
    public static final String API_HEALTH_CHECK = "GET /api/v1/book-copies/health - Health check request";
    public static final String API_GET_BY_BOOK = "GET /api/v1/book-copies/book/{} - Get copies by book request";
    public static final String API_GET_BY_LIBRARY = "GET /api/v1/book-copies/library/{} - Get copies by library request";
    public static final String API_GET_BY_STATUS = "GET /api/v1/book-copies/status/{} - Get copies by status request";
    
    // Error Log Messages
    public static final String ERROR_LOG_GET_BOOK_COPY = "Error getting book copy by ID: {} - {}";
    public static final String ERROR_LOG_SEARCH_BOOK_COPIES = "Error searching book copies: {}";
    public static final String ERROR_LOG_CREATE_BOOK_COPY = "Error creating book copy: {}";
    public static final String ERROR_LOG_UPDATE_BOOK_COPY = "Error updating book copy: {} - {}";
    public static final String ERROR_LOG_DELETE_BOOK_COPY = "Error deleting book copy: {} - {}";
    public static final String ERROR_LOG_CHANGE_STATUS = "Error changing book copy status: {} - {}";
    public static final String ERROR_LOG_CLEAR_CACHE = "Error clearing book copy cache: {} - {}";
    public static final String ERROR_LOG_CLEAR_SEARCH_CACHE = "Error clearing search cache: {}";
    public static final String ERROR_LOG_CLEAR_ALL_CACHE = "Error clearing all cache: {}";
    public static final String ERROR_LOG_BULK_CLEAR_CACHE = "Error clearing book copies cache: {}";
    public static final String ERROR_LOG_CACHE_STATUS = "Error getting cache status: {} - {}";
    public static final String ERROR_LOG_CACHE_STATS = "Error getting cache statistics: {}";
    public static final String ERROR_LOG_HEALTH_CHECK = "Health check failed: {}";
    public static final String ERROR_LOG_UNEXPECTED_CREATE = "Unexpected error creating book copy: {}";
    public static final String ERROR_LOG_UNEXPECTED_UPDATE = "Unexpected error updating book copy: {} - {}";
    public static final String ERROR_LOG_UNEXPECTED_DELETE = "Unexpected error deleting book copy: {} - {}";
    
    // Cache Key Patterns
    public static final String CACHE_KEY_PATTERN_PAGE = "page=";
    public static final String CACHE_KEY_PATTERN_SIZE = "size=";
    public static final String CACHE_KEY_PATTERN_QUERY = "query=";
    public static final String CACHE_KEY_SEPARATOR = ":";
    
    // Service Names
    public static final String SERVICE_NAME = "Book Copy Service";
    
    private BookCopyConstants() {
        // Private constructor to prevent instantiation
    }
} 