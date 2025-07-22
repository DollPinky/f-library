package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "staffs")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Staff extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "staff_id")
    private UUID staffId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id", nullable = false)
    private Library library;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private StaffRole role;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    public enum StaffRole {
        ADMIN, LIBRARIAN, MANAGER
    }
} 