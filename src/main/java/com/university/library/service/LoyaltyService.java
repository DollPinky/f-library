package com.university.library.service;

import com.university.library.dto.request.loyalty.LoyaltyRequest;
import com.university.library.dto.response.loyalty.LoyaltyHistoryResponse;
import com.university.library.dto.response.loyalty.LoyaltyTopResponse;
import com.university.library.entity.LoyaltyHistory;


import java.util.List;
import java.util.UUID;

public interface LoyaltyService {
    LoyaltyHistoryResponse updateLoyaltyPoint(LoyaltyRequest loyaltyRequest);
//     void deleteOldLoyaltyHistories();

    List<LoyaltyTopResponse> getTop5LoyaltyUsersByMonth(int month, int year);
}
