package com.university.library.serviceImpl;


import com.university.library.entity.User;
import com.university.library.entity.Permission;
import com.university.library.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl {

    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    private SecretKey getSigninKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
//        return Keys.hmacShaKeyFor(keyBytes);
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenVersion", user.getTokenVersion());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("fullName", user.getFullName());

        claims.put(
                "roles",
                user.getRoles().stream().map(role -> "ROLE_" + role.getName()).collect(Collectors.toList()));

        claims.put(
                "permissions",
                user.getRoles().stream()
                        .flatMap(role -> role.getPermissions().stream())
                        .map(Permission::getCode) // Use CODE instead of name
                        .collect(Collectors.toSet()));

        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuer("your-service")
                .setAudience("your-frontend")
                .setClaims(claims) // Đặt claims trước
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(getSigninKey(), SignatureAlgorithm.HS512) // Sử dụng SecretKey
                .compact();
    }

    public User getAccountByToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String username = (String) claims.get("username");
        User user = userRepository
                .findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found with username: " + username));

        // Kiểm tra token version
        int tokenVersion = (int) claims.get("tokenVersion");
        if (tokenVersion != user.getTokenVersion() || claims.getExpiration().before(new Date())) {
            throw new ExpiredJwtException(null, claims, "Token has been invalidated");
        }

        return user;
    }

}
