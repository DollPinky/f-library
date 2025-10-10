package com.university.library.serviceImpl;

import com.university.library.entity.BookDonation;
import com.university.library.repository.BookDonationRepository;
import com.university.library.service.BookDonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookDonationServiceImpl implements BookDonationService {

    private final BookDonationRepository bookDonationRepository;

    @Override
    public BookDonation save(BookDonation bookDonation) {
        return bookDonationRepository.save(bookDonation);
    }
}
