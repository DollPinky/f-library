package com.university.library.controller;

import com.university.library.dto.BorrowingResponse;
import com.university.library.dto.CreateBorrowingCommand;
import com.university.library.base.StandardResponse;
import com.university.library.dto.ScanAndBorrowCommand;
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
    @PostMapping("/scan-and-borrow")
    public ResponseEntity<StandardResponse<BorrowingResponse>> scanAndBorrow(
            @RequestBody ScanAndBorrowCommand command,
            @AuthenticationPrincipal Account userPrincipal) {

        try {
            log.info("Scan and borrow for QR code: {}", command.getQrCode());

            // Lấy ID người dùng từ authentication
            UUID borrowerId = userPrincipal.getAccountId();

            BorrowingResponse borrowing = borrowingCommandService.scanAndBorrow(
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

    @PostMapping
    public ResponseEntity<StandardResponse<BorrowingResponse>> createBorrowing(@RequestBody CreateBorrowingCommand command) {
        try {
            log.info("Creating borrowing for book copy: {} by user: {}", command.getBookCopyId(), command.getBorrowerId());
            
            BorrowingResponse borrowing = borrowingCommandService.createBorrowing(command);
            
            String message = command.isReservation() ? 
                "Đặt sách thành công" : "Mượn sách thành công";
            
            return ResponseEntity.ok(StandardResponse.success(message, borrowing));
        } catch (Exception e) {
            log.error("Error creating borrowing: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể tạo yêu cầu mượn sách: " + e.getMessage()));
        }
    }

    /**
     * Xác nhận mượn sách (chuyển từ RESERVED sang BORROWED)
     */
    @PutMapping("/{borrowingId}/confirm")
    public ResponseEntity<StandardResponse<BorrowingResponse>> confirmBorrowing(@PathVariable UUID borrowingId) {
        try {
            log.info("Confirming borrowing: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingCommandService.confirmBorrowing(borrowingId);
            
            return ResponseEntity.ok(StandardResponse.success("Xác nhận mượn sách thành công", borrowing));
        } catch (Exception e) {
            log.error("Error confirming borrowing: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể xác nhận mượn sách: " + e.getMessage()));
        }
    }

    /**
     * Trả sách
     */
    @PutMapping("/{borrowingId}/return")
    public ResponseEntity<StandardResponse<BorrowingResponse>> returnBook(@PathVariable UUID borrowingId) {
        try {
            log.info("Returning book for borrowing: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingCommandService.returnBook(borrowingId);
            
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
     * Hủy đặt sách
     */
    @DeleteMapping("/{borrowingId}/cancel")
    public ResponseEntity<StandardResponse<Void>> cancelReservation(@PathVariable UUID borrowingId) {
        try {
            log.info("Cancelling reservation: {}", borrowingId);
            
            borrowingCommandService.cancelReservation(borrowingId);
            
            return ResponseEntity.ok(StandardResponse.success("Hủy đặt sách thành công", null));
        } catch (Exception e) {
            log.error("Error cancelling reservation: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể hủy đặt sách: " + e.getMessage()));
        }
    }

    /**
     * Báo mất sách
     */
    @PutMapping("/{borrowingId}/lost")
    public ResponseEntity<StandardResponse<BorrowingResponse>> reportLost(@PathVariable UUID borrowingId) {
        try {
            log.info("Reporting lost book for borrowing: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingCommandService.reportLost(borrowingId);
            
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

    /**
     * Thủ thư xác nhận mượn sách
     */
    @PutMapping("/{borrowingId}/librarian-confirm")
    public ResponseEntity<StandardResponse<BorrowingResponse>> librarianConfirmBorrowing(@PathVariable UUID borrowingId) {
        try {
            log.info("Librarian confirming borrowing: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingCommandService.confirmBorrowing(borrowingId);
            
            return ResponseEntity.ok(StandardResponse.success("Xác nhận mượn sách thành công", borrowing));
        } catch (Exception e) {
            log.error("Error confirming borrowing: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể xác nhận mượn sách: " + e.getMessage()));
        }
    }

    /**
     * User yêu cầu trả sách
     */
    @PutMapping("/{borrowingId}/request-return")
    public ResponseEntity<StandardResponse<BorrowingResponse>> requestReturn(@PathVariable UUID borrowingId) {
        try {
            log.info("User requesting return for borrowing: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingCommandService.requestReturn(borrowingId);
            
            return ResponseEntity.ok(StandardResponse.success("Yêu cầu trả sách thành công", borrowing));
        } catch (Exception e) {
            log.error("Error requesting return: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể yêu cầu trả sách: " + e.getMessage()));
        }
    }

    /**
     * Thủ thư xác nhận trả sách
     */
    @PutMapping("/{borrowingId}/librarian-confirm-return")
    public ResponseEntity<StandardResponse<BorrowingResponse>> librarianConfirmReturn(@PathVariable UUID borrowingId) {
        try {
            log.info("Librarian confirming return for borrowing: {}", borrowingId);
            
            BorrowingResponse borrowing = borrowingCommandService.confirmReturn(borrowingId);
            
            String message = borrowing.getFineAmount() > 0 ? 
                "Xác nhận trả sách thành công. Phí phạt: " + borrowing.getFineAmount() + " VND" :
                "Xác nhận trả sách thành công";
            
            return ResponseEntity.ok(StandardResponse.success(message, borrowing));
        } catch (Exception e) {
            log.error("Error confirming return: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(StandardResponse.error("Không thể xác nhận trả sách: " + e.getMessage()));
        }
    }
} 