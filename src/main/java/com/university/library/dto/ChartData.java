package com.university.library.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartData {
    
    private List<BorrowingTrend> borrowingTrends;
    
    private List<CategoryDistribution> categoryDistribution;
    
    private List<TopBook> topBooks;
    
    private List<CampusStats> campusStats;
    
    private List<MonthlyStats> monthlyStats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BorrowingTrend {
        private String date;
        private long borrowCount;
        private long returnCount;
        private long overdueCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDistribution {
        private String categoryName;
        private long bookCount;
        private long borrowCount;
        private double percentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopBook {
        private UUID bookId;
        private String title;
        private String author;
        private long borrowCount;
        private double rating;
        private String category;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CampusStats {
        private String campusName;
        private long totalBooks;
        private long activeBorrowings;
        private long overdueBooks;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyStats {
        private String month;
        private long newBooks;
        private long totalBorrowings;
        private long totalReturns;
    }
} 

