package com.university.library.mapper;

import com.university.library.dto.UserResponse;
import com.university.library.entity.User;

public class UserMapper {
    public static UserResponse toResponse(User user, String token, String refreshToken) {
        return UserResponse.builder().token(token).refreshToken(refreshToken).build();
    }
}
