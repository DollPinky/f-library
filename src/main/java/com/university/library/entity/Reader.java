package com.university.library.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "readers")
public class Reader {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "reader_id")
    private UUID readerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id")
    private Campus campus;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "student_id", unique = true, length = 50)
    private String studentId;
    
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "registered_at")
    private LocalDateTime registeredAt;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @OneToMany(mappedBy = "reader", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Borrowing> borrowings = new ArrayList<>();
    
    public Reader() {
        this.registeredAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    public Reader(Campus campus, String name, String studentId, String email, String phone) {
        this();
        this.campus = campus;
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.phone = phone;
    }
    

    public UUID getReaderId() {
        return readerId;
    }
    
    public void setReaderId(UUID readerId) {
        this.readerId = readerId;
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
    
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }
    
    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public List<Borrowing> getBorrowings() {
        return borrowings;
    }
    
    public void setBorrowings(List<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }
    
    @Override
    public String toString() {
        return "Reader{" +
                "readerId=" + readerId +
                ", campus=" + (campus != null ? campus.getName() : "null") +
                ", name='" + name + '\'' +
                ", studentId='" + studentId + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", registeredAt=" + registeredAt +
                ", isActive=" + isActive +
                '}';
    }
} 