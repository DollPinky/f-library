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
                .build();

        User savedAccount = userRepository.save(user);
        log.info("Account registered successfully: {}", savedAccount.getUserId());

        return AccountResponse.fromEntity(savedAccount);
    }

    @Override
    public UserResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));


        } catch (BadCredentialsException e) {
            // Fixed: Preserve stack trace
            throw new BadRequestException("Username/ password is invalid. Please try again!", e);
        } catch (LockedException e) {
            // Fixed: Preserve stack trace
            throw new BadRequestException("Account has been locked!", e);
        } catch (Exception e) {
            // Fixed: Preserve stack trace
            throw new BadRequestException("Login failed: " + e.getMessage(), e);
        }

        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found with username: " + loginRequest.getEmail()));

        // Tạo authentication với authorities từ permissions
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(user.getUsername(), null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String token = tokenService.generateToken(user);

        return UserMapper.toResponse(user, token, refreshToken.getToken());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));
    }
}