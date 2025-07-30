package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.BookCopySearchParams;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Book;
import com.university.library.entity.Library;
import com.university.library.repository.BookCopyRepository;
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

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookCopyQueryServiceTest {

    @Mock
    private BookCopyRepository bookCopyRepository;

    @InjectMocks
    private BookCopyQueryService bookCopyQueryService;

    private BookCopy testBookCopy;
    private Book testBook;
    private Library testLibrary;
    private UUID testBookCopyId;
    private UUID testBookId;
    private UUID testLibraryId;

    @BeforeEach
    void setUp() {
        testBookCopyId = UUID.randomUUID();
        testBookId = UUID.randomUUID();
        testLibraryId = UUID.randomUUID();

        testBook = Book.builder()
                .bookId(testBookId)
                .title("Test Book")
                .author("Test Author")
                .build();

        testLibrary = Library.builder()
                .libraryId(testLibraryId)
                .name("Test Library")
                .code("LIB001")
                .address("Test Address")
                .build();

        testBookCopy = BookCopy.builder()
                .bookCopyId(testBookCopyId)
                .book(testBook)
                .library(testLibrary)
                .qrCode("QR-123456")
                .status(BookCopy.BookStatus.AVAILABLE)
                .shelfLocation("A1-B2")
                .build();
        testBookCopy.setCreatedAt(Instant.now());
        testBookCopy.setUpdatedAt(Instant.now());
    }

    @Test
    void testGetBookCopyByIdReturnsValidResponse() {
        // Given
        when(bookCopyRepository.findById(testBookCopyId)).thenReturn(Optional.of(testBookCopy));

        // When
        BookCopyResponse result = bookCopyQueryService.getBookCopyById(testBookCopyId);

        // Then
        assertNotNull(result);
        assertEquals(testBookCopy.getBookCopyId(), result.getBookCopyId());
        assertEquals(testBookCopy.getQrCode(), result.getQrCode());
        assertEquals(BookCopyResponse.BookStatus.AVAILABLE, result.getStatus());
        assertEquals(testBookCopy.getShelfLocation(), result.getShelfLocation());
    }

    @Test
    void testSearchBookCopiesWithValidParamsReturnsPaginatedResults() {
        // Given
        BookCopySearchParams params = BookCopySearchParams.builder()
                .query("test")
                .page(0)
                .size(10)
                .sortBy("createdAt")
                .sortDirection("DESC")
                .build();

        List<BookCopy> bookCopies = Arrays.asList(testBookCopy);
        Page<BookCopy> bookCopyPage = new PageImpl<>(bookCopies, Pageable.ofSize(10), 1);

        when(bookCopyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(bookCopyPage);

        // When
        PagedResponse<BookCopyResponse> result = bookCopyQueryService.searchBookCopies(params);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testBookCopy.getQrCode(), result.getContent().get(0).getQrCode());
        assertEquals(0, result.getNumber());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetAvailableBookCopiesByBookIdReturnsOnlyAvailableCopies() {
        // Given
        List<BookCopy> availableBookCopies = Arrays.asList(testBookCopy);
        when(bookCopyRepository.findByBookBookIdAndStatus(testBookId, BookCopy.BookStatus.AVAILABLE))
                .thenReturn(availableBookCopies);

        // When
        List<BookCopyResponse> result = bookCopyQueryService.getAvailableBookCopiesByBookId(testBookId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testBookCopy.getBookCopyId(), result.get(0).getBookCopyId());
        assertEquals(BookCopyResponse.BookStatus.AVAILABLE, result.get(0).getStatus());
    }

    @Test
    void testGetBookCopyByIdThrowsExceptionWhenNotFound() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(bookCopyRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> bookCopyQueryService.getBookCopyById(nonExistentId));

        assertTrue(exception.getMessage().contains("Book copy not found with ID"));
        assertTrue(exception.getMessage().contains(nonExistentId.toString()));
    }

    @Test
    void testGetBookCopyByQrCodeThrowsExceptionWhenNotFound() {
        // Given
        String nonExistentQrCode = "NON-EXISTENT-QR";
        when(bookCopyRepository.findByQrCode(nonExistentQrCode)).thenReturn(null);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> bookCopyQueryService.getBookCopyByQrCode(nonExistentQrCode));

        assertTrue(exception.getMessage().contains("Book copy not found with QR code"));
        assertTrue(exception.getMessage().contains(nonExistentQrCode));
    }

    @Test
    void testSearchBookCopiesHandlesInvalidStatusGracefully() {
        // Given
        BookCopySearchParams params = BookCopySearchParams.builder()
                .status("INVALID_STATUS")
                .page(0)
                .size(10)
                .sortBy("createdAt")
                .sortDirection("DESC")
                .build();

        List<BookCopy> bookCopies = Arrays.asList(testBookCopy);
        Page<BookCopy> bookCopyPage = new PageImpl<>(bookCopies, Pageable.ofSize(10), 1);

        when(bookCopyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(bookCopyPage);

        // When
        PagedResponse<BookCopyResponse> result = bookCopyQueryService.searchBookCopies(params);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testBookCopy.getQrCode(), result.getContent().get(0).getQrCode());
    }
}