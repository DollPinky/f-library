package com.university.library.repository;

import com.university.library.dto.response.borrowing.BorrowingStateResponse;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Borrowing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, UUID>, JpaSpecificationExecutor<Borrowing> {

    /**
     * Find borrowings by status with pagination
     */
    Page<Borrowing> findByStatus(Borrowing.BorrowingStatus status, Pageable pageable);
    
    /**
     * Find borrowings by query with pagination
     */
    @Query("SELECT b FROM Borrowing b WHERE " +
           "LOWER(b.bookCopy.book.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.bookCopy.book.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Borrowing> findByQuery(@Param("query") String query, Pageable pageable);
    
    /**
     * Find borrowings by status and query with pagination
     */
    @Query("SELECT b FROM Borrowing b WHERE b.status = :status AND (" +
           "LOWER(b.bookCopy.book.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.bookCopy.book.author) LIKE LOWER(CONCAT('%', :query, '%')) )")
    Page<Borrowing> findByStatusAndQuery(@Param("status") Borrowing.BorrowingStatus status, 
                                        @Param("query") String query, Pageable pageable);
    
    /**
     * Find overdue borrowings
     */
    @Query("SELECT b FROM Borrowing b WHERE b.status = 'BORROWED' AND b.dueDate < :now")
    List<Borrowing> findOverdueBorrowings(@Param("now") Instant now);
    

    /**
     * Count active borrowings by borrower
     */
//    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.borrower.company_account = :companyAccount AND b.status IN ('BORROWED')")
//    long countActiveBorrowingsByBorrower(@Param("companyAccount") String companyAccount);
    
    /**
     * Find borrowings by borrower with pagination
     */
    Page<Borrowing> findByCompanyAccount(String companyAccount, Pageable pageable);
    

    
    /**
     * Tìm tất cả borrowings với pagination
     */
    Page<Borrowing> findAll(Pageable pageable);

    /**
      Tìm Borrowing mới nhất dựa theo bookCopy và Status
     */
    Optional<Borrowing> findTopByBookCopyAndStatusOrderByCreatedAtDesc(
            BookCopy bookCopy,
            Borrowing.BorrowingStatus status
    );

    boolean existsByCompanyAccountAndBookCopyBookCopyIdAndStatus(
            String companyAccount,
            UUID bookCopyId,
            Borrowing.BorrowingStatus status
    );
// lay danh sach cac book duoc muon nhieu nhat
    @Query("""
                SELECT new com.university.library.dto.response.borrowing.BorrowingStateResponse(
                    b.bookId, b.author, b.description, b.title, b.language, b.publisher, b.year, COUNT(br.bookCopy.bookCopyId)
                )
                FROM Book b
                JOIN b.bookCopies bc
                JOIN bc.borrowings br
                GROUP BY b.bookId, b.author, b.description, b.title, b.language, b.publisher, b.year
                ORDER BY COUNT(br.bookCopy.bookCopyId) DESC
            """)
    List<BorrowingStateResponse> findMostBorrowedBooks(Pageable pageable);

    //lay lich su ai da muon sach
    Page<Borrowing> findBorrowingByBookCopy_BookCopyId(UUID bookCopyId, Pageable pageable);

    int countByBorrowedDateIsBetween(LocalDateTime borrowedDateAfter, LocalDateTime borrowedDateBefore);

    int countByReturnedDateIsBetween(LocalDateTime returnedDateAfter, LocalDateTime returnedDateBefore);
}