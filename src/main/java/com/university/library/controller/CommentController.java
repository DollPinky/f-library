package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.constants.CommentConstants;
import com.university.library.dto.request.comment.CommentCreateRequest;
import com.university.library.dto.request.comment.CommentUpdateRequest;
import com.university.library.entity.Comment;
import com.university.library.entity.User;
import com.university.library.repository.CommentRepository;
import com.university.library.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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


}
