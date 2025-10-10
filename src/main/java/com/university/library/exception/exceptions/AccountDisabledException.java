package com.university.library.exception.exceptions;

import lombok.Getter;

import javax.naming.AuthenticationException;

@Getter
public class AccountDisabledException extends AuthenticationException {
    private final String email;
    private final boolean isLocked;
    private final boolean isDisabled;

    public AccountDisabledException(String message, String email, boolean isLocked, boolean isDisabled) {
        super(message);
        this.email = email;
        this.isLocked = isLocked;
        this.isDisabled = isDisabled;
    }
}
