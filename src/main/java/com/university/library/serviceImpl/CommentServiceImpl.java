package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.constants.CommentConstants;
import com.university.library.dto.request.comment.CommentCreateRequest;
import com.university.library.dto.request.comment.CommentUpdateRequest;
import com.university.library.dto.response.comment.CommentResponse;
import com.university.library.entity.Book;
import com.university.library.entity.Comment;
import com.university.library.entity.User;
import com.university.library.exception.exceptions.NotFoundException;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CommentRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.CommentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    @Transactional
    public CommentResponse createComment(CommentCreateRequest request,User userRequest) {


        Book book = bookRepository.findById(request.getBookId()).orElseThrow(() ->
                new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND+ request.getBookId()));
      if(userRequest == null) {
          throw  new RuntimeException("User not found");
      }
      User user = userRepository.findByEmail(userRequest.getUsername()).orElseThrow(()->
          new RuntimeException("User not found")
      );
      Comment comment = Comment.builder()
                               .book(book)
                               .user(user)
                               .content(request.getContent())
                               .star(request.getStar())
                               .build();
     Comment commentSave =  commentRepository.save(comment);
     userRepository.save(user);
     bookRepository.save(book);
     return CommentResponse.fromEnity(commentSave);
    }

    @Override
    public PagedResponse<CommentResponse> getAllComments(int page, int size, UUID bookId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> commentPage = commentRepository.findAllByBook_BookId(bookId,pageable);
        List<CommentResponse> list = commentPage.stream()
                .map(CommentResponse::fromEnity)
                .collect(Collectors.toList());


        return PagedResponse.of(list,page,size,commentPage.getTotalElements());

    }

    @Override
    public void deleteComment(UUID commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    public CommentResponse updateComment(UUID commentId, CommentUpdateRequest request) {

        Comment comment = commentRepository.findById(commentId).orElseThrow(()->
                  new NotFoundException(CommentConstants.ERROR_COMMENT_NOT_FOUND + commentId)
         );
        comment.setStar(request.getStar());
        comment.setContent(request.getContent());
        return CommentResponse.fromEnity(commentRepository.save(comment));
    }
}
