package com.university.library.dto.response.borrowing;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowingHistoryResponse {
    String username;
    LocalDateTime borrowDate;
    LocalDateTime returnedDate;
}
