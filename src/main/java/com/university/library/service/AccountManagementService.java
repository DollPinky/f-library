package com.university.library.service;

import com.university.library.dto.AccountResponse;
import com.university.library.dto.AccountSearchParams;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.UpdateAccountRoleRequest;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface AccountManagementService {
    Page<AccountResponse> searchAccounts(AccountSearchParams params);
    AccountResponse getAccountById(UUID accountId);
    AccountResponse createAccount(RegisterRequest request);
    AccountResponse updateAccount(UUID accountId, RegisterRequest request);
    AccountResponse updateAccountRole(UUID accountId, UpdateAccountRoleRequest request);
    void deleteAccount(UUID accountId);
}
