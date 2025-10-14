package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.constants.CommentConstants;
import com.university.library.dto.request.comment.CommentCreateRequest;
import com.university.library.dto.request.comment.CommentUpdateRequest;

import com.university.library.dto.response.comment.AvgRatingStarResponse;

import com.university.library.entity.User;

import com.university.library.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<StandardResponse> getComment(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam UUID bookId) {

        return ResponseEntity.ok(StandardResponse.
                success(
                        CommentConstants.GET_ALL_BY_BOOKID+bookId,
                        commentService.getAllComments(page,size,bookId))
                        );
    }
    @PostMapping("/create")
    public ResponseEntity<StandardResponse> createComment(
           @Valid @RequestBody CommentCreateRequest request,@AuthenticationPrincipal User user
    ){
        log.info("Nhân sách {}",request.getBookId());
        return ResponseEntity.ok(
                StandardResponse.
                        success(
                                CommentConstants.CREATE_COMMENT_SUCESSFULLY,
                                commentService.createComment(request,user))
                               );

    }
    @PutMapping("/update/{commentId}")
    public ResponseEntity<StandardResponse> updateComment(
            @PathVariable UUID commentId,
         @Valid   @RequestBody CommentUpdateRequest request){

        return ResponseEntity.ok(
                StandardResponse.
                        success(
                                CommentConstants.UPDATE_COMMENT_SUCESSFULLY,
                                commentService.updateComment(commentId,request)
                                )
                               );

    }
    @DeleteMapping("delete/{commentId}")
    public ResponseEntity<StandardResponse> deleteComment(@PathVariable UUID commentId){
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(
          StandardResponse.success(
                  CommentConstants.DELETE_COMMENT_SUCESSFULLY+commentId
                                 )

                                 );
    }

    /**
     * Lấy sách có lượt đánh giá cao nhất chức năng đề xuất sách
     */
    @GetMapping("/top-rated")
    public ResponseEntity<StandardResponse<List<AvgRatingStarResponse>>> getTopRatedBook(
            @RequestParam(defaultValue = "10") int limit) {
        List<AvgRatingStarResponse> rating = commentService.findTopRateBook(limit);
        return ResponseEntity.ok(StandardResponse.success(rating));
    }


}
