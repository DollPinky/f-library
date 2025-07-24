package com.university.library.dto;

import com.university.library.entity.Account;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private UUID accountId;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String position;
    private String employeeCode;
    private Account.AccountRole role;
    private CampusResponse campus;
    private Instant createdAt;
    private Instant updatedAt;

    public static AccountResponse fromEntity(Account account) {
        if (account == null) {
            return null;
        }

        return AccountResponse.builder()
                .accountId(account.getAccountId())
                .fullName(account.getFullName())
                .email(account.getEmail())
                .phone(account.getPhone())
                .department(account.getDepartment())
                .position(account.getPosition())
                .employeeCode(account.getEmployeeCode())
                .role(account.getRole())
                .campus(CampusResponse.fromEntity(account.getCampus()))
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CampusResponse {
        private UUID campusId;
        private String name;
        private String code;
        private String address;

        public static CampusResponse fromEntity(com.university.library.entity.Campus campus) {
            if (campus == null) {
                return null;
            }

            return CampusResponse.builder()
                    .campusId(campus.getCampusId())
                    .name(campus.getName())
                    .code(campus.getCode())
                    .address(campus.getAddress())
                    .build();
        }
    }
} 