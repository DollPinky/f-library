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
     * Tìm thư viện theo tên
     */
    Library findByName(String name);

    /**
     * Tìm thư viện theo mã
     */
    Library findByCode(String code);
    
    /**
     * Tìm thư viện theo cơ sở
     */
    List<Library> findByCampusCampusId(UUID campusId);
    
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
     * Kiểm tra mã thư viện đã tồn tại chưa
     */
    boolean existsByCode(String code);
    
    /**
     * Tìm thư viện theo tên chứa từ khóa
     */
    List<Library> findByNameContainingIgnoreCase(String name);
    
    /**
     * Tìm thư viện theo mã chứa từ khóa
     */
    List<Library> findByCodeContainingIgnoreCase(String code);
    
    /**
     * Tìm thư viện theo địa chỉ chứa từ khóa
     */
    List<Library> findByAddressContainingIgnoreCase(String address);
    
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