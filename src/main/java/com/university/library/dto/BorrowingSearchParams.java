package com.university.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingSearchParams {
    
    private String query;
    
    private String status;
    
    private Long readerId;
    
    private Long bookId;
    
    private Long libraryId;
    
    private Long campusId;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private Boolean isOverdue;
    
    private int page = 0;
    private int size = 20;
    
    private String sortBy = "borrowDate";
    private String sortDirection = "DESC";
} 