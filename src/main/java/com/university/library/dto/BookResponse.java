package com.university.library.dto;

import com.university.library.entity.Book;
import com.university.library.entity.BookCopy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private UUID bookId;
    private String title;
    private String author;
    private String publisher;
    private Integer year;
    private String isbn;
    private CategoryResponse category;
    private List<BookCopyResponse> bookCopies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static BookResponse fromEntity(Book book) {
        if (book == null) {
            return null;
        }
        
        return BookResponse.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .publisher(book.getPublisher())
            .year(book.getYear())
            .isbn(book.getIsbn())
            .category(book.getCategory() != null ? CategoryResponse.fromEntity(book.getCategory()) : null)
            .bookCopies(book.getBookCopies() != null ? 
                book.getBookCopies().stream()
                    .filter(bookCopy -> bookCopy != null) // Filter out null book copies
                    .map(bookCopy -> {
                        try {
                            return BookCopyResponse.fromEntity(bookCopy);
                        } catch (Exception e) {
                            return null; // Skip failed conversions
                        }
                    })
                    .filter(response -> response != null) // Filter out null responses
                    .collect(Collectors.toList()) : null)
            .createdAt(book.getCreatedAt())
            .updatedAt(book.getUpdatedAt())
            .build();
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private UUID categoryId;
        private String name;
        private String description;
        
        public static CategoryResponse fromEntity(com.university.library.entity.Category category) {
            if (category == null) {
                return null;
            }
            
            return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookCopyResponse {
        private UUID bookCopyId;
        private UUID bookId;
        private UUID libraryId;
        private String qrCode;
        private String status;
        private String shelfLocation;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static BookCopyResponse fromEntity(BookCopy bookCopy) {
            if (bookCopy == null) {
                return null;
            }
            
            return BookCopyResponse.builder()
                .bookCopyId(bookCopy.getBookCopyId())
                .bookId(bookCopy.getBook() != null ? bookCopy.getBook().getBookId() : null)
                .libraryId(bookCopy.getLibrary() != null ? bookCopy.getLibrary().getLibraryId() : null)
                .qrCode(bookCopy.getQrCode())
                .status(bookCopy.getStatus() != null ? bookCopy.getStatus().name() : null)
                .shelfLocation(bookCopy.getShelfLocation())
                .createdAt(bookCopy.getCreatedAt())
                .updatedAt(bookCopy.getUpdatedAt())
                .build();
        }
    }
} 