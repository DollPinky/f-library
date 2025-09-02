package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.dto.request.book.CreateBookCommand;
import com.university.library.dto.request.book.UpdateBookCommand;
import com.university.library.dto.response.book.BookResponse;

import java.util.List;
import java.util.UUID;

public interface BookService {
    /**
    BookQuery
     */
    BookResponse getBookById(UUID bookId);
    PagedResponse<BookResponse> searchBooks(BookSearchParams params);
    List<BookResponse> getAllBook();
    /**
     * BookCommand
     */
    BookResponse createBook(CreateBookCommand command);
    BookResponse updateBook(UUID bookId, UpdateBookCommand command);
    void deleteBook(UUID bookId);

}
