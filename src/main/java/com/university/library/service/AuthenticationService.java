package com.university.library.service;


import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.UserResponse;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AuthenticationService extends UserDetailsService {
    AccountResponse register(RegisterRequest request);

    UserResponse login(LoginRequest loginRequest);


}
