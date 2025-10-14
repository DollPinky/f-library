package com.university.library.dto.response.bookDonation;


import com.university.library.dto.response.campus.CampusResponse;

import com.university.library.entity.BookDonation;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDonationResponse {
   private UUID bookDonationId;
   private String title;
   private CampusResponse campusCode;
   private LocalDateTime donationDate;
   private Integer donationPoint;

    public static BookDonationResponse fromEntity(BookDonation bookDonation) {
        if (bookDonation == null) {
            return null;
        }

        return BookDonationResponse.builder()
                .bookDonationId(bookDonation.getBookDonation())
                .title(bookDonation.getBookCopy().getBook().getTitle())
                .campusCode(CampusResponse.fromEntity(bookDonation.getBookCopy().getCampus()))
                .donationDate(bookDonation.getDonationAt())
                .donationPoint(bookDonation.getDonationPoint() == null ? 0 : bookDonation.getDonationPoint())
                .build();
    }

    public static List<BookDonationResponse> fromEntityList(List<BookDonation> bookDonations) {
        if (bookDonations == null || bookDonations.isEmpty()) {
            return Collections.emptyList();
        }
        return bookDonations.stream()
                .map(BookDonationResponse::fromEntity)
                .toList();
    }

}
