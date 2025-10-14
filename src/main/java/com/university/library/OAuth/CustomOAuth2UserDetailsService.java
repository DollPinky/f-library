package com.university.library.OAuth;

import com.university.library.entity.User;
import com.university.library.exception.exceptions.AccountDisabledException;

import com.university.library.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserDetailsService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        //extract user information
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");



        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        UUID campusId = (UUID) request.getSession().getAttribute("campusId");

//        User account = findOrCreateAccount(email, name, registrationId, campusId);
        try {
            User account = findOrCreateAccount(email, name, registrationId);
            return CustomOAuth2User.of(oAuth2User, account, "sub");
        } catch (AccountDisabledException ex) {
            throw new OAuth2AuthenticationException("Account disabled: " + ex.getMessage());
        }


    }

    @Transactional
    protected User findOrCreateAccount(String email, String name, String registrationId) throws AccountDisabledException{
        Optional<User> existingAccount = userRepository.findByEmail(email);
        if(existingAccount.isPresent()) {
            User account = existingAccount.get();

            if (!account.isAccountNonExpired() || !account.isAccountNonLocked()) {
                throw new AccountDisabledException(
                        "Account access denied",
                        email,
                        !account.isAccountNonExpired(),
                        !account.isAccountNonLocked()
                );
            }
            return account;
        }

                User user = User.builder()
                        .fullName(name)
                        .email(email)
                        .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .isActive(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .role(User.AccountRole.READER)
                        .roles(new HashSet<>())


                        .build();



            return userRepository.save(user);
        }
    }



