package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.response.bookDonation.BookDonationResponse;
import com.university.library.entity.BookDonation;

import java.util.UUID;


public interface BookDonationService {

    BookDonation save(BookDonation bookDonation);

    PagedResponse<BookDonationResponse> getHistoriesDonation(UUID accountId, int page, int size);
}
