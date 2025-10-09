package com.university.library.service;

import com.university.library.dto.response.loyalty.LoyaltyHistoryResponse;
import com.university.library.dto.response.loyalty.LoyaltyTopResponse;
import com.university.library.entity.LoyaltyHistory;


import java.util.List;
import java.util.UUID;

public interface LoyaltyService {
    LoyaltyHistoryResponse updateLoyaltyPoint(UUID bookCopyId, LoyaltyHistory.LoyaltyAction action, UUID userId);
     void deleteOldLoyaltyHistories();

    List<LoyaltyTopResponse> getTop5LoyaltyUsersByMonth(int month, int year);
}
