package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.request.loyalty.LoyaltyRequest;
import com.university.library.dto.response.loyalty.LoyaltyHistoryResponse;

import com.university.library.dto.response.loyalty.LoyaltyTopResponse;
import com.university.library.service.LoyaltyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Loyalty Controller", description = "APIs for managing loyalty with actions in the library system")
public class LoyaltyController {
   private final LoyaltyService loyaltyService;

    @PostMapping("/loyalty-point/update")
    public ResponseEntity<StandardResponse<LoyaltyHistoryResponse>> addLoyaltyPoint(@Valid @RequestBody LoyaltyRequest request) {
        LoyaltyHistoryResponse user=loyaltyService.updateLoyaltyPoint(request.getBookCopyId(),request.getLoyaltyAction(),request.getUserId());

        return  ResponseEntity.ok(StandardResponse.success("Update point for user successfully",user));
    }

    @GetMapping("/top-5-loyalty-users-by-month")
    public ResponseEntity<StandardResponse<List<LoyaltyTopResponse>>> getTop5LoyaltyUsersByMonth(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        int selectedMonth = month != null ? month : LocalDate.now().getMonthValue();
        int selectedYear = year != null ? year : LocalDate.now().getYear();

        List<LoyaltyTopResponse> top5users = loyaltyService.getTop5LoyaltyUsersByMonth(selectedMonth, selectedYear);

        return ResponseEntity.ok(StandardResponse.success("Get top 5 users highest points by months successfully", top5users));
    }

}
