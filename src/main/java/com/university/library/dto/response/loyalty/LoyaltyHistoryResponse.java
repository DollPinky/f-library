package com.university.library.dto.response.loyalty;

import com.university.library.entity.LoyaltyHistory;
import com.university.library.entity.User;
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
public class LoyaltyHistoryResponse {
    private UUID loyaltyId;
    private int loyaltyPoint;
    private LoyaltyHistory.LoyaltyAction action;
    private String note;
    private UUID user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public static LoyaltyHistoryResponse fromEntity(LoyaltyHistory entity) {
        if (entity == null) {
            return null;
        }

        return LoyaltyHistoryResponse.builder()
                .loyaltyId(entity.getLoyaltyId())
                .loyaltyPoint(entity.getLoyaltyPoint())
                .action(entity.getAction())
                .note(entity.getNote())
                .user(entity.getUser().getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

}
