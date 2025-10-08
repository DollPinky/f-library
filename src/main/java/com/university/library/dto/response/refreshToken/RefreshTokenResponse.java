package com.university.library.dto.response.refreshToken;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class RefreshTokenResponse {
    private String accessToken;
}
