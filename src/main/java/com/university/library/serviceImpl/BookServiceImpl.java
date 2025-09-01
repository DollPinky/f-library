package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.dto.request.book.CreateBookCommand;
import com.university.library.dto.request.book.UpdateBookCommand;
import com.university.library.dto.response.book.BookResponse;
import com.university.library.entity.Book;
import com.university.library.entity.Category;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.BookService;
import com.university.library.specification.BookSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    /**
     QueryBook
     */
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

    // BookServiceImpl.java - update searchBooks method
    public PagedResponse<BookResponse> searchBooks(BookSearchParams params) {
        log.info("Searching books with params: {}", params);

        // Create specification from search params
        Specification<Book> spec = BookSpecification.withSearchParams(params);

        // Create pageable with sorting
        Sort.Direction direction = Sort.Direction.fromString(params.getSortDirection());
        Sort sort = Sort.by(direction, params.getSortBy());
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);

        // Execute query
        Page<Book> bookPage = bookRepository.findAll(spec, pageable);

        // Convert to response
        List<BookResponse> content = bookPage.getContent().stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                bookPage.getNumber(),
                bookPage.getSize(),
                bookPage.getTotalElements()
        );
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }


    @Transactional
    public BookResponse createBook(CreateBookCommand command) {
        log.info(BookConstants.LOG_CREATING_BOOK, command.getTitle());



        Category category = categoryRepository.findById(command.getCategoryId())
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));

        Book book = Book.builder()
                .title(command.getTitle())
                .author(command.getAuthor())
                .publisher(command.getPublisher())
                .year(command.getPublishYear())
                .description(command.getDescription())
                .category(category)
                .build();

        Book savedBook = bookRepository.save(book);


        BookResponse bookResponse = BookResponse.fromEntity(savedBook);

        log.info(BookConstants.LOG_BOOK_CREATED, savedBook.getBookId());
        return bookResponse;
    }




    /**
     * Cập nhật sách với UpdateBookCommand
     */
    @Transactional
    public BookResponse updateBook(UUID bookId, UpdateBookCommand command) {
        log.info(BookConstants.LOG_UPDATING_BOOK, bookId);

        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));



        Category category = categoryRepository.findById(command.getCategoryId())
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));

        existingBook.setTitle(command.getTitle());
        existingBook.setAuthor(command.getAuthor());
        existingBook.setPublisher(command.getPublisher());
        existingBook.setYear(command.getPublishYear());
        existingBook.setDescription(command.getDescription());
        existingBook.setCategory(category);

        Book updatedBook = bookRepository.save(existingBook);

        BookResponse bookResponse = BookResponse.fromEntity(updatedBook);

        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);
        return bookResponse;
    }


    @Transactional
    public void deleteBook(UUID bookId) {
        log.info(BookConstants.LOG_DELETING_BOOK, bookId);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));

        if (hasActiveBorrowings(bookId)) {
            log.error(BookConstants.ERROR_BOOK_IN_USE);
            throw new RuntimeException(BookConstants.ERROR_BOOK_IN_USE);
        }

        bookRepository.deleteById(bookId);

        log.info(BookConstants.LOG_BOOK_DELETED, bookId);
    }



    private boolean hasActiveBorrowings(UUID bookId) {
        return false;
    }


}
