package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.BookResponse;
import com.university.library.entity.Book;
import com.university.library.repository.BookRepository;
import com.university.library.service.ManualCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookQueryService {

  private final BookRepository bookRepository;
  private final ManualCacheService cacheService;

  public BookResponse getBookById(UUID bookId) {
    log.info(BookConstants.LOG_GETTING_BOOK, bookId);
    
    String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookId;
    
    // Thử lấy từ cache trước
    Optional<BookResponse> cachedResult = cacheService.get(BookConstants.CACHE_NAME, cacheKey, BookResponse.class);
    if (cachedResult.isPresent()) {
      log.debug(BookConstants.LOG_CACHE_HIT, bookId);
      return cachedResult.get();
    }
    
    // Nếu không có trong cache, thực hiện tìm kiếm từ database
    log.debug(BookConstants.LOG_CACHE_MISS, bookId);
    BookResponse result = performGetBookById(bookId);
    
    // Lưu kết quả vào cache
    Duration localTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_LOCAL);
    Duration distributedTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_BOOK_DETAIL);
    cacheService.put(BookConstants.CACHE_NAME, cacheKey, result, localTtl, distributedTtl);
    
    return result;
  }
  
  private BookResponse performGetBookById(UUID bookId) {
    Book book = bookRepository.findById(bookId)
        .orElseThrow(() -> {
          log.error(BookConstants.ERROR_BOOK_NOT_FOUND + bookId);
          return new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId);
        });
    
    return BookResponse.fromEntity(book);
  }

  public PagedResponse<BookResponse> searchBooks(BookSearchParams params) {
    log.info(BookConstants.LOG_SEARCHING_BOOKS, params);
    
    String cacheKey = generateCacheKey(params);
    
    Optional<PagedResponse> cachedResult = cacheService.get(BookConstants.CACHE_NAME, cacheKey, PagedResponse.class);
    if (cachedResult.isPresent()) {
      log.debug(BookConstants.LOG_CACHE_HIT_SEARCH, cacheKey);
      return (PagedResponse<BookResponse>) cachedResult.get();
    }
    
    log.debug(BookConstants.LOG_CACHE_MISS_SEARCH, cacheKey);
    PagedResponse<BookResponse> result = performSearch(params);
    
    Duration localTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_LOCAL);
    Duration distributedTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_BOOK_SEARCH);
    cacheService.put(BookConstants.CACHE_NAME, cacheKey, result, localTtl, distributedTtl);
    
    return result;
  }
  
  private PagedResponse<BookResponse> performSearch(BookSearchParams params) {
    Pageable pageable = PageRequest.of(
        params.getPage() != null ? params.getPage() : BookConstants.DEFAULT_PAGE_NUMBER,
        params.getSize() != null ? params.getSize() : BookConstants.DEFAULT_PAGE_SIZE,
        Sort.by(BookConstants.DEFAULT_SORT_FIELD).descending()
    );

    String keyword = params.getQuery() != null ? params.getQuery() : "";
    Page<Book> bookPage = bookRepository.searchByKeyword(keyword, pageable);
    
    // Safe stream processing with null check
    List<BookResponse> bookResponses = bookPage.getContent() != null ? 
        bookPage.getContent().stream()
            .filter(book -> book != null) // Filter out null books
            .map(book -> {
                try {
                    return BookResponse.fromEntity(book);
                } catch (Exception e) {
                    log.warn("Failed to convert book to response: {}", book != null ? book.getBookId() : "null", e);
                    return null;
                }
            })
            .filter(response -> response != null) // Filter out null responses
            .collect(Collectors.toList()) : 
        new ArrayList<>();
    
    // Ensure content is never null
    if (bookResponses == null) {
        bookResponses = new ArrayList<>();
    }
    
    // Use PagedResponse.of() method for safe construction
    return PagedResponse.of(
        bookResponses,
        bookPage.getNumber(),
        bookPage.getSize(),
        bookPage.getTotalElements()
    );
  }
  
  private String generateCacheKey(BookSearchParams params) {
    StringBuilder keyBuilder = new StringBuilder();
    keyBuilder.append(BookConstants.CACHE_KEY_PREFIX_SEARCH);
    keyBuilder.append(BookConstants.CACHE_KEY_PATTERN_PAGE).append(params.getPage() != null ? params.getPage() : BookConstants.DEFAULT_PAGE_NUMBER);
    keyBuilder.append(BookConstants.CACHE_KEY_SEPARATOR).append(BookConstants.CACHE_KEY_PATTERN_SIZE).append(params.getSize() != null ? params.getSize() : BookConstants.DEFAULT_PAGE_SIZE);
    keyBuilder.append(BookConstants.CACHE_KEY_SEPARATOR).append(BookConstants.CACHE_KEY_PATTERN_QUERY).append(params.getQuery() != null ? params.getQuery() : "");
    return keyBuilder.toString();
  }
  
  /**
   * Xóa cache cho tìm kiếm sách
   */
  public void clearSearchCache() {
    cacheService.evictAll(BookConstants.CACHE_NAME);
    log.info(BookConstants.SUCCESS_CACHE_CLEARED);
  }
  
  /**
   * Xóa cache cho một tìm kiếm cụ thể
   */
  public void clearSearchCache(BookSearchParams params) {
    String cacheKey = generateCacheKey(params);
    cacheService.evict(BookConstants.CACHE_NAME, cacheKey);
    log.info(BookConstants.LOG_CLEARING_SEARCH_CACHE, cacheKey);
  }
  
  /**
   * Xóa cache cho một book cụ thể
   */
  public void clearBookCache(UUID bookId) {
    String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookId;
    cacheService.evict(BookConstants.CACHE_NAME, cacheKey);
    log.info(BookConstants.LOG_CACHE_EVICTED, bookId);
  }
  
  /**
   * Xóa cache cho nhiều book
   */
  public void clearBooksCache(List<UUID> bookIds) {
    for (UUID bookId : bookIds) {
      clearBookCache(bookId);
    }
    log.info(BookConstants.LOG_CLEARING_CACHE, bookIds.size());
  }
  
  /**
   * Kiểm tra xem book có trong cache không
   */
  public boolean isBookCached(UUID bookId) {
    String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookId;
    return cacheService.exists(BookConstants.CACHE_NAME, cacheKey);
  }
  
  /**
   * Lấy TTL của book trong cache
   */
  public Long getBookCacheTtl(UUID bookId) {
    String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookId;
    return cacheService.getTtl(BookConstants.CACHE_NAME, cacheKey);
  }
}