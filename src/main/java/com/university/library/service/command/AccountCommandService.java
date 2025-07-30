package com.university.library.service.command;

import com.university.library.dto.AccountResponse;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.UpdateAccountRoleRequest;

import java.util.UUID;

public interface AccountCommandService {
    
    /**
     * Register a new account
     */
    AccountResponse register(RegisterRequest request);
    
    /**
     * Update an existing account
     */
    AccountResponse updateAccount(UUID accountId, RegisterRequest request);
    
    /**
     * Update account role
     */
    AccountResponse updateAccountRole(UUID accountId, UpdateAccountRoleRequest request);
    
    /**
     * Delete an account
     */
    void deleteAccount(UUID accountId);
} 