package com.university.library.dto.request.loyalty;


import com.university.library.entity.LoyaltyHistory;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyRequest {
    private  UUID bookId;
    private UUID bookCopyId;
    @NotNull(message = "Loyalty action must not be null")
    private LoyaltyHistory.LoyaltyAction loyaltyAction;

    @NotNull(message = "User ID must not be null")
    private  UUID userId;
}
