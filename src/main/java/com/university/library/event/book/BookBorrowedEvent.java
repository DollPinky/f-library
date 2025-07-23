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
public class BookBorrowedEvent {
    private UUID borrowingId;
    private UUID bookCopyId;
    private String qrCode;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private String borrowingStatus;
    
    private UUID bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookIsbn;
    private String bookCategory;
    
    private UUID readerAccountId;
    private String readerUsername;
    private String readerFullName;
    private String readerStudentId;
    private String readerFaculty;
    private String readerMajor;
    private Integer readerCurrentBorrowCount;
    private Integer readerMaxBorrowLimit;
    private Double readerFineAmount;
    
    private UUID librarianAccountId;
    private String librarianUsername;
    private String librarianFullName;
    private String librarianUserType; // STAFF
    private String librarianStaffRole; // ADMIN, LIBRARIAN, MANAGER, ASSISTANT
    private String librarianEmployeeId;
    
    private UUID libraryId;
    private String libraryName;
    private UUID campusId;
    private String campusName;
    private String bookLocation;
    
    private LocalDateTime eventTime;
    private String eventType = "BOOK_BORROWED";
    
    private Boolean isOverdue;
    private Integer overdueDays;
    private Double calculatedFine;
} 