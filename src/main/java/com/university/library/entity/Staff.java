package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "staffs")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Staff extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "staff_id")
    private UUID staffId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id", nullable = false)
    private Library library;
    
    @Column(name = "employee_id", nullable = false, unique = true, length = 20)
    private String employeeId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "staff_role", nullable = false, length = 50)
    private StaffRole staffRole;
    
    @Column(name = "department", length = 100)
    private String department;
    
    @Column(name = "position", length = 100)
    private String position;
    
    @Column(name = "hire_date")
    private Instant hireDate;
    
    @Column(name = "work_schedule", length = 255)
    private String workSchedule;
    
    @Column(name = "specialization", length = 255)
    private String specialization;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "last_activity_at")
    private Instant lastActivityAt;
    
    @Column(name = "can_manage_books")
    private Boolean canManageBooks;
    
    @Column(name = "can_manage_users")
    private Boolean canManageUsers;
    
    @Column(name = "can_manage_staff")
    private Boolean canManageStaff;
    
    @Column(name = "can_view_reports")
    private Boolean canViewReports;
    
    @Column(name = "can_process_borrowings")
    private Boolean canProcessBorrowings;
    
    public enum StaffRole {
        ADMIN,          // Quản trị viên hệ thống (toàn quyền)
        LIBRARIAN,      // Thủ thư (quản lý sách, mượn trả)
        MANAGER,        // Quản lý thư viện (quản lý staff, reports)
        ASSISTANT       // Trợ lý thư viện (hỗ trợ cơ bản)
    }
    
    public boolean canManageBooks() {
        return isActive && (canManageBooks != null && canManageBooks);
    }
    
    public boolean canManageUsers() {
        return isActive && (canManageUsers != null && canManageUsers);
    }
    
    public boolean canManageStaff() {
        return isActive && (canManageStaff != null && canManageStaff);
    }
    
    public boolean canViewReports() {
        return isActive && (canViewReports != null && canViewReports);
    }
    
    public boolean canProcessBorrowings() {
        return isActive && (canProcessBorrowings != null && canProcessBorrowings);
    }
    
    public void updateLastActivity() {
        this.lastActivityAt = Instant.now();
    }
    
    public boolean isAdmin() {
        return staffRole == StaffRole.ADMIN;
    }
    
    public boolean isLibrarian() {
        return staffRole == StaffRole.LIBRARIAN;
    }
    
    public boolean isManager() {
        return staffRole == StaffRole.MANAGER;
    }
    
    public boolean isAssistant() {
        return staffRole == StaffRole.ASSISTANT;
    }
} 

