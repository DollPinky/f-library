package com.university.library.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "libraries")
public class Library {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "library_id")
    private UUID libraryId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id", nullable = false)
    private Campus campus;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Staff> staff = new ArrayList<>();
    
    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookCopy> bookCopies = new ArrayList<>();
    
    public Library() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Library(Campus campus, String name, String code, String address) {
        this();
        this.campus = campus;
        this.name = name;
        this.code = code;
        this.address = address;
    }
    
    public UUID getLibraryId() {
        return libraryId;
    }
    
    public void setLibraryId(UUID libraryId) {
        this.libraryId = libraryId;
    }
    
    public Campus getCampus() {
        return campus;
    }
    
    public void setCampus(Campus campus) {
        this.campus = campus;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<Staff> getStaff() {
        return staff;
    }
    
    public void setStaff(List<Staff> staff) {
        this.staff = staff;
    }
    
    public List<BookCopy> getBookCopies() {
        return bookCopies;
    }
    
    public void setBookCopies(List<BookCopy> bookCopies) {
        this.bookCopies = bookCopies;
    }
    
    @Override
    public String toString() {
        return "Library{" +
                "libraryId=" + libraryId +
                ", campus=" + (campus != null ? campus.getName() : "null") +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", address='" + address + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 