package com.university.library.repository;

import com.university.library.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Tìm danh mục theo tên
     */
    Category findByName(String name);
    
    /**
     * Tìm danh mục con theo parent ID
     */
    List<Category> findByParentId(Long parentId);
    
    /**
     * Tìm danh mục gốc (không có parent)
     */
    List<Category> findByParentIdIsNull();
    
    /**
     * Kiểm tra tên danh mục đã tồn tại chưa
     */
    boolean existsByName(String name);
    
    /**
     * Đếm số sách theo danh mục
     */
    long countBooksByCategoryId(Long categoryId);
} 