package com.university.library.event.book;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookCreatedEvent {
    private UUID bookId;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private String description;
    private UUID categoryId;
    private String categoryName;
    
    private UUID createdByAccountId;
    private String createdByUsername;
    private String createdByFullName;
    private String createdByUserType; // STAFF hoặc READER
    private String createdByStaffRole; // Chỉ có khi userType = STAFF
    private String createdByEmployeeId; // Chỉ có khi userType = STAFF
    
    private UUID libraryId;
    private String libraryName;
    private UUID campusId;
    private String campusName;
    
    private LocalDateTime createdAt;
    private String eventType = "BOOK_CREATED";
    
    private Integer totalCopies;
    private Integer availableCopies;
}
