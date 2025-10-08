package com.university.library.scheduler;

import com.university.library.service.LoyaltyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Slf4j
@Component
public class LoyaltyHistoryLogScheduler {
    @Autowired
    private LoyaltyService loyaltyService;


    @Scheduled(cron = "0 0 0 * * *")
    public void cleanOldLogs() {
        loyaltyService.deleteOldLoyaltyHistories();
        log.info("Old loyalty history logs cleaned up.");
    }
}
