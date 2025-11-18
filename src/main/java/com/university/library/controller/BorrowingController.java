package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.dto.request.borrowing.BorrowRequest;
import com.university.library.dto.response.borrowing.BorrowingHistoryResponse;
import com.university.library.dto.response.borrowing.BorrowingResponse;
import com.university.library.dto.response.borrowing.BorrowingStateResponse;
import com.university.library.entity.User;
import com.university.library.entity.Borrowing;
import com.university.library.repository.BorrowingRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.BorrowingService;

import io.swagger.v3.oas.annotations.Operation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/borrowings")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;
    private final BorrowingRepository borrowingRepository;

    @GetMapping("/check-borrowed")
    public ResponseEntity<StandardResponse<Boolean>> checkIfUserBorrowedBookCopy(
            @RequestParam UUID bookCopyId,
            @RequestParam String companyAccount) {
        try {
            log.info("Checking if user has borrowed book copy: {}", bookCopyId);


//            UUID userId = userPrincipal.getUserId();

            // Check if the user has an active borrowing for the specified book copy
            boolean hasBorrowed = borrowingRepository.existsByCompanyAccountAndBookCopyBookCopyIdAndStatus(
                    companyAccount,
                    bookCopyId,
                    Borrowing.BorrowingStatus.BORROWED
            );

            String message = hasBorrowed ?
                    "Người dùng đã mượn sách này" :
                    "Người dùng chưa mượn sách này";

            return ResponseEntity.ok(StandardResponse.success(message, hasBorrowed));
        } catch (Exception e) {
            log.error("Error checking borrowing status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(StandardResponse.error("Không thể kiểm tra trạng thái mượn sách: " + e.getMessage()));
        }
    }

    /**
     * Create borrowing
     */
    @PostMapping("/borrow")
    public ResponseEntity<StandardResponse<BorrowingResponse>> scanAndBorrow(
            @RequestBody BorrowRequest borrowRequest) {

        try {

            // Lấy ID người dùng từ authentication
//            UUID borrowerId = userPrincipal.getUserId();
//           log.info("User mượn sách: {}", userPrincipal.getEmail());
            BorrowingResponse borrowing = borrowingService.borrowBook(
                    borrowRequest.getBookCopyId(),
                    borrowRequest.getCompanyAccount()
            );

            return ResponseEntity.ok(StandardResponse.success(
                    borrowing
            ));
        } catch (Exception e) {
            log.error("Error in scan and borrow: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(StandardResponse.error("Cannot execute: " + e.getMessage()));
        }
    }


    /**
     * Trả sách
     */
    @PutMapping("/return")
    public ResponseEntity<StandardResponse<BorrowingResponse>> returnBook(
            @RequestBody BorrowRequest borrowRequest) {
        try {

            BorrowingResponse borrowing = borrowingService.returnBook(borrowRequest.getBookCopyId(), borrowRequest.getCompanyAccount());

            String message;
            if (borrowing.getStatus() == Borrowing.BorrowingStatus.OVERDUE) {
                message = "Trả sách thành công (QUÁ HẠN). Phí phạt: " + borrowing.getFineAmount() + " VND";
            } else {
                message = borrowing.getFineAmount() > 0 ?
                        "Trả sách thành công. Phí phạt: " + borrowing.getFineAmount() + " VND" :
                        "Trả sách thành công";
            }

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
            @RequestBody BorrowRequest borrowRequest) {
        try {

            BorrowingResponse borrowing = borrowingService.reportLost(borrowRequest.getBookCopyId());

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

            var response = borrowingService.getAllBorrowings(page, size, status, query);

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
            @PathVariable String companyAccount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Getting borrowings for user: {} with pagination: page={}, size={}", companyAccount, page, size);

            var response = borrowingService.getBorrowingsByUser(companyAccount, page, size);

            return ResponseEntity.ok(StandardResponse.success("Get list of borrowing successfully", response.getContent()));
        } catch (Exception e) {
            log.error("Error getting borrowings by user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Cannot get list of borrowing: " + e.getMessage()));
        }
    }

    /**
     * Lấy borrowings quá hạn
     */
    @GetMapping("/overdue")
    @Operation(summary = "Get borrowing quá hạn")
    public ResponseEntity<StandardResponse<List<BorrowingResponse>>> getOverdueBorrowings() {
        try {
            log.info("Getting overdue borrowings");

            List<BorrowingResponse> borrowings = borrowingService.getOverdueBorrowings();

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

            BorrowingResponse borrowing = borrowingService.getBorrowingById(borrowingId);

            return ResponseEntity.ok(StandardResponse.success("Lấy thông tin mượn sách thành công", borrowing));
        } catch (Exception e) {
            log.error("Error getting borrowing by ID: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể lấy thông tin mượn sách: " + e.getMessage()));
        }
    }

    /**
     * Lấy danh sách book được mượn nhều nhất
     */
    @GetMapping("/most-borrowed")
    public ResponseEntity<StandardResponse<List<BorrowingStateResponse>>> getMostBorrowedBooks(
            @RequestParam(defaultValue = "10") int limit) {
        List<BorrowingStateResponse> stats = borrowingService.getMostBorrowStats(limit);
        return ResponseEntity.ok(StandardResponse.success(stats));
    }

    /**
     * Lấy danh sách lịch sử bookCopy
     */
    @GetMapping("/{bookCopyId}/history")
    public ResponseEntity<StandardResponse<PagedResponse<BorrowingHistoryResponse>>> getBookCopyHistory(
            @PathVariable UUID bookCopyId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<BorrowingHistoryResponse> borrowingHistoryResponses = borrowingService.findBorrowingByBookCopy_BookCopyId(page, size,bookCopyId);
        return ResponseEntity.ok(StandardResponse.success(borrowingHistoryResponses));
    }



}