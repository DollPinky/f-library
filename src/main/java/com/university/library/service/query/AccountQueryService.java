package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.AccountResponse;

public interface AccountQueryService {
    PagedResponse<AccountResponse> getAllAccounts(int page, int size);
}
