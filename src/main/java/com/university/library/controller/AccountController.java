package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.AccountSearchParams;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.UpdateAccountRoleRequest;
import com.university.library.service.AccountService;
import com.university.library.service.AccountManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Account", description = "Quản lý tài khoản người dùng")
public class AccountController {
    private final AccountService accountService;
    private final AccountManagementService accountManagementService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới")
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
    @Operation(summary = "Đăng nhập")
    public ResponseEntity<StandardResponse<AccountResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            AccountResponse account = accountService.login(request);
            // Ensure session is created and user is properly authenticated
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            return ResponseEntity.ok(StandardResponse.success("Đăng nhập thành công", account));
        } catch (Exception e) {
            log.error("Error logging in: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(StandardResponse.error("Không thể đăng nhập: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại")
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
    
    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất")
    public ResponseEntity<StandardResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(StandardResponse.success("Đăng xuất thành công", null));
        } catch (Exception e) {
            log.error("Error logging out: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể đăng xuất: " + e.getMessage()));
        }
    }
    
    // Account Management Endpoints
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    @Operation(summary = "Tìm kiếm tài khoản", description = "Tìm kiếm và phân trang tài khoản với các tiêu chí lọc")
    public ResponseEntity<StandardResponse<Page<AccountResponse>>> searchAccounts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) UUID campusId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        
        try {
            AccountSearchParams params = AccountSearchParams.builder()
                    .search(search)
                    .department(department)
                    .position(position)
                    .role(role)
                    .isActive(isActive)
                    .campusId(campusId)
                    .page(page)
                    .size(size)
                    .sortBy(sortBy)
                    .sortDirection(sortDirection)
                    .build();
            
            Page<AccountResponse> accounts = accountManagementService.searchAccounts(params);
            return ResponseEntity.ok(StandardResponse.success("Tìm kiếm tài khoản thành công", accounts));
        } catch (Exception e) {
            log.error("Error searching accounts: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể tìm kiếm tài khoản: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    @Operation(summary = "Lấy thông tin chi tiết tài khoản")
    public ResponseEntity<StandardResponse<AccountResponse>> getAccountById(@PathVariable UUID id) {
        try {
            AccountResponse account = accountManagementService.getAccountById(id);
            return ResponseEntity.ok(StandardResponse.success("Lấy thông tin tài khoản thành công", account));
        } catch (Exception e) {
            log.error("Error getting account by id: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể lấy thông tin tài khoản: " + e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo tài khoản mới")
    public ResponseEntity<StandardResponse<AccountResponse>> createAccount(@Valid @RequestBody RegisterRequest request) {
        try {
            AccountResponse account = accountManagementService.createAccount(request);
            return ResponseEntity.ok(StandardResponse.success("Tạo tài khoản thành công", account));
        } catch (Exception e) {
            log.error("Error creating account: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error("Không thể tạo tài khoản: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật tài khoản")
    public ResponseEntity<StandardResponse<AccountResponse>> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody RegisterRequest request) {
        try {
            AccountResponse account = accountManagementService.updateAccount(id, request);
            return ResponseEntity.ok(StandardResponse.success("Cập nhật tài khoản thành công", account));
        } catch (Exception e) {
            log.error("Error updating account: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error("Không thể cập nhật tài khoản: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật vai trò tài khoản")
    public ResponseEntity<StandardResponse<AccountResponse>> updateAccountRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAccountRoleRequest request) {
        try {
            AccountResponse account = accountManagementService.updateAccountRole(id, request);
            return ResponseEntity.ok(StandardResponse.success("Cập nhật vai trò tài khoản thành công", account));
        } catch (Exception e) {
            log.error("Error updating account role: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error("Không thể cập nhật vai trò tài khoản: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa tài khoản")
    public ResponseEntity<StandardResponse<Void>> deleteAccount(@PathVariable UUID id) {
        try {
            accountManagementService.deleteAccount(id);
            return ResponseEntity.ok(StandardResponse.success("Xóa tài khoản thành công", null));
        } catch (Exception e) {
            log.error("Error deleting account: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể xóa tài khoản: " + e.getMessage()));
        }
    }
}
 