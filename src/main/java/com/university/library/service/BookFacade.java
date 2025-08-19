package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.BookResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.dto.UpdateBookCommand;
import com.university.library.entity.BookCopy;
import com.university.library.repository.BookCopyRepository;
import com.university.library.service.command.BookCommandService;
import com.university.library.service.query.BookQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * BookFacade - Facade pattern để kết hợp Book Query và Command operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookFacade {

    private final BookQueryService bookQueryService;
    private final BookCommandService bookCommandService;


    // ==================== QUERY OPERATIONS ====================

    /**
     * Lấy thông tin sách theo ID với cache
     */
    public BookResponse getBookById(UUID bookId) {
        log.info("BookFacade: Getting book by ID: {}", bookId);
        return bookQueryService.getBookById(bookId);
    }





    /**
     * Tìm kiếm sách với cache
     */
    public PagedResponse<BookResponse> searchBooks(BookSearchParams params) {
        log.info("BookFacade: Searching books with params: {}", params);
        return bookQueryService.searchBooks(params);
    }

    // ==================== COMMAND OPERATIONS ====================

    /**
     * Tạo sách mới với Kafka events và cache management
     */
    public BookResponse createBook(CreateBookCommand command) {
        log.info("BookFacade: Creating new book with title: {}", command.getTitle());
        return bookCommandService.createBook(command);
    }

    /**
     * Cập nhật sách với Kafka events và cache management
     */
    public BookResponse updateBook(UUID bookId, CreateBookCommand command) {
        log.info("BookFacade: Updating book with ID: {}", bookId);
        return bookCommandService.updateBook(bookId, command);
    }

    /**
     * Cập nhật sách với UpdateBookCommand
     */
    public BookResponse updateBook(UUID bookId, UpdateBookCommand command) {
        log.info("BookFacade: Updating book with ID: {}", bookId);
        return bookCommandService.updateBook(bookId, command);
    }

    /**
     * Xóa sách với Kafka events và cache management
     */
    public void deleteBook(UUID bookId) {
        log.info("BookFacade: Deleting book with ID: {}", bookId);
        bookCommandService.deleteBook(bookId);
    }

} 

