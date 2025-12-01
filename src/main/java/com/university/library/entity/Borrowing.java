package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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

    @Column(name = "company_account")
    private String companyAccount;

    @Column(name = "borrowed_date", nullable = false)
    private LocalDateTime borrowedDate;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "returned_date")
    private LocalDateTime returnedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private BorrowingStatus status = BorrowingStatus.BORROWED;

    @Column(name = "fine_amount")
    private Double fineAmount = 0.0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum BorrowingStatus {
        BORROWED,           // Đang mượn
        RETURNED,           // Đã trả
        OVERDUE,            // Quá hạn
        LOST,               // Mất sách
    }

    /**
     * Kiểm tra xem có quá hạn không
     */
    public boolean isOverdue() {
        if (status == BorrowingStatus.RETURNED || status == BorrowingStatus.OVERDUE) {
            // Đã trả rồi thì kiểm tra ngày trả
            return returnedDate != null && returnedDate.isAfter(dueDate);
        } else if (status == BorrowingStatus.BORROWED) {
            // Đang mượn thì kiểm tra hiện tại
            return LocalDateTime.now().isAfter(dueDate);
        }
        return false;
    }

    /**
     * Tính số ngày quá hạn
     */
    public long getOverdueDays() {
        if (!isOverdue()) {
            return 0;
        }

        LocalDateTime compareDate;
        if (returnedDate != null) {
            // Đã trả: tính từ ngày trả
            compareDate = returnedDate;
        } else {
            // Chưa trả: tính đến hiện tại
            compareDate = LocalDateTime.now();
        }

        return ChronoUnit.DAYS.between(dueDate, compareDate);
    }

    /**
     * Tính phí phạt (ví dụ: 10,000 VND/ngày)
     */
    public double calculateFine() {
        long overdueDays = getOverdueDays();
        if (overdueDays <= 0) {
            return 0.0;
        }

        final double DAILY_FINE = 10000.0; // 10,000 VND per day
        final long MAX_FINE_DAYS = 30; // Tối đa tính phí 30 ngày

        long chargingDays = Math.min(overdueDays, MAX_FINE_DAYS);
        return chargingDays * DAILY_FINE;
    }

} 

