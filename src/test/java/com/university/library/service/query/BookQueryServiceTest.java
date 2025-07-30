package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.BookResponse;
import com.university.library.entity.Book;
import com.university.library.entity.Category;
import com.university.library.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookQueryServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private BookQueryService bookQueryService;

    private Book testBook;
    private BookResponse testBookResponse;
    private UUID testBookId;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testBookId = UUID.randomUUID();
        testCategory = Category.builder()
                .categoryId(UUID.randomUUID())
                .name("Fiction")
                .description("Fiction books")
                .build();
        
        testBook = Book.builder()
                .bookId(testBookId)
                .title("Test Book")
                .author("Test Author")
                .publisher("Test Publisher")
                .year(2023)
                .isbn("978-0123456789")
                .description("Test Description")
                .category(testCategory)
                .bookCopies(new ArrayList<>())
                .build();
        testBook.setCreatedAt(Instant.now());
        testBook.setUpdatedAt(Instant.now());

        testBookResponse = BookResponse.fromEntity(testBook);
    }

    @Test
    void testSearchBooksReturnsPaginatedResults() {
        // Given
        BookSearchParams params = BookSearchParams.builder()
                .query("test")
                .page(0)
                .size(10)
                .build();

        List<Book> books = Arrays.asList(testBook);
        Page<Book> bookPage = new PageImpl<>(books, Pageable.ofSize(10), 1);

        when(bookRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(bookPage);

        // When
        PagedResponse<BookResponse> result = bookQueryService.searchBooks(params);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testBook.getTitle(), result.getContent().get(0).getTitle());
        assertEquals(0, result.getNumber());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetBookByIdReturnsBookResponse() {
        // Given
        when(bookRepository.findById(testBookId)).thenReturn(Optional.of(testBook));

        // When
        BookResponse result = bookQueryService.getBookById(testBookId);

        // Then
        assertNotNull(result);
        assertEquals(testBook.getBookId(), result.getBookId());
        assertEquals(testBook.getTitle(), result.getTitle());
        assertEquals(testBook.getAuthor(), result.getAuthor());
        assertEquals(testBook.getIsbn(), result.getIsbn());
    }

    @Test
    void testGetAllBooksFromApiReturnsBookList() {
        // Given
        BookResponse[] bookArray = {testBookResponse};
        ResponseEntity<BookResponse[]> responseEntity = ResponseEntity.ok(bookArray);
        
        when(restTemplate.getForEntity(anyString(), eq(BookResponse[].class)))
                .thenReturn(responseEntity);

        // When
        List<BookResponse> result = bookQueryService.getAllBooksFromApi();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testBookResponse.getTitle(), result.get(0).getTitle());
    }

    @Test
    void testGetBookByIdThrowsExceptionForNonExistentId() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(bookRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> bookQueryService.getBookById(nonExistentId));
        
        assertTrue(exception.getMessage().contains(BookConstants.ERROR_BOOK_NOT_FOUND));
        assertTrue(exception.getMessage().contains(nonExistentId.toString()));
    }

    @Test
    void testHandlesNullOrEmptyBookContent() {
        // Given
        BookSearchParams params = BookSearchParams.builder()
                .query("test")
                .page(0)
                .size(10)
                .build();

        Page<Book> emptyPage = new PageImpl<>(new ArrayList<>(), Pageable.ofSize(10), 0);
        when(bookRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(emptyPage);

        // When
        PagedResponse<BookResponse> result = bookQueryService.searchBooks(params);

        // Then
        assertNotNull(result);
        assertNotNull(result.getContent());
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void testSearchBooksAppliesDefaultParameters() {
        // Given
        BookSearchParams params = BookSearchParams.builder().build(); // No parameters set

        List<Book> books = Arrays.asList(testBook);
        Page<Book> bookPage = new PageImpl<>(books, Pageable.ofSize(BookConstants.DEFAULT_PAGE_SIZE), 1);

        when(bookRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(bookPage);

        // When
        PagedResponse<BookResponse> result = bookQueryService.searchBooks(params);

        // Then
        assertNotNull(result);
        assertEquals(BookConstants.DEFAULT_PAGE_NUMBER, result.getNumber());
        assertEquals(BookConstants.DEFAULT_PAGE_SIZE, result.getSize());
        assertEquals(1, result.getContent().size());
    }
}