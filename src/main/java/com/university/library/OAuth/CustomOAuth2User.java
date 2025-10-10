package com.university.library.OAuth;

import com.university.library.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User, UserDetails {
    private final OAuth2User oAuth2User;
    private final User account;
    private final String userNameAttributeName;

    private final Collection<? extends GrantedAuthority> mergedAuthorities;

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return mergedAuthorities;
    }

    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return account.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return account.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return account.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return account.isEnabled();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oAuth2User.getAttributes();
    }

//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return account.getAuthorities();
//    }

    @Override
    public String getName() {
        return oAuth2User.getAttribute(userNameAttributeName);
    }

    public User getUser() {
        return account;
    }

    public static CustomOAuth2User of(OAuth2User delegate, User account, String nameAttrKey) {
        Set<GrantedAuthority> merged = new java.util.HashSet<>(delegate.getAuthorities()); // giữ SCOPE_*
        // map từ enum đơn lẻ
        if (account.getRole() != null) {
            merged.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                    "ROLE_" + account.getRole().name()));
        }
        // map từ set roles nếu có
        if (account.getRoles() != null) {
            for (var r : account.getRoles()) {
                merged.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + r.getName())); // tuỳ thuộc field
            }
        }
        return new CustomOAuth2User(delegate, account, nameAttrKey,
                java.util.Collections.unmodifiableSet(merged));
    }
}
