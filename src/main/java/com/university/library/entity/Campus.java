package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "campuses")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Campus extends BaseEntity {
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
    
    @OneToMany(mappedBy = "campus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Library> libraries = new ArrayList<>();
    
    @OneToMany(mappedBy = "campus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reader> readers = new ArrayList<>();

} 