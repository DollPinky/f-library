package com.university.library.service.command;

import com.university.library.dto.AccountResponse;
import com.university.library.dto.RegisterRequest;
import com.university.library.entity.Account;
import com.university.library.entity.Campus;
import com.university.library.repository.AccountRepository;
import com.university.library.repository.CampusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountCommandServiceImpl implements AccountCommandService {
    
    private final AccountRepository accountRepository;
    private final CampusRepository campusRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public AccountResponse register(RegisterRequest request) {
        log.info("Registering new account: {}", request.getEmail());
        
        // Check if email already exists
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }
        
        // Check if employee code already exists
        if (accountRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Mã nhân viên đã tồn tại trong hệ thống");
        }
        
        // Validate campus exists
        Campus campus = campusRepository.findByCampusId(request.getCampusId())
                .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));
        
        // Create new account
        Account account = Account.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .position(request.getPosition())
                .employeeCode(request.getEmployeeCode())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Account.AccountRole.READER) // Default role for new registrations
                .campus(campus)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        log.info("Account registered successfully: {}", savedAccount.getAccountId());
        
        return AccountResponse.fromEntity(savedAccount);
    }
    
    @Override
    @Transactional
    public AccountResponse updateAccount(UUID accountId, RegisterRequest request) {
        log.info("Updating account: {}", accountId);
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
        
        // Check if email is being changed and already exists
        if (!account.getEmail().equals(request.getEmail()) && 
            accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }
        
        // Check if employee code is being changed and already exists
        if (!account.getEmployeeCode().equals(request.getEmployeeCode()) && 
            accountRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Mã nhân viên đã tồn tại trong hệ thống");
        }
        
        // Validate campus exists if being changed
        Campus campus = null;
        if (request.getCampusId() != null && !request.getCampusId().equals(account.getCampus().getCampusId())) {
            campus = campusRepository.findByCampusId(request.getCampusId())
                    .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));
        }
        
        // Update account fields
        account.setFullName(request.getFullName());
        account.setEmail(request.getEmail());
        account.setPhone(request.getPhone());
        account.setDepartment(request.getDepartment());
        account.setPosition(request.getPosition());
        account.setEmployeeCode(request.getEmployeeCode());
        if (campus != null) {
            account.setCampus(campus);
        }
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        
        Account updatedAccount = accountRepository.save(account);
        log.info("Account updated successfully: {}", updatedAccount.getAccountId());
        
        return AccountResponse.fromEntity(updatedAccount);
    }
    
    @Override
    @Transactional
    public void deleteAccount(UUID accountId) {
        log.info("Deleting account: {}", accountId);
        
        if (!accountRepository.existsById(accountId)) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }
        
        accountRepository.deleteById(accountId);
        log.info("Account deleted successfully: {}", accountId);
    }
} 