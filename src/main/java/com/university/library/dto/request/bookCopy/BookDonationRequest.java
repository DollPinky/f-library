package com.university.library.dto.request.bookCopy;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BookDonationRequest {
    private String username;
    @NotNull(message = "title must be not null")
    @NotBlank(message = "title must be not blank")
    private String title;
    private String bookCover;
    private String campusCode;
    private String shelfLocation;
    private String categoryName;
}
