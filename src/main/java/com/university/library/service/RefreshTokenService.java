package com.university.library.service;


import com.university.library.dto.request.refreshToken.RefreshTokenRequest;
import com.university.library.dto.response.refreshToken.RefreshTokenResponse;
import com.university.library.entity.User;
import com.university.library.entity.RefreshToken;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshTokenResponse refreshAccessToken(RefreshTokenRequest request);
}
