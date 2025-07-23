package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.entity.Account;
import com.university.library.service.AccountFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.university.library.constants.EndpointConstants.ACCOUNT_ENDPOINT;
import static com.university.library.constants.MessageConstants.*;

@RestController
@RequestMapping(ACCOUNT_ENDPOINT)
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    private final AccountFacade accountFacade;

    /**
     * Lấy thông tin user hiện tại
     */
    @GetMapping("/me")
    public ResponseEntity<StandardResponse<AccountResponse>> getCurrentUser() {
        log.info("GET /api/v1/accounts/me");
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("Chưa đăng nhập"));
            }
            
            Account account = (Account) authentication.getPrincipal();
            AccountResponse accountResponse = AccountResponse.builder()
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .fullName(account.getFullName())
                .phone(account.getPhone())
                .userType(account.getUserType())
                .status(account.getStatus())
                .studentId(account.getStudentId())
                .faculty(account.getFaculty())
                .major(account.getMajor())
                .academicYear(account.getAcademicYear())
                .maxBorrowLimit(account.getMaxBorrowLimit())
                .currentBorrowCount(account.getCurrentBorrowCount())
                .totalBorrowCount(account.getTotalBorrowCount())
                .overdueCount(account.getOverdueCount())
                .fineAmount(account.getFineAmount())
                .build();
                
            return ResponseEntity.ok(StandardResponse.success("Lấy thông tin user thành công", accountResponse));
        } catch (Exception e) {
            log.error("Error getting current user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Không thể lấy thông tin user: " + e.getMessage()));
        }
    }

    /**
     * Lấy tất cả tài khoản (chỉ admin)
     */
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<StandardResponse<PagedResponse<AccountResponse>>>
    getAllAccounts(@RequestParam(defaultValue = "0") int page,
                   @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/v1/accounts");

        try {
            PagedResponse<AccountResponse> accounts = accountFacade.getAllAccounts(page, size);
            StandardResponse<PagedResponse<AccountResponse>> response = StandardResponse.success(
                    "Lấy danh sách tài khoản thành công", accounts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting accounts: ", e);
            StandardResponse<PagedResponse<AccountResponse>> response = StandardResponse.error(
                    "Không thể lấy danh sách tài khoản: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Đăng ký tài khoản
     */
    @Operation(summary = "Register new account", description = "Creates a new account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = SUCCESS_CREATE_ACCOUNT),
            @ApiResponse(responseCode = "400", description = INVALID_INPUT),
    })
    @PostMapping("/register")
    public ResponseEntity<StandardResponse<AccountResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/v1/accounts/register");
        try {
            AccountResponse account = accountFacade.register(request);
            StandardResponse<AccountResponse> response = StandardResponse.success(
                    "Đăng ký thành công", account);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error registering account: ", e);
            StandardResponse<AccountResponse> response = StandardResponse.error(
                    "Không thể đăng ký tài khoản: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Đăng nhập (session-based)
     */
    @Operation(summary = "Login to the system", description = "Login with username and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = LOGIN_SUCCESS),
            @ApiResponse(responseCode = "400", description = INVALID_INPUT),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
public ResponseEntity<StandardResponse<AccountResponse>> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletRequest httpRequest) {
    log.info("POST /api/v1/accounts/login");
    try {
        AccountResponse account = accountFacade.login(request);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        }

        StandardResponse<AccountResponse> response = StandardResponse.success(
                "Đăng nhập thành công", account);
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        log.error("Error logging in: ", e);
        StandardResponse<AccountResponse> response = StandardResponse.error(
                "Không thể đăng nhập: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}

    /**
     * Đăng xuất
     */
    @PostMapping("/logout")
    public ResponseEntity<StandardResponse<Void>> logout(HttpServletRequest request) {
        log.info("POST /api/v1/accounts/logout");
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            
            return ResponseEntity.ok(StandardResponse.success("Đăng xuất thành công"));
        } catch (Exception e) {
            log.error("Error logging out: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("Không thể đăng xuất: " + e.getMessage()));
        }
    }

    /**
     * Kiểm tra session
     */
    @GetMapping("/session-info")
    public ResponseEntity<StandardResponse<Map<String, Object>>> sessionInfo(HttpSession session) {
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("Không có session"));
        }
        
        String sessionId = session.getId();
        Object user = session.getAttribute("user");
        
        log.info("Session info requested: {}", sessionId);
        
        Map<String, Object> sessionInfo = new HashMap<>();
        sessionInfo.put("sessionId", sessionId);
        sessionInfo.put("user", user);
        sessionInfo.put("isValid", user != null);
        
        return ResponseEntity.ok(StandardResponse.success("Session hiện tại", sessionInfo));
    }
}
