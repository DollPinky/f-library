package com.university.library.dto.request.bookCopy;

import lombok.Data;

import java.util.UUID;

@Data
public class BookDonationRequest {
    private String username;
    private String title;
    private String bookCover;
    private String campusCode;
    private String shelfLocation;
    private String categoryName;
}
