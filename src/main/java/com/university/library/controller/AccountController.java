package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Slf4j
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<StandardResponse<AccountResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AccountResponse account = accountService.register(request);
            return ResponseEntity.ok(StandardResponse.success("Đăng ký thành công", account));
        } catch (Exception e) {
            log.error("Error registering account: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error("Không thể đăng ký: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponse<AccountResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AccountResponse account = accountService.login(request);
            return ResponseEntity.ok(StandardResponse.success("Đăng nhập thành công", account));
        } catch (Exception e) {
            log.error("Error logging in: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("Không thể đăng nhập: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<StandardResponse<AccountResponse>> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(StandardResponse.error("Chưa đăng nhập"));
            }
            AccountResponse account = accountService.getCurrentAccount();
            return ResponseEntity.ok(StandardResponse.success("Lấy thông tin user thành công", account));
        } catch (Exception e) {
            log.error("Error getting current user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể lấy thông tin user: " + e.getMessage()));
        }
    }
} 