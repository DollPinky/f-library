package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.dto.request.book.CreateBookCommand;
import com.university.library.dto.request.book.UpdateBookCommand;
import com.university.library.dto.response.book.BookImportResponse;
import com.university.library.dto.response.book.BookResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    BookImportResponse importBooksFromExcel(MultipartFile file);
    BookResponse updateBookCoverUrl(UUID bookId,String file);
    byte[] exportExcel(List<String[]> list ) throws IOException;
    List<String[]> getDataBookToExport();
}
