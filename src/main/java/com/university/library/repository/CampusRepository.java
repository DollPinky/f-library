package com.university.library.repository;

import com.university.library.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CampusRepository extends JpaRepository<Campus, UUID> {
    
    /**
     * Tìm campus theo mã
     */
    Campus findByCode(String code);
    
    /**
     * Kiểm tra mã campus đã tồn tại chưa
     */
    boolean existsByCode(String code);
} 