package com.university.library.OAuth;

import com.university.library.entity.Role;
import com.university.library.entity.User;
import com.university.library.serviceImpl.TokenServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final TokenServiceImpl jwtService;
    // Nếu cần refresh token bằng cookie, inject thêm RefreshTokenService ở đây.

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {


        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User account = oAuth2User.getUser();


        String accessToken = jwtService.generateToken(account);


        int accessTokenMaxAgeSeconds = jwtService.getJwtExpirationMs() / 1000;


        boolean isHttps = request.isSecure();
        Cookie accessCookie = new Cookie("access_token", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(isHttps);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(accessTokenMaxAgeSeconds);
        accessCookie.setAttribute("SameSite", "Lax");
        response.addCookie(accessCookie);

        response.sendRedirect("http://localhost:5173/");

    }
}
