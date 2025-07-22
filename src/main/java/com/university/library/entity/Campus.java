package com.university.library.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "campuses")
public class Campus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "campus_id")
    private UUID campusId;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "campus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Library> libraries = new ArrayList<>();
    
    @OneToMany(mappedBy = "campus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reader> readers = new ArrayList<>();
    
    public Campus() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Campus(String name, String code, String address) {
        this();
        this.name = name;
        this.code = code;
        this.address = address;
    }
    
    public UUID getCampusId() {
        return campusId;
    }
    
    public void setCampusId(UUID campusId) {
        this.campusId = campusId;
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
    
    public List<Library> getLibraries() {
        return libraries;
    }
    
    public void setLibraries(List<Library> libraries) {
        this.libraries = libraries;
    }
    
    public List<Reader> getReaders() {
        return readers;
    }
    
    public void setReaders(List<Reader> readers) {
        this.readers = readers;
    }
    
    @Override
    public String toString() {
        return "Campus{" +
                "campusId=" + campusId +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", address='" + address + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 