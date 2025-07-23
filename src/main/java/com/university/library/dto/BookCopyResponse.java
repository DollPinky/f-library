package com.university.library.dto;

import com.university.library.entity.BookCopy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyResponse {
    private UUID bookCopyId;
    private BookResponse book;
    private LibraryResponse library;
    private String qrCode;
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
            .library(bookCopy.getLibrary() != null ? LibraryResponse.fromEntitySimple(bookCopy.getLibrary()) : null)
            .qrCode(bookCopy.getQrCode())
            .status(convertBookStatus(bookCopy.getStatus()))
            .shelfLocation(bookCopy.getShelfLocation())
            .borrowingCount(bookCopy.getBorrowings() != null ? (long) bookCopy.getBorrowings().size() : 0L)
            .createdAt(bookCopy.getCreatedAt())
            .updatedAt(bookCopy.getUpdatedAt())
            .build();
    }
    
    /**
     * Simplified version without nested relationships for performance
     */
    public static BookCopyResponse fromEntitySimple(BookCopy bookCopy) {
        if (bookCopy == null) {
            return null;
        }
        
        return BookCopyResponse.builder()
            .bookCopyId(bookCopy.getBookCopyId())
            .qrCode(bookCopy.getQrCode())
            .status(convertBookStatus(bookCopy.getStatus()))
            .shelfLocation(bookCopy.getShelfLocation())
            .borrowingCount(bookCopy.getBorrowings() != null ? (long) bookCopy.getBorrowings().size() : 0L)
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
    public static class LibraryResponse {
        private UUID libraryId;
        private String name;
        private String code;
        private String address;
        
        public static LibraryResponse fromEntitySimple(com.university.library.entity.Library library) {
            if (library == null) {
                return null;
            }
            
            return LibraryResponse.builder()
                .libraryId(library.getLibraryId())
                .name(library.getName())
                .code(library.getCode())
                .address(library.getAddress())
                .build();
        }
    }
} 