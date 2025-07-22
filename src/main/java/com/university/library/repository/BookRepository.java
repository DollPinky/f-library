package com.university.library.repository;

import com.university.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    
    /**
     * Tìm sách theo danh mục
     */
    List<Book> findByCategoryId(Long categoryId);
    
    /**
     * Tìm sách theo thư viện
     */
    List<Book> findByLibraryId(Long libraryId);
    
    /**
     * Tìm sách theo trạng thái
     */
    List<Book> findByStatus(String status);
    
    /**
     * Tìm sách theo ISBN
     */
    Book findByIsbn(String isbn);
    
    /**
     * Tìm kiếm sách theo từ khóa (title, author, isbn)
     */
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Kiểm tra ISBN đã tồn tại chưa
     */
    boolean existsByIsbn(String isbn);
    
    /**
     * Đếm số sách theo danh mục
     */
    long countByCategoryId(Long categoryId);
    
    /**
     * Đếm số sách theo thư viện
     */
    long countByLibraryId(Long libraryId);
} 