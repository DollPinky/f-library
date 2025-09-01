package com.university.library.service;


import com.university.library.entity.User;
import com.university.library.entity.RefreshToken;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
}
