package com.university.library.service.command;

import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.AccountResponse;
import com.university.library.entity.Account;
import com.university.library.entity.Campus;
import com.university.library.mapper.AccountMapper;
import com.university.library.repository.AccountRepository;
import com.university.library.repository.CampusRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountCommandServiceImpl implements AccountCommandService{
    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final AuthenticationManager authenticationManager;
    private final CampusRepository campusRepository;

    @Transactional
    @Override
    public AccountResponse register(RegisterRequest request) {
        validate(request);
        Campus campus = campusRepository.findByCampusId(request.getCampusId())
                .orElseThrow(() -> new RuntimeException("Invalid campus id."));
        log.info("Registering account with username: {}", request.getUsername());
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        log.info("Encoded password: {}", encodedPassword);
        Account account = Account.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(encodedPassword)
                .fullName(request.getFullName())
                .userType(Account.UserType.READER)
                .status(Account.AccountStatus.ACTIVE)
                .createdAt(Instant.now())
                .campus(campus)
                .emailVerified(false)
                .phoneVerified(false)
                .build();
        log.info("Account created successfully with id: {}", account.getAccountId());
        accountRepository.save(account);
        log.info("Account saved successfully with id: {}", account.getAccountId());

        return accountMapper.toAccountResponse(account);
    }

    @Override
    public AccountResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get the authenticated account
            Account account = (Account) authentication.getPrincipal();
            account.updateLastLogin();
            accountRepository.save(account);
            
            return accountMapper.toAccountResponse(account);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password.");
        }
    }



    public void validate(RegisterRequest request){
        long startTime = System.currentTimeMillis();

        String validationResult = accountRepository.validateAccountUniqueness(
                request.getUsername(),
                request.getEmail(),
                request.getPhone()
        );

        long validationTime = System.currentTimeMillis() - startTime;
        log.info("Validation completed in {}ms, result: {}", validationTime, validationResult);

        switch (validationResult) {
            case "USERNAME_EXISTS":
                throw new RuntimeException("Username is already taken");
            case "EMAIL_EXISTS":
                throw new RuntimeException("Email is already taken");
            case "PHONE_EXISTS":
                throw new RuntimeException("Phone number is already taken");
            case "VALID":
                break;
            default:
                log.warn("Unexpected validation result: {}", validationResult);
        }
    }
}

