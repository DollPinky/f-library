package com.university.library.service;

import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.entity.Account;
import com.university.library.repository.AccountRepository;
import com.university.library.service.command.AccountCommandService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final AccountCommandService accountCommandService;
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;

    @Transactional
    @Override
    public AccountResponse register(RegisterRequest request) {
        log.info("Registering new account: {}", request.getEmail());
        return accountCommandService.register(request);
    }

    @Override
    public AccountResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Account account = (Account) authentication.getPrincipal();
            return AccountResponse.fromEntity(account);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng.");
        }
    }

    @Override
    public AccountResponse getCurrentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Chưa đăng nhập");
        }
        Account account = (Account) authentication.getPrincipal();
        return AccountResponse.fromEntity(account);
    }
    
    @Override
    public AccountResponse getAccountById(UUID accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        return AccountResponse.fromEntity(account);
    }
}
 