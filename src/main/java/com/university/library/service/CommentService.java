package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.request.comment.CommentCreateRequest;
import com.university.library.dto.request.comment.CommentUpdateRequest;
import com.university.library.dto.response.borrowing.BorrowingStateResponse;
import com.university.library.dto.response.comment.AvgRatingStarResponse;
import com.university.library.dto.response.comment.CommentResponse;
import com.university.library.entity.User;
import org.springframework.data.domain.Pageable;

import javax.xml.stream.events.Comment;
import java.util.List;
import java.util.UUID;

public interface CommentService {

    CommentResponse createComment(CommentCreateRequest request, User user );
    PagedResponse<CommentResponse> getAllComments(int page, int size, UUID bookId);
    void deleteComment(UUID commentId);
    CommentResponse updateComment(UUID commentId, CommentUpdateRequest request);
    List<AvgRatingStarResponse> findTopRateBook(int limit);

}
