package com.university.library.serviceImpl;

import com.university.library.dto.response.account.AccountResponse;
import com.university.library.dto.request.account.LoginRequest;
import com.university.library.dto.request.account.RegisterRequest;
import com.university.library.dto.response.user.UserResponse;
import com.university.library.entity.Campus;
import com.university.library.entity.RefreshToken;
import com.university.library.entity.User;
import com.university.library.exception.exceptions.BadRequestException;
import com.university.library.mapper.UserMapper;
import com.university.library.repository.CampusRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.AuthenticationService;
import com.university.library.service.RefreshTokenService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Lazy
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenServiceImpl tokenService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private CampusRepository campusRepository;

    @Override
    @Transactional
    public AccountResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }

        // Check if employee code already exists
        if (userRepository.existsByCompanyAccount(request.getCompanyAccount())) {
            throw new RuntimeException("Mã nhân viên đã tồn tại trong hệ thống");
        }

        // Validate campus exists
        Campus campus = campusRepository.findByCampusId(request.getCampusId())
                .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));

        // Create new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .position(request.getPosition())
                .companyAccount(request.getCompanyAccount())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.AccountRole.READER) // Default role for new registrations
                .campus(campus)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedAccount = userRepository.save(user);
        log.info("Account registered successfully: {}", savedAccount.getUserId());

        return AccountResponse.fromEntity(savedAccount);
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
//            log.info("Login successful: {}", authentication.getPrincipal());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            User account = (User) authentication.getPrincipal();
            AccountResponse accountResponse = AccountResponse.fromEntity(account);
            if(account.getRole().equals( User.AccountRole.READER)) {
                return accountResponse;
            }
            else {
                accountResponse.setAccessToken(tokenService.generateToken(account));
                accountResponse.setRefreshToken(refreshTokenService.createRefreshToken(account).getToken());
                return accountResponse;
            }

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));
    }
}