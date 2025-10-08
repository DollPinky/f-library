package com.university.library.dto.response.borrowing;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowingStateResponse {
    UUID bookId;
    String author;
    String description;
    String title;
    String language;
    String publisher;
    Integer year;
    Long borrowCount;
}
