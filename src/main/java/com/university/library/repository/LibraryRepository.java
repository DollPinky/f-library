package com.university.library.repository;

import com.university.library.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Long> {
    
    /**
     * Tìm thư viện theo tên
     */
    Library findByName(String name);
    
    /**
     * Tìm thư viện theo campus
     */
    List<Library> findByCampusId(Long campusId);
    
    /**
     * Tìm thư viện theo thành phố
     */
    List<Library> findByCampusCity(String city);
    
    /**
     * Kiểm tra tên thư viện đã tồn tại chưa
     */
    boolean existsByName(String name);
    
    /**
     * Đếm số sách theo thư viện
     */
    long countBooksByLibraryId(Long libraryId);
} 