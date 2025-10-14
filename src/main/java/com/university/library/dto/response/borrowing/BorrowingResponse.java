package com.university.library.dto.response.borrowing;

import com.university.library.dto.response.account.AccountResponse;
import com.university.library.dto.response.bookCopy.BookCopyResponse;
import com.university.library.entity.Borrowing;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingResponse {
    private UUID borrowingId;
    private BookCopyResponse bookCopy;
    private AccountResponse borrower;
    private LocalDateTime borrowedDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnedDate;
    private Borrowing.BorrowingStatus status;
    private Double fineAmount;
    private String notes;
    private boolean isOverdue;
    private long overdueDays;
    private double calculatedFine;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BorrowingResponse fromEntity(Borrowing borrowing) {
        if (borrowing == null) {
            return null;
        }

        return BorrowingResponse.builder()
            .borrowingId(borrowing.getBorrowingId())
            .bookCopy(BookCopyResponse.fromEntity(borrowing.getBookCopy()))
            .borrower(AccountResponse.fromEntity(borrowing.getBorrower()))
            .borrowedDate(borrowing.getBorrowedDate())
            .dueDate(borrowing.getDueDate())
            .returnedDate(borrowing.getReturnedDate())
            .status(borrowing.getStatus())
            .fineAmount(borrowing.getFineAmount())
            .notes(borrowing.getNotes())
            .isOverdue(borrowing.isOverdue())
            .overdueDays(borrowing.getOverdueDays())
            .calculatedFine(borrowing.calculateFine())
            .createdAt(borrowing.getCreatedAt())
            .updatedAt(borrowing.getUpdatedAt())
            .build();
    }
}