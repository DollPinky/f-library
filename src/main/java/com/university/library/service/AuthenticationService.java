package com.university.library.service;


import com.university.library.dto.response.account.AccountResponse;
import com.university.library.dto.request.account.LoginRequest;
import com.university.library.dto.request.account.RegisterRequest;
import com.university.library.dto.response.user.UserResponse;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AuthenticationService extends UserDetailsService {
    AccountResponse register(RegisterRequest request);
    UserResponse login(LoginRequest loginRequest);
}
