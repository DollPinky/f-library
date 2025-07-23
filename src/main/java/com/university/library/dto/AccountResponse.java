package com.university.library.dto;

import com.university.library.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private UUID accountId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Account.UserType userType;
    private Account.AccountStatus status;
    private LocalDateTime lastLoginAt;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private UUID campusId;
    private UUID libraryId;
    private String studentId;
    private String faculty;
    private String major;
    private Integer academicYear;
    private Integer maxBorrowLimit;
    private Integer currentBorrowCount;
    private Integer totalBorrowCount;
    private Integer overdueCount;
    private Double fineAmount;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
