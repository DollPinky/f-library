package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.*;
import com.university.library.entity.User;
import com.university.library.repository.RefreshTokenRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.AuthenticationService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.transaction.Transactional;
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


    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/register")
    public ResponseEntity<StandardResponse<AccountResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AccountResponse user = authenticationService.register(request);
            return ResponseEntity.ok(StandardResponse.success("Đăng ký thành công",user));
        } catch (Exception e) {
            log.error("Error registering account: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error("Không thể đăng ký: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponse<UserResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserResponse account = authenticationService.login(loginRequest);
            // Ensure session is created and user is properly authenticated
            return ResponseEntity.ok(StandardResponse.success("Đăng nhập thành công", account));
        } catch (Exception e) {
            log.error("Error logging in: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("Không thể đăng nhập: " + e.getMessage()));
        }
    }


    @PostMapping("/logout")
    @SecurityRequirement(name = "api")
    @Transactional
    public ResponseEntity<StandardResponse<Void>> logout() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();

            user.incrementTokenVersion();
            userRepository.save(user);

            refreshTokenRepository.deleteByUser(user);

            return ResponseEntity.ok(StandardResponse.success("Đăng xuất thành công", null));
        } catch (Exception e) {
            log.error("Error logging out: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể đăng xuất: " + e.getMessage()));
        }
    }




}
 