package com.university.library.service.command;

import com.university.library.dto.LoginRequest;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.AccountResponse;

public interface AccountCommandService {
    AccountResponse register(RegisterRequest request);
    void login(LoginRequest request);
}
