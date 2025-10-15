package com.university.library.dto.request.comment;

import com.university.library.constants.BookConstants;
import com.university.library.constants.CommentConstants;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CommentCreateRequest {

    @NotNull(message =  BookConstants.ERROR_BOOKID_INVALID)
    private UUID bookId;
    private String content;
    @Min(value = 1, message = CommentConstants.ERROR_COMMENT_STAR)
    @Max(value = 5, message = CommentConstants.ERROR_COMMENT_STAR)
    private int star;
}
