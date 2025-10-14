package com.university.library.dto.response.borrowing;

import com.university.library.entity.BookCopy;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowingHistoryResponse {
    String username;
    UUID bookCopyId;
    String shelfLocation;
    BookCopy.BookStatus status;
    String campus;
    LocalDateTime borrowDate;
    LocalDateTime returnedDate;
}
