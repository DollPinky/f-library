package com.university.library.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "borrowings")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Borrowing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "borrow_id")
    private UUID borrowId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "copy_id")
    private BookCopy bookCopy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reader_id")
    private Reader reader;
    
    @Column(name = "borrowed_at", nullable = false)
    private LocalDateTime borrowedAt;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Column(name = "returned_at")
    private LocalDate returnedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private BorrowingStatus status;
    
    @Column(name = "fine_amount", precision = 10, scale = 2)
    private BigDecimal fineAmount;
    
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
    
    public enum BorrowingStatus {
        BORROWED, RETURNED, OVERDUE
    }
} 