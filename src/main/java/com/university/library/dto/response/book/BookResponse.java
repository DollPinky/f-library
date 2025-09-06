package com.university.library.dto.response.book;

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
    private String description;
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
            .description(book.getDescription())
            .category(book.getCategory() != null ? CategoryResponse.fromEntity(book.getCategory()) : null)
            .bookCopies(book.getBookCopies() != null ?
                book.getBookCopies().stream()
                    .filter(bookCopy -> bookCopy != null)
                    .map(bookCopy -> {
                        try {
                            return BookCopyResponse.fromEntity(bookCopy);
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(response -> response != null)
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
        private String bookCopyId;
        private UUID bookId;
        private UUID campusId;
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
                .campusId(bookCopy.getCampus() != null ? bookCopy.getCampus().getCampusId() : null)
                .status(bookCopy.getStatus() != null ? bookCopy.getStatus().name() : null)
                .shelfLocation(bookCopy.getShelfLocation())
                .createdAt(bookCopy.getCreatedAt())
                .updatedAt(bookCopy.getUpdatedAt())
                .build();
        }
    }

    public String toEmbeddingText(Book book) {
        return """
        Title: %s
        Author: %s
        Publisher: %s
        Year: %s
        Description: %s
        Category: %s
        """.formatted(
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getYear(),
                book.getDescription(),
                book.getCategory() != null ? book.getCategory().getName() : ""
        );
    }

}

