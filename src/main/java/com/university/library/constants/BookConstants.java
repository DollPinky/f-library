package com.university.library.constants;

/**
 * Constants cho Book domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class BookConstants {
    
    // Error Messages
    public static final String ERROR_BOOK_NOT_FOUND = "Book not found with ID: ";
    public static final String ERROR_BOOK_ALREADY_EXISTS = "Book already exists with ISBN: ";
    public static final String ERROR_INVALID_BOOK_DATA = "Invalid book data provided";
    public static final String ERROR_BOOK_IN_USE = "Book is currently in use and cannot be deleted";
    public static final String ERROR_CATEGORY_NOT_FOUND = "Category not found with ID: ";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching books";
    public static final String ERROR_DELETE_FAILED = "Error occurred while deleting book";
    public static final String ERROR_BOOKID_INVALID = "Bookid must be not null";

    // Success Messages
    public static final String SUCCESS_BOOK_CREATED = "Book created successfully";
    public static final String SUCCESS_BOOK_UPDATED = "Book updated successfully";
    public static final String SUCCESS_BOOK_DELETED = "Book deleted successfully";
    public static final String SUCCESS_BOOK_RETRIEVED = "Book retrieved successfully";
    public static final String SUCCESS_BOOKS_RETRIEVED = "Books retrieved successfully";

    // Log Messages
    public static final String LOG_BOOK_CREATED = "Book created with ID: {}";
    public static final String LOG_BOOK_UPDATED = "Book updated with ID: {}";
    public static final String LOG_BOOK_DELETED = "Book deleted with ID: {}";
    public static final String LOG_GETTING_BOOK = "Getting book by ID: {}";
    public static final String LOG_SEARCHING_BOOKS = "Searching books with params: {}";
    public static final String LOG_CREATING_BOOK = "Creating new book with title: {}";
    public static final String LOG_UPDATING_BOOK = "Updating book with ID: {}";
    public static final String LOG_DELETING_BOOK = "Deleting book with ID: {}";

    // Default Values
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final String DEFAULT_SORT_FIELD = "createdAt";

    // Test Data Constants

    // API Endpoints
    public static final String API_GET_BOOK = "GET /api/v1/books/{} - Request received";
    public static final String API_SEARCH_BOOKS = "GET /api/v1/books - Search request with params: {}";
    public static final String API_CREATE_BOOK = "POST /api/v1/books - Create request for book: {}";
    public static final String API_UPDATE_BOOK = "PUT /api/v1/books/{} - Update request";
    public static final String API_DELETE_BOOK = "DELETE /api/v1/books/{} - Delete request";

    // Error Log Message
    public static final String ERROR_LOG_DELETE_BOOK = "Error deleting book: {} - {}";
    public static final String ERROR_LOG_UNEXPECTED_DELETE = "Unexpected error deleting book: {} - {}";
    

    
    private BookConstants() {
        // Private constructor to prevent instantiation
    }
} 

