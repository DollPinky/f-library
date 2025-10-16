package com.university.library.config;

import com.university.library.OAuth.CustomOAuth2User;
import com.university.library.OAuth.CustomOAuth2UserDetailsService;
import com.university.library.OAuth.OAuth2LoginSuccessHandler;
import com.university.library.entity.User;
import com.university.library.repository.RefreshTokenRepository;
import com.university.library.repository.UserRepository;
import com.university.library.serviceImpl.CustomeUserDetailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {
    private final CustomeUserDetailService userDetailsService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    @Value("${app.cors.allowed-origins:*}")
    private String corsAllowedOrigins;
//    private final CookieJwtAuthFilter cookieJwtAuthFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserDetailsService customOAuth2UserDetailsService;
    private final PasswordEncoder passwordEncoder;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/accounts/register",
                                "/api/v1/accounts/login",
                                "/api/chat-with-guest",
                                "/swagger-ui/**",
                                "/api/v1/book-copies/donation",
                                "/v3/api-docs",
                                "/api/v1/configuration",
                                "/v3/api-docs/**",
                                "/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        .requestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()
                        .requestMatchers("/api/v1/oauth2/**").permitAll()


                        .requestMatchers("/api/auth/login").permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/book-copies/{bookCopyId}",
                                "/api/v1/book-copies/search",
                                "/api/v1/book-copies/generate-qr/{bookCopyId}",
                                "/api/v1/book-copies/generate-all-qr-codes",
                                "/api/v1/book-copies/book/{bookId}",
                                "/api/v1/book-copies/book/{bookId}/available"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/books/{bookId}",
                                "/api/v1/books/all",
                                "/api/v1/books/search"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/categories/{categoryId}",
                                "/api/v1/categories/{categoryId}/children",
                                "/api/v1/categories/all",
                                "/api/v1/categories/search"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/campuses/{campusId}",
                                "/api/v1/campuses/all"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/borrowings",
                                "/api/v1/borrowings/{borrowingId}",
                                "/api/v1/borrowings/user/{userId}",
                                "/api/v1/borrowings/overdue",
                                "/api/v1/borrowings/check-borrowed"
                        ).permitAll()

                        //admin
                        .requestMatchers(HttpMethod.POST, "/api/v1/book-copies/create").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/book-copies/{bookCopyId}/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/book-copies/{bookCopyId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/book-copies/{bookCopyId}").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/books/create").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/books/import").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/books/{bookId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/books/{bookId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/books/book-cover-link/{bookId}").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/categories/create").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/categories/{categoryId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/{categoryId}").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/borrowings/borrow").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/borrowings/return").hasAnyRole("ADMIN","READER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/borrowings/lost").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/loyalty-point/update").permitAll()
                                .requestMatchers(HttpMethod.GET,"/api/v1/top-5-loyalty-users-by-month").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/v1/book-copies/import-donation-book").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET,  "/api/v1/accounts/get-info").hasAnyRole("READER","ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/api/v1/book-donation-history/{accountId}").hasAnyRole("READER","ADMIN")

                        .requestMatchers("/admin/**", "/api/v1/admin/**").hasAnyRole("ADMIN")
                        .requestMatchers("/favicon.ico", "/error").permitAll()

                        .anyRequest().authenticated()
                )
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))


                .oauth2Login(oauth -> oauth

                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureHandler((req, res, ex) -> {
                            String msg = URLEncoder.encode(ex.getMessage(), StandardCharsets.UTF_8);
                            res.sendRedirect("http://localhost:5173/login?oauth_error=" + msg);
                        })
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserDetailsService) // Use OAuth2UserService instead of OidcUserService
                        )
                        .authorizationEndpoint(ae -> ae.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(re -> re.baseUri("/login/oauth2/code/*"))
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized\"}");
                        })
                )
                .authenticationProvider(authenticationProvider());
//        http.addFilterBefore(cookieJwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var cfg = new org.springframework.web.cors.CorsConfiguration();
        var origins = java.util.Arrays.stream(corsAllowedOrigins.split(","))
                .map(String::trim)
                .toList();

        // Use exact origins, not patterns, to avoid falling back to *
        cfg.setAllowedOriginPatterns(List.of("*"));
        cfg.addAllowedMethod("*");
        cfg.addAllowedHeader("*");
        cfg.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        return CookieSameSiteSupplier.ofLax();
    }
}