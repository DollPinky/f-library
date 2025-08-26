package com.university.library.controller;

import com.university.library.dto.*;
import com.university.library.base.StandardResponse;
import com.university.library.entity.Account;
import com.university.library.service.command.BorrowingCommandService;
import com.university.library.service.query.BorrowingQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/borrowings")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingCommandService borrowingCommandService;
    private final BorrowingQueryService borrowingQueryService;

    /**
     * Tạo yêu cầu mượn sách hoặc đặt sách
     */
    @PostMapping("/borrow")
    public ResponseEntity<StandardResponse<BorrowingResponse>> scanAndBorrow(
            @RequestBody ScanAndBorrowCommand command,
            @AuthenticationPrincipal Account userPrincipal) {

        try {
            log.info("Scan and borrow for QR code: {}", command.getQrCode());

            // Lấy ID người dùng từ authentication
            UUID borrowerId = userPrincipal.getAccountId();

            BorrowingResponse borrowing = borrowingCommandService.Borrow(
                    command.getQrCode(),
                    borrowerId
            );

            return ResponseEntity.ok(StandardResponse.success(
                    borrowing
            ));
        } catch (Exception e) {
            log.error("Error in scan and borrow: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(StandardResponse.error("Không thể xử lý yêu cầu: " + e.getMessage()));
        }
    }

    /**
     * Trả sách
     */
    @PutMapping("/return")
    public ResponseEntity<StandardResponse<BorrowingResponse>> returnBook(
            @RequestBody ReturnBookCommand command) {
        try {
            log.info("Returning book for QR code: {}", command.getQrCode());

            BorrowingResponse borrowing = borrowingCommandService.returnBook(command.getQrCode());

            String message = borrowing.getFineAmount() > 0 ?
                    "Trả sách thành công. Phí phạt: " + borrowing.getFineAmount() + " VND" :
                    "Trả sách thành công";

            return ResponseEntity.ok(StandardResponse.success(message, borrowing));
        } catch (Exception e) {
            log.error("Error returning book: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(StandardResponse.error("Không thể trả sách: " + e.getMessage()));
        }
    }


    /**
     * Báo mất sách
     */
    @PutMapping("/lost")
    public ResponseEntity<StandardResponse<BorrowingResponse>> reportLost(
            @RequestBody ReportLostCommand command) {
        try {
            log.info("Reporting lost book for QR code: {}", command.getQrCode());

            BorrowingResponse borrowing = borrowingCommandService.reportLost(command.getQrCode());

            return ResponseEntity.ok(StandardResponse.success(
                    "Đã báo mất sách. Phí phạt: " + borrowing.getFineAmount() + " VND", borrowing));
        } catch (Exception e) {
            log.error("Error reporting lost book: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(StandardResponse.error("Không thể báo mất sách: " + e.getMessage()));
        }
    }

    /**
     * Lấy tất cả borrowings với pagination
     */
    @GetMapping
    public ResponseEntity<StandardResponse<List<BorrowingResponse>>> getAllBorrowings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query) {
        try {
            log.info("Getting borrowings - page: {}, size: {}, status: {}, query: {}", page, size, status, query);
            
            var response = borrowingQueryService.getAllBorrowings(page, size, status, query);
            
            log.info("Found {} borrowings (page {} of {})", 
                response.getContent().size(), page + 1, response.getTotalPages());
            
            return ResponseEntity.ok(StandardResponse.success("Lấy danh sách mượn sách thành công", response.getContent()));
        } catch (Exception e) {
            log.error("Error getting borrowings: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể lấy danh sách mượn sách: " + e.getMessage()));
        }
    }

    /**
     * Lấy borrowings của một người dùng
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<StandardResponse<List<BorrowingResponse>>> getBorrowingsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Getting borrowings for user: {} with pagination: page={}, size={}", userId, page, size);
            
            var response = borrowingQueryService.getBorrowingsByUser(userId, page, size);
            
            return ResponseEntity.ok(StandardResponse.success("Lấy danh sách mượn sách của người dùng thành công", response.getContent()));
        } catch (Exception e) {
            log.error("Error getting borrowings by user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể lấy danh sách mượn sách của người dùng: " + e.getMessage()));
        }
    }

    /**
     * Lấy borrowings quá hạn
     */
    @GetMapping("/overdue")
    public ResponseEntity<StandardResponse<List<BorrowingResponse>>> getOverdueBorrowings() {
        try {
            log.info("Getting overdue borrowings");
            
            List<BorrowingResponse> borrowings = borrowingQueryService.getOverdueBorrowings();
            
            return ResponseEntity.ok(StandardResponse.success("Lấy danh sách sách quá hạn thành công", borrowings));
        } catch (Exception e) {
            log.error("Error getting overdue borrowings: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể lấy danh sách sách quá hạn: " + e.getMessage()));
        }
    }

    /**
     * Lấy borrowing theo ID
     */
    @GetMapping("/{borrowingId}")
    public ResponseEntity<StandardResponse<BorrowingResponse>> getBorrowingById(@PathVariable UUID borrowingId) {
        try {
            log.info("Getting borrowing by ID: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingQueryService.getBorrowingById(borrowingId);
            
            return ResponseEntity.ok(StandardResponse.success("Lấy thông tin mượn sách thành công", borrowing));
        } catch (Exception e) {
            log.error("Error getting borrowing by ID: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể lấy thông tin mượn sách: " + e.getMessage()));
        }
    }

} 