package com.university.library.service;

import com.university.library.dto.AccountResponse;
import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;

public interface AccountService {
    AccountResponse register(RegisterRequest request);
    AccountResponse login(LoginRequest request);
    AccountResponse getCurrentAccount();
} 