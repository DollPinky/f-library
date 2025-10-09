package com.university.library.dto.response.comment;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvgRatingStarResponse {
    UUID bookId;
    String author;
    String description;
    String title;
    String language;
    String publisher;
    Integer year;
    Double avgRating;
}
