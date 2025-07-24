package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.entity.Account;
import com.university.library.service.command.AccountCommandService;
import com.university.library.service.query.AccountQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountFacade {
    private final AccountCommandService accountCommandService;
    private final AccountQueryService accountQueryService;

    /**
     * @param page
     * @param size
     * @return
     */
    public PagedResponse<AccountResponse> getAllAccounts(int page, int size) {
        return accountQueryService.getAllAccounts(page, size);
    }

    /**
     * Đăng ký tài khoản
     */
    @Transactional
    public AccountResponse register(RegisterRequest request) {
        log.info("POST /api/account/register");
        AccountResponse account = accountCommandService.register(request);
        log.info("Account created successfully with id: {}", account.getAccountId());
        return account;
    }

    /**
     * Login
     */
    public AccountResponse login(LoginRequest request) {
        return accountCommandService.login(request);
    }
}

