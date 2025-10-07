package com.university.library.service;

import com.university.library.dto.response.loyalty.LoyaltyHistoryResponse;
import com.university.library.entity.LoyaltyHistory;


import java.util.UUID;

public interface LoyaltyService {
    LoyaltyHistoryResponse updateLoyaltyPoint(UUID bookCopyId, LoyaltyHistory.LoyaltyAction action, UUID userId);
     void deleteOldLoyaltyHistories();
}
