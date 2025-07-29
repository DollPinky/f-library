package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.BookResponse;
import com.university.library.entity.Book;
import com.university.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookQueryService {


  private final BookRepository bookRepository;
  private final RestTemplate restTemplate;



  public List<BookResponse> getAllBooksFromApi() {
    String apiUrl = "http://localhost:8080/api/v1/books/all";
    ResponseEntity<BookResponse[]> response = restTemplate.getForEntity(apiUrl, BookResponse[].class);
    return Arrays.asList(response.getBody());
  }

      public BookResponse getBookById(UUID bookId) {
        log.info(BookConstants.LOG_GETTING_BOOK, bookId);
        
        // TEMPORARILY DISABLE CACHE
        // String cacheKey = BookConstants.CACHE_KEY_PREFIX_BOOK + bookId;
        // Optional<BookResponse> cachedResult = Optional.empty();
        // if (cachedResult.isPresent()) {
        //     log.debug(BookConstants.LOG_CACHE_HIT, bookId);
        //     return cachedResult.get();
        // }
        // log.debug(BookConstants.LOG_CACHE_MISS, bookId);
        
        BookResponse result = performGetBookById(bookId);
        
        // TEMPORARILY DISABLE CACHE
        // Duration localTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_LOCAL);
        // Duration distributedTtl = Duration.ofMinutes(BookConstants.CACHE_TTL_BOOK_DETAIL);
        // // CACHE DISABLED;
        
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
    
    // DISABLE CACHE - DIRECT DATABASE QUERY
    return performSearch(params);
  }

  public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
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
    log.info(BookConstants.SUCCESS_CACHE_CLEARED);
    // DISABLE CACHE - NO ACTION NEEDED
  }
  
  /**
   * Xóa cache cho một tìm kiếm cụ thể
   */
  public void clearSearchCache(BookSearchParams params) {
    log.info(BookConstants.LOG_CLEARING_SEARCH_CACHE, params);
    // DISABLE CACHE - NO ACTION NEEDED
  }
  
  /**
   * Xóa cache cho một book cụ thể
   */
  public void clearBookCache(UUID bookId) {
    log.info(BookConstants.LOG_CACHE_EVICTED, bookId);
    // DISABLE CACHE - NO ACTION NEEDED
  }
  
  /**
   * Xóa cache cho nhiều book
   */
  public void clearBooksCache(List<UUID> bookIds) {
    log.info(BookConstants.LOG_CLEARING_CACHE, bookIds.size());
    // DISABLE CACHE - NO ACTION NEEDED
  }
  
  /**
   * Kiểm tra xem book có trong cache không
   */
  public boolean isBookCached(UUID bookId) {
    // DISABLE CACHE - ALWAYS RETURN FALSE
    return false;
  }
  
  /**
   * Lấy TTL của book trong cache
   */
  public Long getBookCacheTtl(UUID bookId) {
    // DISABLE CACHE - ALWAYS RETURN NULL
    return null;
  }
}

