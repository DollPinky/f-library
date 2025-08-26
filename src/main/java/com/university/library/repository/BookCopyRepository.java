package com.university.library.repository;

import com.university.library.entity.BookCopy;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, UUID>, JpaSpecificationExecutor<BookCopy> {

    /**
     * Tìm bản sao sách theo sách
     */
    List<BookCopy> findByBookBookId(UUID bookId);

    /**
     * Tìm bản sao sách theo thư viện
     */
    List<BookCopy> findByLibraryLibraryId(UUID libraryId);

    /**
     * Tìm bản sao sách theo trạng thái
     */
    List<BookCopy> findByStatus(BookCopy.BookStatus status);

    /**
     * Tìm bản sao sách có thể mượn theo sách
     */
    List<BookCopy> findByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status);

    /**
     * Tìm bản sao sách có thể mượn theo thư viện
     */
    List<BookCopy> findByLibraryLibraryIdAndStatus(UUID libraryId, BookCopy.BookStatus status);

    /**
     * Kiểm tra xem có bản sao nào có QR code này không
     */
    boolean existsByQrCode(String qrCode);

    @Query("SELECT bc FROM BookCopy bc WHERE bc.qrCode = :qrCode")
    BookCopy findByQrCode(@Param("qrCode") String qrCode);

    /**
     * Tìm bản sao sách theo vị trí kệ
     */
    List<BookCopy> findByShelfLocationContainingIgnoreCase(String shelfLocation);

    /**
     * Đếm số bản sao sách theo trạng thái
     */
    long countByStatus(BookCopy.BookStatus status);

    /**
     * Đếm số bản sao sách theo sách và trạng thái
     */
    long countByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status);

    /**
     * Lấy tất cả book copies với eager loading cho book entity
     */
    @EntityGraph(attributePaths = {"book"})
    @Query("SELECT bc FROM BookCopy bc")
    List<BookCopy> findAllBookCopiesWithBook();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT bc FROM BookCopy bc WHERE bc.qrCode = :qrCode")
    BookCopy findByQrCodeWithLock(String qrCode);
}