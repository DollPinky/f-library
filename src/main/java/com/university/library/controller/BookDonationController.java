package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;

import com.university.library.dto.response.bookDonation.BookDonationResponse;

import com.university.library.service.BookDonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookDonationController {
  private final BookDonationService bookDonationService;

    @GetMapping("/book-donation-history/{accountId}")
    public ResponseEntity<StandardResponse<?>> getBookDonationHistories(
            @PathVariable UUID accountId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size){
        try{
            PagedResponse<BookDonationResponse> bookDonationResponses = bookDonationService.getHistoriesDonation(accountId,page, size);
            return ResponseEntity.ok(StandardResponse.success("Get user's donation histories successfully",bookDonationResponses));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body(StandardResponse.error("Get user's donation histories error" + e.getMessage()));
        }

    }
}
