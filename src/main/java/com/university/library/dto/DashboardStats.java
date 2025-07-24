package com.university.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    
    private long totalBooks;
    private long activeBorrowings;
    private long totalLibraries;
    
    private Long previousTotalBooks;
    private Long previousActiveBorrowings;
    private Long previousTotalLibraries;
    
    private long overdueBooks;
    private long returnedToday;
    private long newBooksThisMonth;
    
    private long hanoiBooks;
    private long hanoiBorrowings;
    
    private long hcmBooks;
    private long hcmBorrowings;
    
    private long danangBooks;
    private long danangBorrowings;
} 

