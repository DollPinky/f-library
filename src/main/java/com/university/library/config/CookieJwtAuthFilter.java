//package com.university.library.config;
//
//import com.university.library.entity.User;
//import com.university.library.serviceImpl.CustomeUserDetailService;
//import com.university.library.serviceImpl.TokenServiceImpl;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//@RequiredArgsConstructor
//public class CookieJwtAuthFilter extends OncePerRequestFilter {
//    private final TokenServiceImpl tokenService;
//    private final CustomeUserDetailService userDetailsService;
//
//    @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
//            throws IOException, ServletException {
//        if (SecurityContextHolder.getContext().getAuthentication() == null && req.getCookies()!=null) {
//            for (Cookie c : req.getCookies()) {
//                if ("access_token".equals(c.getName())) {
//                    try {
//                        User u = tokenService.getAccountByToken(c.getValue());
//                        var ud = userDetailsService.loadUserByUsername(u.getEmail());
//                        var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
//                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
//                        SecurityContextHolder.getContext().setAuthentication(auth);
//                    } catch (Exception ignored) {}
//                    break;
//                }
//            }
//        }
//        chain.doFilter(req, res);
//    }
//}
//
