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
    private String email;
    private String fullName;
    private String phone;
    private Account.AccountStatus status;
    private LocalDateTime createAt;
    private String studentId;
    private String faculty;
    private String major;
    private Integer year;
    private UUID campusId;
}
