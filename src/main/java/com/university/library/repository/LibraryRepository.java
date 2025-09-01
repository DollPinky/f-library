package com.university.library.repository;

import com.university.library.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LibraryRepository extends JpaRepository<Library, UUID>, JpaSpecificationExecutor<Library> {

    /**
     * Tìm thư viện theo mã
     */
    Library findByCode(String code);
    
    /**
     * Tìm thư viện theo cơ sở
     */
    List<Library> findByCampusCampusId(UUID campusId);

    /**
     * Kiểm tra mã thư viện đã tồn tại chưa
     */
    boolean existsByCode(String code);

    /**
     * Đếm số bản sao sách theo thư viện
     */
    @Query("SELECT COUNT(bc) FROM BookCopy bc WHERE bc.library.libraryId = :libraryId")
    long countBooksByLibraryId(@Param("libraryId") UUID libraryId);
    
    /**
     * Đếm số nhân viên theo thư viện
     */
    @Query("SELECT COUNT(s) FROM Staff s WHERE s.library.libraryId = :libraryId")
    long countStaffByLibraryId(@Param("libraryId") UUID libraryId);
} 

