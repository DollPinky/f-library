package com.university.library.repository;

import com.university.library.entity.BookCopy;
import com.university.library.entity.BookCopy.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, UUID> {

    /**
     * Tìm bản sao theo sách
     */
    List<BookCopy> findByBookBookId(UUID bookId);
    
    /**
     * Tìm bản sao theo sách và trạng thái
     */
    List<BookCopy> findByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status);
    
    /**
     * Tìm bản sao theo thư viện
     */
    List<BookCopy> findByLibraryLibraryId(UUID libraryId);
    
    /**
     * Tìm bản sao theo QR code
     */
    BookCopy findByQrCode(String qrCode);
    
    /**
     * Đếm số bản sao theo sách
     */
    long countByBookBookId(UUID bookId);
    
    /**
     * Đếm số bản sao có sẵn theo sách
     */
    long countByBookBookIdAndStatus(UUID bookId, BookCopy.BookStatus status);
    
    /**
     * Tìm bản sao có sẵn theo thư viện
     */
    List<BookCopy> findByLibraryLibraryIdAndStatus(UUID libraryId, BookCopy.BookStatus status);
    
    /**
     * Tìm bản sao theo trạng thái
     */
    List<BookCopy> findByStatus(BookCopy.BookStatus status);
} 