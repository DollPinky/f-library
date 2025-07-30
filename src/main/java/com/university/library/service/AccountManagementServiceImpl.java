package com.university.library.service;

import com.university.library.dto.AccountResponse;
import com.university.library.dto.AccountSearchParams;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.UpdateAccountRoleRequest;
import com.university.library.entity.Account;
import com.university.library.entity.Account.AccountRole;
import com.university.library.repository.AccountRepository;
import com.university.library.service.command.AccountCommandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountManagementServiceImpl implements AccountManagementService {
    
    private final AccountRepository accountRepository;
    private final AccountCommandService accountCommandService;
    
    @Override
    public Page<AccountResponse> searchAccounts(AccountSearchParams params) {
        log.info("Searching accounts with params: {}", params);
        
        // Create pageable
        Pageable pageable = createPageable(params);
        
        // Convert role string to enum
        AccountRole role = null;
        if (params.getRole() != null && !params.getRole().isEmpty()) {
            try {
                role = AccountRole.valueOf(params.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid role value: {}", params.getRole());
            }
        }
        
        // Search accounts
        Page<Account> accounts = accountRepository.searchAccounts(
            params.getSearch(),
            params.getDepartment(),
            params.getPosition(),
            role,
            params.getIsActive(),
            params.getCampusId(),
            pageable
        );
        
        return accounts.map(AccountResponse::fromEntity);
    }
    
    @Override
    public AccountResponse getAccountById(UUID accountId) {
        log.info("Getting account by id: {}", accountId);
        
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        
        return AccountResponse.fromEntity(account);
    }
    
    @Override
    @Transactional
    public AccountResponse createAccount(RegisterRequest request) {
        log.info("Creating account: {}", request.getEmail());
        return accountCommandService.register(request);
    }
    
    @Override
    @Transactional
    public AccountResponse updateAccount(UUID accountId, RegisterRequest request) {
        log.info("Updating account: {}", accountId);
        return accountCommandService.updateAccount(accountId, request);
    }
    
    @Override
    @Transactional
    public AccountResponse updateAccountRole(UUID accountId, UpdateAccountRoleRequest request) {
        log.info("Updating account role: {}", accountId);
        return accountCommandService.updateAccountRole(accountId, request);
    }
    
    @Override
    @Transactional
    public void deleteAccount(UUID accountId) {
        log.info("Deleting account: {}", accountId);
        accountCommandService.deleteAccount(accountId);
    }
    
    private Pageable createPageable(AccountSearchParams params) {
        // Default values
        int page = Math.max(params.getPage(), 0);
        int size = params.getSize() > 0 ? Math.min(params.getSize(), 100) : 10;
        
        // Default sort
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        
        // Custom sort
        if (params.getSortBy() != null && !params.getSortBy().isEmpty()) {
            Sort.Direction direction = Sort.Direction.ASC;
            if (params.getSortDirection() != null && params.getSortDirection().equalsIgnoreCase("desc")) {
                direction = Sort.Direction.DESC;
            }
            sort = Sort.by(direction, params.getSortBy());
        }
        
        return PageRequest.of(page, size, sort);
    }
}
