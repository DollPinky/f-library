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
public class BookReturnedEvent {
    // Borrowing information
    private UUID borrowingId;
    private UUID bookCopyId;
    private String qrCode;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private String borrowingStatus;
    
    // Book information
    private UUID bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookIsbn;
    private String bookCategory;
    
    // Reader information (who returned)
    private UUID readerAccountId;
    private String readerUsername;
    private String readerFullName;
    private String readerStudentId;
    private String readerFaculty;
    private String readerMajor;
    private Integer readerCurrentBorrowCount;
    private Integer readerMaxBorrowLimit;
    private Double readerFineAmount;
    
    // Librarian information (who processed return)
    private UUID librarianAccountId;
    private String librarianUsername;
    private String librarianFullName;
    private String librarianUserType; // STAFF
    private String librarianStaffRole; // ADMIN, LIBRARIAN, MANAGER, ASSISTANT
    private String librarianEmployeeId;
    
    // Library information
    private UUID libraryId;
    private String libraryName;
    private UUID campusId;
    private String campusName;
    private String bookLocation;
    
    // Event metadata
    private LocalDateTime eventTime;
    private String eventType = "BOOK_RETURNED";
    
    // Return information
    private Boolean wasOverdue;
    private Integer overdueDays;
    private Double fineAmount;
    private Boolean finePaid;
    private String returnCondition; // GOOD, DAMAGED, LOST
    private String returnNotes;
    
    // Book copy status after return
    private String bookCopyStatus; // AVAILABLE, MAINTENANCE, LOST
} 