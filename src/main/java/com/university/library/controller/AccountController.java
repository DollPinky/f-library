package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.request.account.LoginRequest;
import com.university.library.dto.request.account.RegisterRequest;
import com.university.library.dto.request.refreshToken.RefreshTokenRequest;
import com.university.library.dto.response.account.AccountResponse;
import com.university.library.dto.response.refreshToken.RefreshTokenResponse;
import com.university.library.entity.User;
import com.university.library.repository.RefreshTokenRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.AuthenticationService;

import com.university.library.service.RefreshTokenService;

import com.university.library.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final RefreshTokenService refreshTokenService;

    private final UserService userService ;
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
    public ResponseEntity<StandardResponse<AccountResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            AccountResponse account = authenticationService.login(request);

            return ResponseEntity.ok(StandardResponse.success("Đăng nhập thành công", account));
        } catch (Exception e) {
            log.error("Error logging in: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("Không thể đăng nhập: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<StandardResponse<Void>> logout(HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();
            user.incrementTokenVersion();
            userRepository.save(user);

            refreshTokenRepository.deleteByUser(user);

            request.getSession().invalidate();
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(StandardResponse.success("Đăng xuất thành công", null));
        } catch (Exception e) {
            log.error("Error logging out: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể đăng xuất: " + e.getMessage()));
        }
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<StandardResponse<RefreshTokenResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
     return ResponseEntity.ok(StandardResponse.success(refreshTokenService.refreshAccessToken(request)));
    }

    @GetMapping("/get-info")
    public ResponseEntity<StandardResponse<AccountResponse>> getAccountInfo() {
            return ResponseEntity.ok(StandardResponse.success("Get profile user successfully",userService.getUserProfile()));

    }
}
 