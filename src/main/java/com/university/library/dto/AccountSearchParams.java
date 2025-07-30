package com.university.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountSearchParams {
    private String search;
    private String department;
    private String position;
    private String role;
    private Boolean isActive;
    private UUID campusId;
    private int page;
    private int size;
    private String sortBy;
    private String sortDirection;
}
