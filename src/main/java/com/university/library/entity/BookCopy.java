package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "book_copies")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BookCopy extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "book_copy_id")
    private UUID bookCopyId;

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
    private BookStatus status = BookStatus.AVAILABLE;
    
    @Column(name = "shelf_location", length = 100)
    private String shelfLocation;
    
    @OneToMany(mappedBy = "bookCopy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Borrowing> borrowings = new ArrayList<>();
    
    public enum BookStatus {
        AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED
    }

} 