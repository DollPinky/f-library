package com.university.library.dto.response.bookCopy;

import com.university.library.dto.response.book.BookResponse;
import com.university.library.entity.BookCopy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyResponse {
    private UUID bookCopyId;
    private BookResponse book;
    private CampusResponse campus;
    private BookStatus status;
    private String shelfLocation;
    private Long borrowingCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookCopyResponse fromEntity(BookCopy bookCopy) {
        if (bookCopy == null) {
            return null;
        }

        return BookCopyResponse.builder()
            .bookCopyId(bookCopy.getBookCopyId())
            .book(bookCopy.getBook() != null ? BookResponse.fromEntity(bookCopy.getBook()) : null)
            .campus(bookCopy.getCampus() != null ? CampusResponse.fromEntitySimple(bookCopy.getCampus()) : null)
            .status(convertBookStatus(bookCopy.getStatus()))
            .shelfLocation(bookCopy.getShelfLocation())
            .borrowingCount(0L) // Avoid lazy loading of borrowings
            .createdAt(bookCopy.getCreatedAt())
            .updatedAt(bookCopy.getUpdatedAt())
            .build();
    }



    public enum BookStatus {
        AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED
    }

    /**
     * Convert BookCopy.BookStatus to BookCopyResponse.BookStatus
     */
    private static BookStatus convertBookStatus(com.university.library.entity.BookCopy.BookStatus status) {
        if (status == null) {
            return BookStatus.AVAILABLE;
        }

        switch (status) {
            case AVAILABLE:
                return BookStatus.AVAILABLE;
            case BORROWED:
                return BookStatus.BORROWED;
            case RESERVED:
                return BookStatus.RESERVED;
            case LOST:
                return BookStatus.LOST;
            case DAMAGED:
                return BookStatus.DAMAGED;
            default:
                return BookStatus.AVAILABLE;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CampusResponse {
        private UUID campus;
        private String name;
        private String code;
        private String address;

        public static CampusResponse fromEntitySimple(com.university.library.entity.Campus campus) {
            if (campus == null) {
                return null;
            }

            return CampusResponse.builder()
                .campus(campus.getCampusId())
                .name(campus.getName())
                .code(campus.getCode())
                .address(campus.getAddress())
                .build();
        }
    }
}

