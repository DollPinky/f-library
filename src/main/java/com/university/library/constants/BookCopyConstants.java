package com.university.library.constants;

/**
 * Constants cho BookCopy domain
 * Sử dụng cho Cache keys, Kafka topics, Event types, và các thông tin khác
 */
public final class BookCopyConstants {
    
    // Error Messages
    public static final String ERROR_BOOK_COPY_NOT_FOUND = "Book copy not found with ID: ";
   public static final String ERROR_BOOK_COPY_IN_USE = "Book copy is currently in use and cannot be deleted";
   public static final String ERROR_QR_CODE_ALREADY_EXISTS = "QR code already exists: ";


    // Log Messages
    public static final String LOG_BOOK_COPY_CREATED = "Book copy created with ID: {}";
    public static final String LOG_BOOK_COPY_UPDATED = "Book copy updated with ID: {}";
    public static final String LOG_BOOK_COPY_DELETED = "Book copy deleted with ID: {}";
    public static final String LOG_STATUS_CHANGED = "Book copy status changed: {} -> {}";

    
    private BookCopyConstants() {
        // Private constructor to prevent instantiation
    }
} 

