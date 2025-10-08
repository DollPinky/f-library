package com.university.library.serviceImpl;

import com.university.library.dto.response.account.AccountResponse;
import com.university.library.entity.User;
import com.university.library.repository.UserRepository;
import com.university.library.service.UserService;
import com.university.library.utils.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public AccountResponse getUserProfile() {
        UserDetails currentUser = AuthUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User Not Found At getCurrentUserProfile()");
        }
        String  email = currentUser.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("UserEmail Not Found At getCurrentUserProfile()" + currentUser.getUsername()));

        return AccountResponse.fromEntity(user);


    }
}
