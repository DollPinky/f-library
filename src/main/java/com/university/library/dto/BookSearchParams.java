package com.university.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookSearchParams {
    
    /**
     * Từ khóa tìm kiếm (title, author, isbn)
     */
    private String query;
    
    /**
     * ID danh mục
     */
    private Long categoryId;
    
    /**
     * ID thư viện
     */
    private Long libraryId;
    
    /**
     * Trạng thái sách
     */
    private String status;
    
    /**
     * Số trang (bắt đầu từ 0)
     */
    private Integer page;
    
    /**
     * Kích thước trang
     */
    private Integer size;
    
    /**
     * Sắp xếp theo trường
     */
    private String sortBy;
    
    /**
     * Thứ tự sắp xếp (ASC/DESC)
     */
    private String sortDirection;
} 