package com.university.library.repository;

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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, UUID>, JpaSpecificationExecutor<Borrowing> {
    
    /**
     * Tìm tất cả borrowings của một người dùng
     */
    List<Borrowing> findByBorrowerUserId(UUID borrowerId);
    
    /**
     * Tìm borrowings theo trạng thái
     */
    List<Borrowing> findByStatus(Borrowing.BorrowingStatus status);
    
    /**
     * Tìm borrowings theo trạng thái với pagination
     */
    Page<Borrowing> findByStatus(Borrowing.BorrowingStatus status, Pageable pageable);
    
    /**
     * Tìm borrowings theo query với pagination
     */
    @Query("SELECT b FROM Borrowing b WHERE " +
           "LOWER(b.bookCopy.book.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.bookCopy.book.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.borrower.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.borrower.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.bookCopy.qrCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Borrowing> findByQuery(@Param("query") String query, Pageable pageable);
    
    /**
     * Tìm borrowings theo trạng thái và query với pagination
     */
    @Query("SELECT b FROM Borrowing b WHERE b.status = :status AND (" +
           "LOWER(b.bookCopy.book.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.bookCopy.book.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.borrower.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.borrower.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.bookCopy.qrCode) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Borrowing> findByStatusAndQuery(@Param("status") Borrowing.BorrowingStatus status, 
                                        @Param("query") String query, Pageable pageable);
    
    /**
     * Tìm borrowings quá hạn
     */
    @Query("SELECT b FROM Borrowing b WHERE b.status = 'BORROWED' AND b.dueDate < :now")
    List<Borrowing> findOverdueBorrowings(@Param("now") Instant now);
    
    /**
     * Tìm borrowings của một book copy
     */
    List<Borrowing> findByBookCopyBookCopyId(UUID bookCopyId);
    
    /**
     * Kiểm tra xem book copy có đang được mượn không
     */
    @Query("SELECT COUNT(b) > 0 FROM Borrowing b WHERE b.bookCopy.bookCopyId = :bookCopyId AND b.status IN ('BORROWED', 'RESERVED')")
    boolean isBookCopyCurrentlyBorrowed(@Param("bookCopyId") UUID bookCopyId);
    
    /**
     * Tìm borrowings theo thời gian
     */
    @Query("SELECT b FROM Borrowing b WHERE b.borrowedDate BETWEEN :startDate AND :endDate")
    List<Borrowing> findByBorrowedDateBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
    
    /**
     * Đếm số sách đang mượn của một người dùng (bao gồm cả chờ xác nhận)
     */
    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.borrower.userId = :borrowerId AND b.status IN ('BORROWED', 'PENDING_LIBRARIAN')")
    long countActiveBorrowingsByBorrower(@Param("borrowerId") UUID borrowerId);
    
    /**
     * Tìm borrowings với pagination
     */
    Page<Borrowing> findByBorrowerUserId(UUID borrowerId, Pageable pageable);
    
    /**
     * Tìm borrowings theo thư viện
     */
    @Query("SELECT b FROM Borrowing b WHERE b.bookCopy.library.libraryId = :libraryId")
    List<Borrowing> findByLibraryId(@Param("libraryId") UUID libraryId);
    
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

    boolean existsByBorrowerUserIdAndBookCopyBookCopyIdAndStatus(
            UUID borrowerId,
            UUID bookCopyId,
            Borrowing.BorrowingStatus status
    );
} 