package com.university.library.constants;

/**
 * Constants cho Library domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class LibraryConstants {
    
    // Error Messages
    public static final String ERROR_LIBRARY_NOT_FOUND = "Library not found with ID: ";
    public static final String ERROR_LIBRARY_IN_USE = "Library is currently in use and cannot be deleted";
    public static final String ERROR_CAMPUS_NOT_FOUND = "Campus not found with ID: ";
    public static final String ERROR_CODE_ALREADY_EXISTS = "Library code already exists: ";
    public static final String ERROR_SEARCH_FAILED = "Error occurred while searching libraries";

    // Success Messages
    public static final String SUCCESS_LIBRARY_CREATED = "Library created successfully";
    public static final String SUCCESS_LIBRARY_UPDATED = "Library updated successfully";
    public static final String SUCCESS_LIBRARY_DELETED = "Library deleted successfully";
    public static final String SUCCESS_LIBRARY_RETRIEVED = "Library retrieved successfully";
    public static final String SUCCESS_LIBRARIES_RETRIEVED = "Libraries retrieved successfully";

    // Log Messages
    public static final String LOG_LIBRARY_CREATED = "Library created with ID: {}";
    public static final String LOG_LIBRARY_UPDATED = "Library updated with ID: {}";
    public static final String LOG_LIBRARY_DELETED = "Library deleted with ID: {}";
    public static final String API_CREATE_LIBRARY = "POST /api/v1/libraries - Create request for library: {}";
    public static final String API_UPDATE_LIBRARY = "PUT /api/v1/libraries/{} - Update request";
    public static final String API_DELETE_LIBRARY = "DELETE /api/v1/libraries/{} - Delete request";
    public static final String API_GET_BY_CAMPUS = "GET /api/v1/libraries/campus/{} - Get libraries by campus request";
    public static final String API_GET_BY_CODE = "GET /api/v1/libraries/code/{} - Get library by code request";
    
    // Error Log Messages
    public static final String ERROR_LOG_CREATE_LIBRARY = "Error creating library: {}";
    public static final String ERROR_LOG_UPDATE_LIBRARY = "Error updating library: {} - {}";
    public static final String ERROR_LOG_DELETE_LIBRARY = "Error deleting library: {} - {}";

    private LibraryConstants() {
        // Private constructor to prevent instantiation
    }
}

