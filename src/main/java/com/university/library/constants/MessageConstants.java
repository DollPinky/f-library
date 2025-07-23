package com.university.library.constants;

public final class MessageConstants {
    
    private MessageConstants() {
        // Private constructor để tránh instantiation
    }
    
    // Success messages
    public static final String BOOK_CREATED_SUCCESS = "Tạo sách thành công";
    public static final String BOOK_UPDATED_SUCCESS = "Cập nhật sách thành công";
    public static final String BOOK_DELETED_SUCCESS = "Xóa sách thành công";
    public static final String BOOK_RETRIEVED_SUCCESS = "Lấy thông tin sách thành công";
    public static final String BOOKS_RETRIEVED_SUCCESS = "Lấy danh sách sách thành công";
    public static final String BOOK_SEARCH_SUCCESS = "Tìm kiếm sách thành công";
    
    // Error messages
    public static final String BOOK_NOT_FOUND = "Không tìm thấy sách";
    public static final String BOOK_CREATE_ERROR = "Không thể tạo sách";
    public static final String BOOK_UPDATE_ERROR = "Không thể cập nhật sách";
    public static final String BOOK_DELETE_ERROR = "Không thể xóa sách";
    public static final String BOOK_RETRIEVE_ERROR = "Không thể lấy thông tin sách";
    public static final String BOOKS_RETRIEVE_ERROR = "Không thể lấy danh sách sách";
    public static final String BOOK_SEARCH_ERROR = "Không thể tìm kiếm sách";
    
    // Validation messages
    public static final String ISBN_ALREADY_EXISTS = "ISBN đã tồn tại";
    public static final String PUBLISH_YEAR_INVALID = "Năm xuất bản không hợp lệ";
    public static final String BOOK_HAS_BORROWED_COPIES = "Không thể xóa sách có bản sao đang được mượn";
    public static final String CATEGORY_NOT_FOUND = "Không tìm thấy danh mục";
    public static final String LIBRARY_NOT_FOUND = "Không tìm thấy thư viện";
    
    // Field validation messages
    public static final String TITLE_REQUIRED = "Tên sách không được để trống";
    public static final String AUTHOR_REQUIRED = "Tác giả không được để trống";
    public static final String ISBN_REQUIRED = "ISBN không được để trống";
    public static final String PUBLISHER_REQUIRED = "Nhà xuất bản không được để trống";
    public static final String PUBLISH_YEAR_REQUIRED = "Năm xuất bản không được để trống";
    public static final String CATEGORY_REQUIRED = "Danh mục không được để trống";
    public static final String LIBRARY_REQUIRED = "Thư viện không được để trống";
    public static final String QUANTITY_REQUIRED = "Số lượng không được để trống";
    public static final String LOCATION_REQUIRED = "Vị trí không được để trống";
    
    // Status messages
    public static final String BOOK_ACTIVE = "ACTIVE";
    public static final String BOOK_INACTIVE = "INACTIVE";
    public static final String COPY_AVAILABLE = "AVAILABLE";
    public static final String COPY_BORROWED = "BORROWED";
    public static final String COPY_RESERVED = "RESERVED";
    public static final String COPY_MAINTENANCE = "MAINTENANCE";
    public static final String COPY_LOST = "LOST";


    public static final String SUCCESS_CREATE_ACCOUNT = "Create account successfully";
    public static final String LOGIN_SUCCESS = "Login successfully";
    public static final String INVALID_INPUT = "Invalid input/ Invalid request";
    public static final String ACCOUNT_NON_EXIST = "Account doesn't exist";

} 