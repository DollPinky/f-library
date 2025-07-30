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
import org.springframework.data.jpa.domain.Specification;
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
    
    BookResponse result = performGetBookById(bookId);
    
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

    // Create specification for filtering
    Specification<Book> spec = createSearchSpecification(params);
    
    Page<Book> bookPage = bookRepository.findAll(spec, pageable);
    
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

  /**
   * Create specification for search and filtering
   */
  private Specification<Book> createSearchSpecification(BookSearchParams params) {
    return (root, query, criteriaBuilder) -> {
      var predicates = new ArrayList<jakarta.persistence.criteria.Predicate>();
      
      // Handle keyword search
      if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
        String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
        predicates.add(criteriaBuilder.or(
          criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), searchTerm),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), searchTerm)
        ));
      }
      
      if (params.getCategoryId() != null) {
        predicates.add(criteriaBuilder.equal(root.get("category").get("categoryId"), params.getCategoryId()));
      }
      
      return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
    };
  }
}

