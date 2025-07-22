package com.university.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn; // seconds
    
    private UserInfo user;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String phone;
        private String role;
        private boolean isActive;
        private String studentId;
        private String faculty;
        private String major;
        private Integer year;
        private Long campusId;
        private Long libraryId;
    }
} 