package com.university.library.dto.request.refreshToken;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh token không được để trống")
    @NotNull(message = "Refresh token không được để trống")
    private String refreshToken;
}
