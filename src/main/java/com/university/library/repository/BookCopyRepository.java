package com.university.library.repository;

import com.university.library.entity.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    
    /**
     * Tìm bản sao theo sách
     */
    List<BookCopy> findByBookId(Long bookId);
    
    /**
     * Tìm bản sao theo sách và trạng thái
     */
    List<BookCopy> findByBookIdAndStatus(Long bookId, String status);
    
    /**
     * Tìm bản sao theo thư viện
     */
    List<BookCopy> findByLibraryId(Long libraryId);
    
    /**
     * Tìm bản sao theo QR code
     */
    BookCopy findByQrCode(String qrCode);
    
    /**
     * Đếm số bản sao theo sách
     */
    long countByBookId(Long bookId);
    
    /**
     * Đếm số bản sao có sẵn theo sách
     */
    long countByBookIdAndStatus(Long bookId, String status);
} 