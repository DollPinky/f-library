package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "borrowings")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Borrowing extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "borrowing_id")
    private UUID borrowingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_copy_id", nullable = false)
    private BookCopy bookCopy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Account borrower;

    @Column(name = "borrowed_date", nullable = false)
    private Instant borrowedDate;

    @Column(name = "due_date", nullable = false)
    private Instant dueDate;

    @Column(name = "returned_date")
    private Instant returnedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private BorrowingStatus status = BorrowingStatus.BORROWED;

    @Column(name = "fine_amount")
    private Double fineAmount = 0.0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum BorrowingStatus {
        RESERVED,    // Đã đặt sách
        BORROWED,    // Đang mượn
        RETURNED,    // Đã trả
        OVERDUE,     // Quá hạn
        LOST,        // Mất sách
        CANCELLED    // Hủy đặt/mượn
    }

    /**
     * Kiểm tra xem có quá hạn không
     */
    public boolean isOverdue() {
        return Instant.now().isAfter(dueDate) && status == BorrowingStatus.BORROWED;
    }

    /**
     * Tính số ngày quá hạn
     */
    public long getOverdueDays() {
        if (!isOverdue()) return 0;
        return (Instant.now().getEpochSecond() - dueDate.getEpochSecond()) / (24 * 60 * 60);
    }

    /**
     * Tính phí phạt (ví dụ: 10,000 VND/ngày)
     */
    public double calculateFine() {
        if (!isOverdue()) return 0.0;
        return getOverdueDays() * 10000.0; // 10,000 VND per day
    }
} 

