package com.university.library.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book_copies")
public class BookCopy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "copy_id")
    private Long copyId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id")
    private Library library;
    
    @Column(name = "qr_code", unique = true, length = 255)
    private String qrCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private BookStatus status;
    
    @Column(name = "shelf_location", length = 100)
    private String shelfLocation;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Relationships
    @OneToMany(mappedBy = "bookCopy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Borrowing> borrowings = new ArrayList<>();
    
    // Enum for Book Status
    public enum BookStatus {
        AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED
    }
    
    // Constructors
    public BookCopy() {
        this.createdAt = LocalDateTime.now();
        this.status = BookStatus.AVAILABLE;
    }
    
    public BookCopy(Book book, Library library, String qrCode, String shelfLocation) {
        this();
        this.book = book;
        this.library = library;
        this.qrCode = qrCode;
        this.shelfLocation = shelfLocation;
    }
    
    // Getters and Setters
    public Long getCopyId() {
        return copyId;
    }
    
    public void setCopyId(Long copyId) {
        this.copyId = copyId;
    }
    
    public Book getBook() {
        return book;
    }
    
    public void setBook(Book book) {
        this.book = book;
    }
    
    public Library getLibrary() {
        return library;
    }
    
    public void setLibrary(Library library) {
        this.library = library;
    }
    
    public String getQrCode() {
        return qrCode;
    }
    
    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
    
    public BookStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookStatus status) {
        this.status = status;
    }
    
    public String getShelfLocation() {
        return shelfLocation;
    }
    
    public void setShelfLocation(String shelfLocation) {
        this.shelfLocation = shelfLocation;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<Borrowing> getBorrowings() {
        return borrowings;
    }
    
    public void setBorrowings(List<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }
    
    @Override
    public String toString() {
        return "BookCopy{" +
                "copyId=" + copyId +
                ", book=" + (book != null ? book.getTitle() : "null") +
                ", library=" + (library != null ? library.getName() : "null") +
                ", qrCode='" + qrCode + '\'' +
                ", status=" + status +
                ", shelfLocation='" + shelfLocation + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 