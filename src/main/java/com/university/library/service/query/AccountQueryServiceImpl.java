package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.entity.Account;
import com.university.library.mapper.AccountMapper;
import com.university.library.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountQueryServiceImpl implements AccountQueryService{
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Override
    public PagedResponse<AccountResponse> getAllAccounts(int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Account> accountsPage = accountRepository.findAll(pageable);
        PagedResponse<AccountResponse> mappedPage =
                (PagedResponse<AccountResponse>)
                        accountsPage.map(accountMapper::toAccountResponse);

        return PagedResponse.fromPage(mappedPage);

    }

}
