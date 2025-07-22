package com.university.library.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrowings")
public class Borrowing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "borrow_id")
    private Long borrowId;
    
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
    
    // Enum for Borrowing Status
    public enum BorrowingStatus {
        BORROWED, RETURNED, OVERDUE
    }
    
    // Constructors
    public Borrowing() {
        this.borrowedAt = LocalDateTime.now();
        this.status = BorrowingStatus.BORROWED;
        this.fineAmount = BigDecimal.ZERO;
    }
    
    public Borrowing(BookCopy bookCopy, Reader reader, LocalDate dueDate) {
        this();
        this.bookCopy = bookCopy;
        this.reader = reader;
        this.dueDate = dueDate;
    }
    
    // Getters and Setters
    public Long getBorrowId() {
        return borrowId;
    }
    
    public void setBorrowId(Long borrowId) {
        this.borrowId = borrowId;
    }
    
    public BookCopy getBookCopy() {
        return bookCopy;
    }
    
    public void setBookCopy(BookCopy bookCopy) {
        this.bookCopy = bookCopy;
    }
    
    public Reader getReader() {
        return reader;
    }
    
    public void setReader(Reader reader) {
        this.reader = reader;
    }
    
    public LocalDateTime getBorrowedAt() {
        return borrowedAt;
    }
    
    public void setBorrowedAt(LocalDateTime borrowedAt) {
        this.borrowedAt = borrowedAt;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public LocalDate getReturnedAt() {
        return returnedAt;
    }
    
    public void setReturnedAt(LocalDate returnedAt) {
        this.returnedAt = returnedAt;
    }
    
    public BorrowingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BorrowingStatus status) {
        this.status = status;
    }
    
    public BigDecimal getFineAmount() {
        return fineAmount;
    }
    
    public void setFineAmount(BigDecimal fineAmount) {
        this.fineAmount = fineAmount;
    }
    
    public String getNote() {
        return note;
    }
    
    public void setNote(String note) {
        this.note = note;
    }
    
    @Override
    public String toString() {
        return "Borrowing{" +
                "borrowId=" + borrowId +
                ", bookCopy=" + (bookCopy != null ? bookCopy.getQrCode() : "null") +
                ", reader=" + (reader != null ? reader.getName() : "null") +
                ", borrowedAt=" + borrowedAt +
                ", dueDate=" + dueDate +
                ", returnedAt=" + returnedAt +
                ", status=" + status +
                ", fineAmount=" + fineAmount +
                ", note='" + note + '\'' +
                '}';
    }
} 