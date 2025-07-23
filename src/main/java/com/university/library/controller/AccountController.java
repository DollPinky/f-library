package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
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
import org.springframework.web.bind.annotation.*;

import static com.university.library.constants.EndpointConstants.ACCOUNT_ENDPOINT;
import static com.university.library.constants.MessageConstants.*;

@RestController
@RequestMapping(ACCOUNT_ENDPOINT)
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    private final AccountFacade accountFacade;

    /**
     * Lấy tất cả tài khoản
     */
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<StandardResponse<PagedResponse<AccountResponse>>>
    getBooks(@RequestParam(defaultValue = "0") int page,
             @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/account");

        try {
            PagedResponse<AccountResponse> accounts = accountFacade.getAllAccounts(page, size);
            StandardResponse<PagedResponse<AccountResponse>> response = StandardResponse.success(
                    "Lấy danh sách sách thành công", accounts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting books: ", e);
            StandardResponse<PagedResponse<AccountResponse>> response = StandardResponse.error(
                    "Không thể lấy danh sách sách: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Đăng ký tài khoản
     */
    @Operation(summary = "Register new account for customer", description = "Creates a new account for customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = SUCCESS_CREATE_ACCOUNT),
            @ApiResponse(responseCode = "400", description = INVALID_INPUT),
    })
    @PostMapping("/register")
    public ResponseEntity<StandardResponse<AccountResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/account/register");
        try {
            AccountResponse account = accountFacade.register(request);
            StandardResponse<AccountResponse> response = StandardResponse.success(
                    "Đăng kí thành công", account);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error registering account: ", e);
            StandardResponse<AccountResponse> response = StandardResponse.error(
                    "Không thể đăng ký tài khoản: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    /**
     * Đăng nhập
     */
    @Operation(summary = "Login to the system", description = "Use account to login system movie theater")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = LOGIN_SUCCESS),
            @ApiResponse(responseCode = "400", description = INVALID_INPUT),
            @ApiResponse(responseCode = "409", description = ACCOUNT_NON_EXIST)
    })
    @PostMapping("/login")
    public ResponseEntity<StandardResponse<Void>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("POST /api/account/login");
        try {
            accountFacade.login(request);
            StandardResponse<Void> response = StandardResponse.success(
                    "Đăng nhập thành công");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error logging in: ", e);
            StandardResponse<Void> response = StandardResponse.error(
                    "Không thể đăng nhập: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    @GetMapping("/session-info")
    public ResponseEntity<StandardResponse<String>> sessionInfo(HttpSession session) {
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("No active session"));
        }
        String sessionId = session.getId();
        log.info("Session info requested: {}", sessionId);
        return ResponseEntity.ok(StandardResponse.success("Session hiện tại", sessionId));
    }

}
