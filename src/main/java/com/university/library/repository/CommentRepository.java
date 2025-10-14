package com.university.library.repository;

import com.university.library.dto.response.comment.AvgRatingStarResponse;
import com.university.library.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    Page<Comment> findAllByBook_BookId(UUID bookBookId, Pageable pageable);

    @Query("""
    SELECT new com.university.library.dto.response.comment.AvgRatingStarResponse(
        b.bookId, b.author, b.description, b.title, b.language, b.publisher, b.year,
        CAST(COALESCE(AVG(CAST(c.star AS double)), 0.0) AS double)
    )
    FROM Book b
    LEFT JOIN b.comments c
    GROUP BY b.bookId, b.author, b.description, b.title, b.language, b.publisher, b.year
    ORDER BY COALESCE(AVG(c.star), 0.0) DESC
""")
    List<AvgRatingStarResponse> findTopRateBook(Pageable pageable);

}
