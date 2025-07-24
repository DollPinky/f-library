package com.university.library.constants;

/**
 * Constants cho Book domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class BookConstants {
    
    // Cache Constants
    public static final String CACHE_NAME = "books";
    public static final String CACHE_KEY_PREFIX_BOOK = "book:";
    public static final String CACHE_KEY_PREFIX_SEARCH = "search:";
    public static final String CACHE_KEY_PREFIX_CATEGORY = "category:";
    public static final String CACHE_KEY_PREFIX_AUTHOR = "author:";
    public static final String CACHE_KEY_PREFIX_PUBLISHER = "publisher:";
    
    // Kafka Topics
    public static final String TOPIC_BOOK_CREATED = "book.created";
    public static final String TOPIC_BOOK_UPDATED = "book.updated";
    public static final String TOPIC_BOOK_DELETED = "book.deleted";
    public static final String TOPIC_BOOK_BORROWED = "book.borrowed";
    public static final String TOPIC_BOOK_RETURNED = "book.returned";
    public static final String TOPIC_BOOK_CACHE_EVICT = "book.cache.evict";
    
    // Event Types
    public static final String EVENT_BOOK_CREATED = "BOOK_CREATED";
    public static final String EVENT_BOOK_UPDATED = "BOOK_UPDATED";
    public static final String EVENT_BOOK_DELETED = "BOOK_DELETED";
    public static final String EVENT_BOOK_BORROWED = "BOOK_BORROWED";
    public static final String EVENT_BOOK_RETURNED = "BOOK_RETURNED";
    public static final String EVENT_CACHE_EVICT = "CACHE_EVICT";
    
    // Cache TTL (in minutes)
    public static final int CACHE_TTL_BOOK_DETAIL = 15;
    public static final int CACHE_TTL_BOOK_SEARCH = 10;
    public static final int CACHE_TTL_BOOK_LIST = 20;
    public static final int CACHE_TTL_LOCAL = 5;
    
    // Error Messages
    public static final String ERROR_BOOK_NOT_FOUND = "Book not found with ID: ";
    public static final String ERROR_BOOK_ALREADY_EXISTS = "Book already exists with ISBN: ";
    public static final String ERROR_INVALID_BOOK_DATA = "Invalid book data provided";
    public static final String ERROR_BOOK_IN_USE = "Book is currently in use and cannot be deleted";
    public static final String ERROR_CATEGORY_NOT_FOUND = "Category not found with ID: ";
    public static final String ERROR_LIBRARY_NOT_FOUND = "Library not found with ID: ";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching books";
    public static final String ERROR_CACHE_CLEAR_FAILED = "Error occurred while clearing cache";
    public static final String ERROR_CACHE_STATUS_FAILED = "Error occurred while getting cache status";
    public static final String ERROR_CACHE_STATS_FAILED = "Error occurred while getting cache statistics";
    public static final String ERROR_DELETE_FAILED = "Error occurred while deleting book";
    public static final String ERROR_HEALTH_CHECK_FAILED = "Health check failed";
    public static final String ERROR_SERVICE_UNHEALTHY = "Service is unhealthy";
    
    // Success Messages
    public static final String SUCCESS_BOOK_CREATED = "Book created successfully";
    public static final String SUCCESS_BOOK_UPDATED = "Book updated successfully";
    public static final String SUCCESS_BOOK_DELETED = "Book deleted successfully";
    public static final String SUCCESS_BOOK_RETRIEVED = "Book retrieved successfully";
    public static final String SUCCESS_BOOKS_RETRIEVED = "Books retrieved successfully";
    public static final String SUCCESS_CACHE_CLEARED = "Book cache cleared successfully";
    public static final String SUCCESS_CACHE_STATUS_RETRIEVED = "Cache status retrieved successfully";
    public static final String SUCCESS_CACHE_STATS_RETRIEVED = "Cache statistics retrieved successfully";
    public static final String SUCCESS_SERVICE_HEALTHY = "Service is healthy";
    public static final String SUCCESS_CACHE_BULK_CLEARED = "Cache cleared for {} books";
    
    // Log Messages
    public static final String LOG_BOOK_CREATED = "Book created with ID: {}";
    public static final String LOG_BOOK_UPDATED = "Book updated with ID: {}";
    public static final String LOG_BOOK_DELETED = "Book deleted with ID: {}";
    public static final String LOG_CACHE_HIT = "Cache hit for book: {}";
    public static final String LOG_CACHE_MISS = "Cache miss for book: {}";
    public static final String LOG_CACHE_EVICTED = "Cache evicted for book: {}";
    public static final String LOG_KAFKA_EVENT_SENT = "Kafka event sent: {} for book: {}";
    public static final String LOG_KAFKA_EVENT_RECEIVED = "Kafka event received: {} for book: {}";
    public static final String LOG_GETTING_BOOK = "Getting book by ID: {}";
    public static final String LOG_SEARCHING_BOOKS = "Searching books with params: {}";
    public static final String LOG_CREATING_BOOK = "Creating new book with title: {}";
    public static final String LOG_UPDATING_BOOK = "Updating book with ID: {}";
    public static final String LOG_DELETING_BOOK = "Deleting book with ID: {}";
    public static final String LOG_CACHING_BOOK = "Cached book: {}";
    public static final String LOG_CLEARING_CACHE = "Cleared cache for {} books";
    public static final String LOG_CACHE_HIT_SEARCH = "Cache hit for books search: {}";
    public static final String LOG_CACHE_MISS_SEARCH = "Cache miss for books search: {}";
    public static final String LOG_CLEARING_SEARCH_CACHE = "Cleared books search cache for key: {}";
    
    // Validation Messages
    public static final String VALIDATION_TITLE_REQUIRED = "Book title is required";
    public static final String VALIDATION_AUTHOR_REQUIRED = "Book author is required";
    public static final String VALIDATION_ISBN_REQUIRED = "Book ISBN is required";
    public static final String VALIDATION_ISBN_FORMAT = "Invalid ISBN format";
    public static final String VALIDATION_YEAR_RANGE = "Book year must be between 1900 and current year";
    public static final String VALIDATION_PUBLISHER_REQUIRED = "Book publisher is required";
    public static final String VALIDATION_CATEGORY_REQUIRED = "Book category is required";
    public static final String VALIDATION_PUBLISH_YEAR_REQUIRED = "Publish year is required";
    public static final String VALIDATION_PUBLISH_YEAR_POSITIVE = "Publish year must be positive";
    
    // Default Values
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";
    
    // Search Constants
    public static final String SEARCH_FIELD_TITLE = "title";
    public static final String SEARCH_FIELD_AUTHOR = "author";
    public static final String SEARCH_FIELD_ISBN = "isbn";
    public static final String SEARCH_FIELD_PUBLISHER = "publisher";
    public static final String SEARCH_FIELD_CATEGORY = "category";
    
    // Status Constants
    public static final String STATUS_AVAILABLE = "AVAILABLE";
    public static final String STATUS_BORROWED = "BORROWED";
    public static final String STATUS_RESERVED = "RESERVED";
    public static final String STATUS_MAINTENANCE = "MAINTENANCE";
    
    // Test Data Constants
    public static final String TEST_BOOK_TITLE = "Java Programming";
    public static final String TEST_BOOK_AUTHOR = "John Doe";
    public static final String TEST_BOOK_PUBLISHER = "Tech Books";
    public static final String TEST_BOOK_ISBN = "978-1234567890";
    public static final String TEST_CATEGORY_NAME = "Technology";
    public static final String TEST_CATEGORY_DESCRIPTION = "Technology books";
    public static final String TEST_SEARCH_QUERY = "Java";
    public static final String TEST_SEARCH_QUERY_LONG = "Java Programming";
    public static final String TEST_OLD_TITLE = "Old Title";
    public static final String TEST_OLD_AUTHOR = "Old Author";
    public static final String TEST_DIFFERENT_ISBN = "978-0987654321";
    
    // API Endpoints
    public static final String API_BASE_PATH = "/api/v1/books";
    public static final String API_GET_BOOK = "GET /api/v1/books/{} - Request received";
    public static final String API_SEARCH_BOOKS = "GET /api/v1/books - Search request with params: {}";
    public static final String API_CREATE_BOOK = "POST /api/v1/books - Create request for book: {}";
    public static final String API_UPDATE_BOOK = "PUT /api/v1/books/{} - Update request";
    public static final String API_DELETE_BOOK = "DELETE /api/v1/books/{} - Delete request";
    public static final String API_CLEAR_BOOK_CACHE = "DELETE /api/v1/books/{}/cache - Clear cache request";
    public static final String API_CLEAR_SEARCH_CACHE = "DELETE /api/v1/books/cache/search - Clear search cache request";
    public static final String API_CLEAR_ALL_CACHE = "DELETE /api/v1/books/cache - Clear all cache request";
    public static final String API_BULK_CLEAR_CACHE = "POST /api/v1/books/cache/bulk-clear - Clear cache for {} books";
    public static final String API_CACHE_STATUS = "GET /api/v1/books/{}/cache/status - Cache status request";
    public static final String API_CACHE_STATS = "GET /api/v1/books/cache/statistics - Cache statistics request";
    public static final String API_HEALTH_CHECK = "GET /api/v1/books/health - Health check request";
    
    // Error Log Messages
    public static final String ERROR_LOG_GET_BOOK = "Error getting book by ID: {} - {}";
    public static final String ERROR_LOG_SEARCH_BOOKS = "Error searching books: {}";
    public static final String ERROR_LOG_CREATE_BOOK = "Error creating book: {}";
    public static final String ERROR_LOG_UPDATE_BOOK = "Error updating book: {} - {}";
    public static final String ERROR_LOG_DELETE_BOOK = "Error deleting book: {} - {}";
    public static final String ERROR_LOG_CLEAR_CACHE = "Error clearing book cache: {} - {}";
    public static final String ERROR_LOG_CLEAR_SEARCH_CACHE = "Error clearing search cache: {}";
    public static final String ERROR_LOG_CLEAR_ALL_CACHE = "Error clearing all cache: {}";
    public static final String ERROR_LOG_BULK_CLEAR_CACHE = "Error clearing books cache: {}";
    public static final String ERROR_LOG_CACHE_STATUS = "Error getting cache status: {} - {}";
    public static final String ERROR_LOG_CACHE_STATS = "Error getting cache statistics: {}";
    public static final String ERROR_LOG_HEALTH_CHECK = "Health check failed: {}";
    public static final String ERROR_LOG_UNEXPECTED_CREATE = "Unexpected error creating book: {}";
    public static final String ERROR_LOG_UNEXPECTED_UPDATE = "Unexpected error updating book: {} - {}";
    public static final String ERROR_LOG_UNEXPECTED_DELETE = "Unexpected error deleting book: {} - {}";
    
    // Cache Key Patterns
    public static final String CACHE_KEY_PATTERN_PAGE = "page=";
    public static final String CACHE_KEY_PATTERN_SIZE = "size=";
    public static final String CACHE_KEY_PATTERN_QUERY = "query=";
    public static final String CACHE_KEY_SEPARATOR = ":";
    
    // Service Names
    public static final String SERVICE_NAME = "Book Service";
    
    private BookConstants() {
        // Private constructor to prevent instantiation
    }
} 

