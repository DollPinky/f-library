package com.university.library.repository;

import com.university.library.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LibraryRepository extends JpaRepository<Library, UUID> {
    
    /**
     * Tìm thư viện theo tên
     */
    Library findByName(String name);

    List<Library> findByCampus_CampusId(UUID campusCampusId);
    
    /**
     * Tìm thư viện theo tên campus
     */
    List<Library> findByCampusName(String campusName);
    
    /**
     * Tìm thư viện theo code campus
     */
    List<Library> findByCampusCode(String campusCode);
    
    /**
     * Kiểm tra tên thư viện đã tồn tại chưa
     */
    boolean existsByName(String name);
    
    /**
     * Đếm số bản sao sách theo thư viện
     */
    @Query("SELECT COUNT(bc) FROM BookCopy bc WHERE bc.library.libraryId = :libraryId")
    long countBooksByLibraryId(@Param("libraryId") UUID libraryId);
} 