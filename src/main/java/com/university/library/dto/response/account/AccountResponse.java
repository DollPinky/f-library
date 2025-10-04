package com.university.library.dto.response.account;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.university.library.entity.User;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountResponse {
    private UUID accountId;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String position;
    private String companyAccount;
    private User.AccountRole role;
    private CampusResponse campus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String accessToken;
    private String refreshToken;

    public static AccountResponse fromEntity(User account) {
        if (account == null) {
            return null;
        }

        return AccountResponse.builder()
                .accountId(account.getUserId())
                .fullName(account.getFullName())
                .email(account.getEmail())
                .phone(account.getPhone())
                .department(account.getDepartment())
                .position(account.getPosition())
                .companyAccount(account.getCompanyAccount())
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