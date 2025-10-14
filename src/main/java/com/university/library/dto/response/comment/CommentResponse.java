package com.university.library.dto.response.comment;

import com.university.library.entity.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CommentResponse {

    private UUID commentId;
    private String content;
    private int star;
    private BookResponse bookResponse;
    private CategoryResponse   categoryResponse;
    private UserResponse   userResponse;
    private CampusResponse   campusResponse;
    private LocalDate createdAt;




    public static CommentResponse fromEnity(Comment comment) {
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .star(comment.getStar())
                .bookResponse(BookResponse.fromEntity(comment.getBook()))
                .campusResponse(CampusResponse.fromEntity(comment.getUser().getCampus()))
                .userResponse(UserResponse.fromEntity(comment.getUser()))
                .categoryResponse(CategoryResponse.fromEntity(comment.getBook().getCategory()))
                .createdAt(LocalDate.from(comment.getCreatedAt()))
                .build();
    }
@Data
@Builder
    public static  class  BookResponse {
        private UUID bookId;
        private String title;
        private String author;
        public static BookResponse fromEntity(Book book) {
            if (book == null) {
                return null;
            }
            return BookResponse.builder()
                    .bookId(book.getBookId())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .build();
        }
    }

    @Data
    @Builder
    public static  class  CategoryResponse {
        private UUID categoryId;
        private String name;
        private String description;
        public static CategoryResponse fromEntity(Category category) {
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
    public static class UserResponse {
        private UUID userId;
        private String fullName;
        private String department;
        public static UserResponse fromEntity(User user) {
            if (user == null) {
                return null;
            }
           return UserResponse.builder()
                   .userId(user.getUserId())
                   .fullName(user.getFullName())
                   .department(user.getDepartment())
                   .build();
        }

    }
    @Data
    @Builder
    public static class CampusResponse {
        private UUID campusId;
        private String name;
        private String code;
        private String address;
        public static CampusResponse fromEntity(Campus campus) {
            if (campus == null) {
                return null;
            }
            return CampusResponse.builder()
                    .campusId(campus.getCampusId())
                    .name(campus.getName())
                    .code(campus.getCode())
                    .address(campus.getAddress())
                    .build();
        }
    }
}



