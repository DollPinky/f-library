package com.university.library.service.query;

import com.university.library.annotation.MultiLayerCache;
import com.university.library.annotation.MultiLayerCacheEvict;
import com.university.library.base.PagedResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.entity.Book;
import com.university.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookQueryService {
    
    private final BookRepository bookRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Tìm kiếm sách với phân trang và cache
     */
    @MultiLayerCache(value = "books", key = "#params.hashCode()", localTtl = 5, distributedTtl = 15)
    public PagedResponse<Book> searchBooks(BookSearchParams params) {
        log.info("Searching books with params: {}", params);
        
        // Tạo cache key
        String cacheKey = "books:search:" + params.hashCode();
        
        // Kiểm tra cache
        PagedResponse<Book> cached = (PagedResponse<Book>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.info("Returning cached result for key: {}", cacheKey);
            return cached;
        }
        
        // Tạo specification cho search
        Specification<Book> spec = createSearchSpecification(params);
        
        // Tạo pageable
        Pageable pageable = PageRequest.of(
            params.getPage() != null ? params.getPage() : 0,
            params.getSize() != null ? params.getSize() : 20
        );
        
        // Query database
        Page<Book> books = bookRepository.findAll(spec, pageable);
        PagedResponse<Book> response = PagedResponse.fromPage(books);
        
        // Cache kết quả trong 10 phút
        redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(10));
        log.info("Cached search result for key: {}", cacheKey);
        
        return response;
    }
    
    /**
     * Lấy sách theo ID với cache
     */
    @MultiLayerCache(value = "books", key = "#id", localTtl = 10, distributedTtl = 30)
    public Book getBookById(UUID id) {
        log.info("Getting book by id: {}", id);
        return bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }
    
    /**
     * Lấy tất cả sách theo danh mục
     */
    @MultiLayerCache(value = "books", key = "'category:' + #categoryId", localTtl = 5, distributedTtl = 15)
    public List<Book> getBooksByCategory(UUID categoryId) {
        log.info("Getting books by category: {}", categoryId);
        return bookRepository.findByCategory_CategoryId(categoryId);
    }
    
    /**
     * Tìm kiếm sách theo từ khóa
     */
    @MultiLayerCache(value = "books", key = "'search:' + #keyword", localTtl = 5, distributedTtl = 15)
    public List<Book> searchBooksByKeyword(String keyword) {
        log.info("Searching books by keyword: {}", keyword);
        return bookRepository.searchByKeyword(keyword);
    }
    
    /**
     * Tạo specification cho search
     */
    private Specification<Book> createSearchSpecification(BookSearchParams params) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            
            // Search by title or author
            if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + params.getQuery().trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), searchTerm)
                ));
            }
            
            // Filter by category
            if (params.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("categoryId"), params.getCategoryId()));
            }
            
            // Book entity không có library field, chỉ có qua BookCopy
            // Filter by status - Book entity không có status field
            
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
} 