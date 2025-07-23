package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Account extends BaseEntity implements UserDetails, java.io.Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "account_id")
    private UUID accountId;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "user_type", nullable = false, length = 20)
    private UserType userType = UserType.READER;

    @Enumerated(EnumType.STRING)

    @Column(name = "status", nullable = false, length = 20)
    private AccountStatus status;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "phone_verified")
    private Boolean phoneVerified;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id")
    private Campus campus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id")
    private Library library;

    @Column(name = "student_id", length = 20)
    private String studentId;

    @Column(name = "faculty", length = 100)
    private String faculty;

    @Column(name = "major", length = 100)
    private String major;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "max_borrow_limit")
    private Integer maxBorrowLimit;

    @Column(name = "current_borrow_count")
    private Integer currentBorrowCount;

    @Column(name = "total_borrow_count")
    private Integer totalBorrowCount;

    @Column(name = "overdue_count")
    private Integer overdueCount;

    @Column(name = "fine_amount")
    private Double fineAmount;

    public enum UserType {
        STAFF,          // Nhân viên thư viện (có Staff entity riêng)
        READER          // Độc giả (sinh viên/giảng viên)
    }

    public enum AccountStatus {
        ACTIVE,         // Tài khoản hoạt động
        INACTIVE,       // Tài khoản không hoạt động
        SUSPENDED,      // Tài khoản bị đình chỉ
        PENDING,        // Tài khoản chờ xác thực
        BLOCKED         // Tài khoản bị khóa
    }

    public boolean canBorrow() {
        return userType == UserType.READER &&
               status == AccountStatus.ACTIVE &&
               currentBorrowCount < maxBorrowLimit &&
               fineAmount <= 0;
    }

    public void incrementBorrowCount() {
        if (userType == UserType.READER) {
            this.currentBorrowCount++;
            this.totalBorrowCount++;
        }
    }

    public void decrementBorrowCount() {
        if (userType == UserType.READER && this.currentBorrowCount > 0) {
            this.currentBorrowCount--;
        }
    }

    public void addFine(Double amount) {
        if (userType == UserType.READER) {
            this.fineAmount += amount;
        }
    }

    public void clearFine() {
        if (userType == UserType.READER) {
            this.fineAmount = 0.0;
        }
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public boolean isStaff() {
        return userType == UserType.STAFF;
    }

    public boolean isReader() {
        return userType == UserType.READER;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Đảm bảo luôn trả về đúng role khi deserialize từ session
        return List.of(new SimpleGrantedAuthority("ROLE_" + (userType != null ? userType.name() : "READER")));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public boolean isAccountNonExpired() {
        return status != AccountStatus.INACTIVE;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != AccountStatus.BLOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == AccountStatus.ACTIVE;
    }
}