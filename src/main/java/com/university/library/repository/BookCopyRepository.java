package com.university.library.repository;

import com.university.library.entity.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
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
    
    /**
     * Tìm bản sao sách theo QR code
     */
    BookCopy findByQrCode(String qrCode);
    
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
} 