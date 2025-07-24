package com.university.library.repository;

import com.university.library.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {
    
    /**
     * Tìm danh mục gốc (không có parent)
     */
    List<Category> findByParentCategoryIsNull();
    
    /**
     * Tìm danh mục con theo parent category ID
     */
    List<Category> findByParentCategoryCategoryId(UUID parentCategoryId);
    
    /**
     * Kiểm tra xem có danh mục nào có tên này không
     */
    boolean existsByName(String name);
    
    /**
     * Tìm danh mục theo tên
     */
    List<Category> findByNameContainingIgnoreCase(String name);
    
    /**
     * Tìm danh mục theo mô tả
     */
    List<Category> findByDescriptionContainingIgnoreCase(String description);
} 

