package com.university.library.mapper;

import com.university.library.dto.AccountResponse;
import com.university.library.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountResponse toAccountResponse(Account account);
}
