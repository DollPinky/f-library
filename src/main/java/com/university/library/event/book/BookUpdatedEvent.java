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
public class BookUpdatedEvent {
    // Book information
    private UUID bookId;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private String description;
    private UUID categoryId;
    private String categoryName;
    
    // Account information (who updated the book)
    private UUID updatedByAccountId;
    private String updatedByUsername;
    private String updatedByFullName;
    private String updatedByUserType; // STAFF hoặc READER
    private String updatedByStaffRole; // Chỉ có khi userType = STAFF
    private String updatedByEmployeeId; // Chỉ có khi userType = STAFF
    
    // Library information
    private UUID libraryId;
    private String libraryName;
    private UUID campusId;
    private String campusName;
    
    // Event metadata
    private LocalDateTime updatedAt;
    private String eventType = "BOOK_UPDATED";
    
    // Book copies information
    private Integer totalCopies;
    private Integer availableCopies;
    
    // Change tracking
    private String changeReason;
    private String previousTitle;
    private String previousAuthor;
    private String previousIsbn;
}
