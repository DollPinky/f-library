package com.university.library.OAuth;

import com.university.library.entity.Role;
import com.university.library.entity.User;
import com.university.library.repository.UserRepository;
import com.university.library.serviceImpl.TokenServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenServiceImpl jwtService;

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

        String accessToken = jwtService.generateToken(account);

        int maxAge = jwtService.getJwtExpirationMs() / 1000;
        Cookie access = new Cookie("access_token", accessToken);
        access.setHttpOnly(true);
        access.setSecure(request.isSecure());   // HTTP local => false, HTTPS prod => true
        access.setPath("/");
        access.setMaxAge(maxAge);
        access.setAttribute("SameSite", "Lax");
        response.addCookie(access);

        response.sendRedirect("http://localhost:5173/"); // đổi theo FE của bạn
    }
}
