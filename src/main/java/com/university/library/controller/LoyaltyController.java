package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.request.loyalty.LoyaltyRequest;
import com.university.library.dto.response.loyalty.LoyaltyHistoryResponse;

import com.university.library.service.LoyaltyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



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


}
