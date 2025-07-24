//package com.university.library.config;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.util.AntPathMatcher;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.List;
//
//@Component
//public class FilterConfig extends OncePerRequestFilter {
//
//    private final List<String> AUTH_PERMISSION = List.of(
//            "/swagger-ui/**",
//            "/swagger-ui.html",
//            "/api-docs/**",
//            "/swagger-resources/**",
//            "/webjars/**",
//            "/api/v1/accounts/register",
//            "/api/v1/accounts/login"
//    );
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String uri = request.getRequestURI();
//        boolean isPublicAPI = checkIsPublicAPI(uri);
//
//        if (isPublicAPI) {
//            // Cho qua public API
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // Với API không public → kiểm tra session
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated()) {
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
//            return;
//        }
//
//        filterChain.doFilter(request, response);
//    }
//
//    public boolean checkIsPublicAPI(String uri) {
//        AntPathMatcher pathMatcher = new AntPathMatcher();
//        return AUTH_PERMISSION.stream().anyMatch(pattern -> pathMatcher.match(pattern, uri));
//    }
//}

