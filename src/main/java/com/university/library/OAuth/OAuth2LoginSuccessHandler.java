package com.university.library.OAuth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.university.library.dto.response.account.AccountResponse;
import com.university.library.entity.Role;
import com.university.library.entity.User;
import com.university.library.repository.UserRepository;
import com.university.library.service.RefreshTokenService;
import com.university.library.serviceImpl.TokenServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenServiceImpl jwtService;
    private final RefreshTokenService refreshTokenService;
//    private final ObjectMapper objectMapper;
    private final String DOMAIN = "https://v2.thuvienfpt.com";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomOAuth2User cu)) {
            throw new IllegalStateException(
                    "Principal is not CustomOAuth2User. Check SecurityConfig.userInfoEndpoint().userService(...)");
        }

        User account = cu.getUser();

        String accessToken  = jwtService.generateToken(account);
        String refreshToken = refreshTokenService.createRefreshToken(account).getToken();

//        String target = "http://localhost:8081/user"
        String target = DOMAIN + "/user"
                + "#access_token=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                + "&refresh_token=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8)
                + "&fullName=" + URLEncoder.encode(account.getFullName(), StandardCharsets.UTF_8)
                + "&email=" + URLEncoder.encode(account.getEmail(), StandardCharsets.UTF_8);

        response.sendRedirect(target);
    }
}
