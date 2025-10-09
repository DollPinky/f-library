package com.university.library.dto.response.loyalty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTopResponse {
    private UUID userId;
    private String email;
    private String fullName;
    private int totalPoints;
    private int borrowCount;
    private int returnCount;
    private int donationCount;
}
