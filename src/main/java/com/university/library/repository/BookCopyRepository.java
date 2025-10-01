package com.university.library.repository;

import com.university.library.entity.Book;
import com.university.library.entity.BookCopy;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, UUID>, JpaSpecificationExecutor<BookCopy> {

    /**
     * Tìm bản sao sách theo sách
     */
    List<BookCopy> findByBookBookId(UUID bookId);


    BookCopy findByBookCopyId(UUID bookCopyId);
    /**
     * Tìm bản sao sách có thể mượn theo sách
     */
    List<BookCopy> findByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status);



    /**
     * Lấy tất cả book copies với eager loading cho book entity
     */
    @EntityGraph(attributePaths = {"book"})
    @Query("SELECT bc FROM BookCopy bc")
    List<BookCopy> findAllBookCopiesWithBook();

    List<BookCopy> findByBook_Category_CategoryId(UUID bookCategoryCategoryId);

    List<BookCopy> findByBook_(Book book);

    List<BookCopy> findByBook_Category_CategoryIdAndStatus(UUID bookCategoryCategoryId, BookCopy.BookStatus status);
}