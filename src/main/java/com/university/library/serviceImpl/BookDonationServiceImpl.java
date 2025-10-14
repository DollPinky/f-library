package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.dto.response.bookDonation.BookDonationResponse;
import com.university.library.dto.response.campus.CampusResponse;
import com.university.library.entity.BookDonation;

import com.university.library.repository.BookDonationRepository;
import com.university.library.service.BookDonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class BookDonationServiceImpl implements BookDonationService {

    private final BookDonationRepository bookDonationRepository;

    @Override
    public BookDonation save(BookDonation bookDonation) {
        return bookDonationRepository.save(bookDonation);
    }


    @Override
    public PagedResponse<BookDonationResponse> getHistoriesDonation(UUID accountId, int page, int size) {
        Sort sort = Sort.by("donationAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<BookDonation> pageData = bookDonationRepository.findBookDonationsByDonor_UserId(accountId,pageable);

        List<BookDonationResponse> content = pageData.getContent()
                .stream()
                .map(bd -> new BookDonationResponse(
                        bd.getBookDonation(),
                        bd.getTitle(),
                        CampusResponse.fromEntity(bd.getBookCopy().getCampus()),
                        bd.getDonationAt(),
                        bd.getDonationPoint() == null ? 0 : bd.getDonationPoint()
                )).toList();

        return  PagedResponse.of(
                content,
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements()
        );
    }


}
