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
public class BookDeletedEvent {
    private UUID bookId;
    private String title;
    private String author;
    private String isbn;
    
    private UUID deletedByAccountId;
    private String deletedByUsername;
    private String deletedByFullName;
    private String deletedByUserType; // STAFF hoặc READER
    private String deletedByStaffRole; // Chỉ có khi userType = STAFF
    private String deletedByEmployeeId; // Chỉ có khi userType = STAFF
    
    private UUID libraryId;
    private String libraryName;
    private UUID campusId;
    private String campusName;
    
    private LocalDateTime deletedAt;
    private String eventType = "BOOK_DELETED";
    
    private String deletionReason;
    private Integer totalCopiesBeforeDeletion;
    private Integer borrowedCopiesBeforeDeletion;
    private Boolean hasActiveBorrowings;
}
