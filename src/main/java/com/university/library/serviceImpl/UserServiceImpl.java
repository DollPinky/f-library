package com.university.library.serviceImpl;

import com.university.library.dto.response.account.AccountResponse;
import com.university.library.entity.User;
import com.university.library.repository.UserRepository;
import com.university.library.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public AccountResponse getUserProfile() {
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("UserEmail Not Found At getCurrentUserProfile()" + email));

        return AccountResponse.fromEntity(user);


    }
}
