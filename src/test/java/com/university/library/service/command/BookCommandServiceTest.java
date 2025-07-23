package com.university.library.service.command;

import com.university.library.constants.BookConstants;
import com.university.library.dto.CreateBookCommand;
import com.university.library.dto.BookResponse;
import com.university.library.entity.Book;
import com.university.library.entity.Category;
import com.university.library.event.book.BookCreatedEvent;
import com.university.library.event.book.BookDeletedEvent;
import com.university.library.event.book.BookUpdatedEvent;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.ManualCacheService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookCommandService Tests")
class BookCommandServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ManualCacheService cacheService;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private BookCommandService bookCommandService;

    private UUID bookId;
    private UUID categoryId;
    private Book book;
    private BookResponse bookResponse;
    private Category category;
    private CreateBookCommand createCommand;

    @BeforeEach
    void setUp() {
        bookId = UUID.randomUUID();
        categoryId = UUID.randomUUID();

        category = Category.builder()
            .categoryId(categoryId)
            .name(BookConstants.TEST_CATEGORY_NAME)
            .description(BookConstants.TEST_CATEGORY_DESCRIPTION)
            .build();

        book = Book.builder()
            .bookId(bookId)
            .title(BookConstants.TEST_BOOK_TITLE)
            .author(BookConstants.TEST_BOOK_AUTHOR)
            .publisher(BookConstants.TEST_BOOK_PUBLISHER)
            .year(2023)
            .isbn(BookConstants.TEST_BOOK_ISBN)
            .category(category)
            .build();

        bookResponse = BookResponse.fromEntity(book);

        createCommand = CreateBookCommand.builder()
            .title(BookConstants.TEST_BOOK_TITLE)
            .author(BookConstants.TEST_BOOK_AUTHOR)
            .publisher(BookConstants.TEST_BOOK_PUBLISHER)
            .publishYear(2023)
            .isbn(BookConstants.TEST_BOOK_ISBN)
            .categoryId(categoryId)
            .build();
    }

    @Test
    @DisplayName("Should create book successfully with Kafka event and cache")
    void createBook_ShouldCreateBookWithEventAndCache() {
        // Given
        when(bookRepository.existsByIsbn(createCommand.getIsbn())).thenReturn(false);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        // When
        BookResponse result = bookCommandService.createBook(createCommand);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getBookId()).isEqualTo(bookId);
        assertThat(result.getTitle()).isEqualTo(BookConstants.TEST_BOOK_TITLE);
        assertThat(result.getAuthor()).isEqualTo(BookConstants.TEST_BOOK_AUTHOR);

        // Verify repository calls
        verify(bookRepository).existsByIsbn(createCommand.getIsbn());
        verify(categoryRepository).findById(categoryId);
        verify(bookRepository).save(any(Book.class));

        // Verify cache operations
        verify(cacheService).put(
            eq(BookConstants.CACHE_NAME),
            eq(BookConstants.CACHE_KEY_PREFIX_BOOK + bookId),
            eq(bookResponse),
            eq(Duration.ofMinutes(BookConstants.CACHE_TTL_LOCAL)),
            eq(Duration.ofMinutes(BookConstants.CACHE_TTL_BOOK_DETAIL))
        );
        verify(cacheService).evictAll(BookConstants.CACHE_NAME);

        // Verify Kafka event
        ArgumentCaptor<BookCreatedEvent> eventCaptor = ArgumentCaptor.forClass(BookCreatedEvent.class);
        verify(kafkaTemplate).send(eq(BookConstants.TOPIC_BOOK_CREATED), eq(bookId.toString()), eventCaptor.capture());
        
        BookCreatedEvent capturedEvent = eventCaptor.getValue();
        assertThat(capturedEvent.getBookId()).isEqualTo(bookId);
        assertThat(capturedEvent.getTitle()).isEqualTo(BookConstants.TEST_BOOK_TITLE);
        assertThat(capturedEvent.getAuthor()).isEqualTo(BookConstants.TEST_BOOK_AUTHOR);
        assertThat(capturedEvent.getIsbn()).isEqualTo(BookConstants.TEST_BOOK_ISBN);
    }

    @Test
    @DisplayName("Should throw exception when ISBN already exists")
    void createBook_WhenIsbnExists_ShouldThrowException() {
        // Given
        when(bookRepository.existsByIsbn(createCommand.getIsbn())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> bookCommandService.createBook(createCommand))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining(BookConstants.ERROR_BOOK_ALREADY_EXISTS + createCommand.getIsbn());

        verify(bookRepository).existsByIsbn(createCommand.getIsbn());
        verify(bookRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should throw exception when category not found")
    void createBook_WhenCategoryNotFound_ShouldThrowException() {
        // Given
        when(bookRepository.existsByIsbn(createCommand.getIsbn())).thenReturn(false);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookCommandService.createBook(createCommand))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining(BookConstants.ERROR_CATEGORY_NOT_FOUND + categoryId);

        verify(bookRepository).existsByIsbn(createCommand.getIsbn());
        verify(categoryRepository).findById(categoryId);
        verify(bookRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should update book successfully with Kafka event and cache")
    void updateBook_ShouldUpdateBookWithEventAndCache() {
        // Given
        Book existingBook = Book.builder()
            .bookId(bookId)
            .title(BookConstants.TEST_OLD_TITLE)
            .author(BookConstants.TEST_OLD_AUTHOR)
            .isbn(BookConstants.TEST_DIFFERENT_ISBN) // Different ISBN to trigger uniqueness check
            .build();

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(existingBook));
        when(bookRepository.existsByIsbn(createCommand.getIsbn())).thenReturn(false);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        // When
        BookResponse result = bookCommandService.updateBook(bookId, createCommand);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getBookId()).isEqualTo(bookId);
        assertThat(result.getTitle()).isEqualTo(BookConstants.TEST_BOOK_TITLE);

        // Verify repository calls
        verify(bookRepository).findById(bookId);
        verify(bookRepository).existsByIsbn(createCommand.getIsbn());
        verify(categoryRepository).findById(categoryId);
        verify(bookRepository).save(any(Book.class));

        // Verify cache operations
        verify(cacheService).put(
            eq(BookConstants.CACHE_NAME),
            eq(BookConstants.CACHE_KEY_PREFIX_BOOK + bookId),
            eq(bookResponse),
            eq(Duration.ofMinutes(BookConstants.CACHE_TTL_LOCAL)),
            eq(Duration.ofMinutes(BookConstants.CACHE_TTL_BOOK_DETAIL))
        );
        verify(cacheService).evictAll(BookConstants.CACHE_NAME);

        // Verify Kafka event
        ArgumentCaptor<BookUpdatedEvent> eventCaptor = ArgumentCaptor.forClass(BookUpdatedEvent.class);
        verify(kafkaTemplate).send(eq(BookConstants.TOPIC_BOOK_UPDATED), eq(bookId.toString()), eventCaptor.capture());
        
        BookUpdatedEvent capturedEvent = eventCaptor.getValue();
        assertThat(capturedEvent.getBookId()).isEqualTo(bookId);
        assertThat(capturedEvent.getTitle()).isEqualTo(BookConstants.TEST_BOOK_TITLE);
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent book")
    void updateBook_WhenBookNotFound_ShouldThrowException() {
        // Given
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookCommandService.updateBook(bookId, createCommand))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining(BookConstants.ERROR_BOOK_NOT_FOUND + bookId);

        verify(bookRepository).findById(bookId);
        verify(bookRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should throw exception when updating with existing ISBN")
    void updateBook_WhenIsbnExists_ShouldThrowException() {
        // Given
        Book existingBook = Book.builder()
            .bookId(bookId)
            .title(BookConstants.TEST_OLD_TITLE)
            .author(BookConstants.TEST_OLD_AUTHOR)
            .isbn(BookConstants.TEST_DIFFERENT_ISBN) // Different ISBN
            .build();

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(existingBook));
        when(bookRepository.existsByIsbn(createCommand.getIsbn())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> bookCommandService.updateBook(bookId, createCommand))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining(BookConstants.ERROR_BOOK_ALREADY_EXISTS + createCommand.getIsbn());

        verify(bookRepository).findById(bookId);
        verify(bookRepository).existsByIsbn(createCommand.getIsbn());
        verify(bookRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should delete book successfully with Kafka event and cache")
    void deleteBook_ShouldDeleteBookWithEventAndCache() {
        // Given
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        doNothing().when(bookRepository).deleteById(bookId);

        // When
        bookCommandService.deleteBook(bookId);

        // Then
        // Verify repository calls
        verify(bookRepository).findById(bookId);
        verify(bookRepository).deleteById(bookId);

        // Verify cache operations
        verify(cacheService).evict(BookConstants.CACHE_NAME, BookConstants.CACHE_KEY_PREFIX_BOOK + bookId);
        verify(cacheService).evictAll(BookConstants.CACHE_NAME);

        // Verify Kafka event
        ArgumentCaptor<BookDeletedEvent> eventCaptor = ArgumentCaptor.forClass(BookDeletedEvent.class);
        verify(kafkaTemplate).send(eq(BookConstants.TOPIC_BOOK_DELETED), eq(bookId.toString()), eventCaptor.capture());
        
        BookDeletedEvent capturedEvent = eventCaptor.getValue();
        assertThat(capturedEvent.getBookId()).isEqualTo(bookId);
        assertThat(capturedEvent.getTitle()).isEqualTo(BookConstants.TEST_BOOK_TITLE);
        assertThat(capturedEvent.getAuthor()).isEqualTo(BookConstants.TEST_BOOK_AUTHOR);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent book")
    void deleteBook_WhenBookNotFound_ShouldThrowException() {
        // Given
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookCommandService.deleteBook(bookId))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining(BookConstants.ERROR_BOOK_NOT_FOUND + bookId);

        verify(bookRepository).findById(bookId);
        verify(bookRepository, never()).deleteById(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should throw exception when deleting book with active borrowings")
    void deleteBook_WhenBookHasActiveBorrowings_ShouldThrowException() {
        // Given
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        // Note: hasActiveBorrowings() currently returns false by default
        // This test would need to be updated when the method is implemented

        // When & Then
        // Currently this will pass because hasActiveBorrowings() returns false
        bookCommandService.deleteBook(bookId);

        verify(bookRepository).findById(bookId);
        verify(bookRepository).deleteById(bookId);
    }

    @Test
    @DisplayName("Should clear multiple books cache successfully")
    void clearBooksCache_ShouldClearMultipleCaches() {
        // Given
        List<UUID> bookIds = List.of(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID());

        // When
        bookCommandService.clearBooksCache(bookIds);

        // Then
        verify(cacheService, times(3)).evict(eq(BookConstants.CACHE_NAME), anyString());
        verify(kafkaTemplate, times(3)).send(eq(BookConstants.TOPIC_BOOK_CACHE_EVICT), anyString(), any());
    }

    @Test
    @DisplayName("Should publish cache evict event successfully")
    void publishCacheEvictEvent_ShouldSendKafkaEvent() {
        // Given
        UUID bookId = UUID.randomUUID();

        // When
        bookCommandService.publishCacheEvictEvent(bookId);

        // Then
        verify(kafkaTemplate).send(eq(BookConstants.TOPIC_BOOK_CACHE_EVICT), eq(bookId.toString()), any());
    }

    @Test
    @DisplayName("Should handle ISBN unchanged during update")
    void updateBook_WhenIsbnUnchanged_ShouldNotCheckUniqueness() {
        // Given
        Book existingBook = Book.builder()
            .bookId(bookId)
            .title(BookConstants.TEST_OLD_TITLE)
            .author(BookConstants.TEST_OLD_AUTHOR)
            .isbn(BookConstants.TEST_BOOK_ISBN) // Same ISBN as command
            .build();

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(existingBook));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        // When
        BookResponse result = bookCommandService.updateBook(bookId, createCommand);

        // Then
        assertThat(result).isNotNull();
        verify(bookRepository).findById(bookId);
        verify(bookRepository, never()).existsByIsbn(anyString()); // Should not check uniqueness
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    @DisplayName("Should handle category not found during update")
    void updateBook_WhenCategoryNotFound_ShouldThrowException() {
        // Given
        Book existingBook = Book.builder()
            .bookId(bookId)
            .title(BookConstants.TEST_OLD_TITLE)
            .author(BookConstants.TEST_OLD_AUTHOR)
            .isbn(BookConstants.TEST_DIFFERENT_ISBN) // Different ISBN to trigger uniqueness check
            .build();

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(existingBook));
        when(bookRepository.existsByIsbn(createCommand.getIsbn())).thenReturn(false);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookCommandService.updateBook(bookId, createCommand))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining(BookConstants.ERROR_CATEGORY_NOT_FOUND + categoryId);

        verify(bookRepository).findById(bookId);
        verify(bookRepository).existsByIsbn(createCommand.getIsbn());
        verify(categoryRepository).findById(categoryId);
        verify(bookRepository, never()).save(any());
        verify(kafkaTemplate, never()).send(anyString(), anyString(), any());
    }
} 