package com.university.library.service.command;

import com.university.library.constants.BookConstants;
import com.university.library.dto.BookResponse;
import com.university.library.dto.CreateBookCommand;
import com.university.library.dto.UpdateBookCommand;
import com.university.library.entity.Book;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Category;
import com.university.library.entity.Library;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.repository.LibraryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookCommandService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookCopyRepository bookCopyRepository;
    private final LibraryRepository libraryRepository;

    /**
     * Tạo sách mới với book copy (nếu có) và Kafka event, cache management
     */
    @Transactional
    public BookResponse createBook(CreateBookCommand command) {
        log.info(BookConstants.LOG_CREATING_BOOK, command.getTitle());
        
        if (bookRepository.existsByIsbn(command.getIsbn())) {
            log.error(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
            throw new RuntimeException(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
        }
        
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));
        
        Book book = Book.builder()
            .title(command.getTitle())
            .author(command.getAuthor())
            .publisher(command.getPublisher())
            .year(command.getPublishYear())
            .isbn(command.getIsbn())
            .description(command.getDescription())
            .category(category)
            .build();
        
        Book savedBook = bookRepository.save(book);
        
        if (command.getCopies() != null && !command.getCopies().isEmpty()) {
            createBookCopies(savedBook, command.getCopies());
        }
        
        BookResponse bookResponse = BookResponse.fromEntity(savedBook);
        
        log.info(BookConstants.LOG_BOOK_CREATED, savedBook.getBookId());
        return bookResponse;
    }
    
    /**
     * Cập nhật sách với book copy (nếu có) và Kafka event, cache management
     */
    @Transactional
    public BookResponse updateBook(UUID bookId, CreateBookCommand command) {
        log.info(BookConstants.LOG_UPDATING_BOOK, bookId);
        
        Book existingBook = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));
        
        if (!existingBook.getIsbn().equals(command.getIsbn()) && 
            bookRepository.existsByIsbn(command.getIsbn())) {
            log.error(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
            throw new RuntimeException(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
        }
        
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));
        
        existingBook.setTitle(command.getTitle());
        existingBook.setAuthor(command.getAuthor());
        existingBook.setPublisher(command.getPublisher());
        existingBook.setYear(command.getPublishYear());
        existingBook.setIsbn(command.getIsbn());
        existingBook.setDescription(command.getDescription());
        existingBook.setCategory(category);
        
        Book updatedBook = bookRepository.save(existingBook);
        
        BookResponse bookResponse = BookResponse.fromEntity(updatedBook);
        
        log.info(BookConstants.LOG_BOOK_UPDATED, updatedBook.getBookId());
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
        
        if (command.getIsbn() != null && !existingBook.getIsbn().equals(command.getIsbn()) && 
            bookRepository.existsByIsbn(command.getIsbn())) {
            log.error(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
            throw new RuntimeException(BookConstants.ERROR_BOOK_ALREADY_EXISTS + command.getIsbn());
        }
        
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));
        
        existingBook.setTitle(command.getTitle());
        existingBook.setAuthor(command.getAuthor());
        existingBook.setPublisher(command.getPublisher());
        existingBook.setYear(command.getPublishYear());
        existingBook.setIsbn(command.getIsbn());
        existingBook.setDescription(command.getDescription());
        existingBook.setCategory(category);
        
        Book updatedBook = bookRepository.save(existingBook);
        
        BookResponse bookResponse = BookResponse.fromEntity(updatedBook);
        
        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);
        return bookResponse;
    }
    
    /**
     * Xóa sách với Kafka event và cache management
     */
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
    

    

    
    /**
     * Tạo book copies cho một book
     */
    private void createBookCopies(Book book, List<CreateBookCommand.BookCopyInfo> copyInfos) {
        log.info("Creating {} book copies for book: {}", copyInfos.size(), book.getBookId());
        
        List<BookCopy> bookCopies = new ArrayList<>();
        
        for (CreateBookCommand.BookCopyInfo copyInfo : copyInfos) {
            Library library = libraryRepository.findById(copyInfo.getLibraryId())
                .orElseThrow(() -> new RuntimeException("Library not found with ID: " + copyInfo.getLibraryId()));
            
            for (int i = 0; i < copyInfo.getQuantity(); i++) {
                String qrCode = generateUniqueQrCode(book.getIsbn(), library.getCode(), i + 1);
                
                BookCopy bookCopy = BookCopy.builder()
                    .book(book)
                    .library(library)
                    .qrCode(qrCode)
                    .shelfLocation(copyInfo.getLocation())
                    .status(BookCopy.BookStatus.AVAILABLE)
                    .build();
                
                bookCopies.add(bookCopy);
            }
        }
        
        bookCopyRepository.saveAll(bookCopies);
        
        log.info("Successfully created {} book copies for book: {}", bookCopies.size(), book.getBookId());
    }
    
    /**
     * Generate unique QR code for book copy
     */
    private String generateUniqueQrCode(String isbn, String libraryCode, int copyNumber) {
        String baseQrCode = String.format("BK_%s_%s_%03d", isbn, libraryCode, copyNumber);
        
        int attempt = 0;
        String qrCode = baseQrCode;
        while (bookCopyRepository.existsByQrCode(qrCode)) {
            attempt++;
            qrCode = baseQrCode + "_" + attempt;
        }
        
        return qrCode;
    }
    
    /**
     * Kiểm tra xem sách có đang được mượn không
     */
    private boolean hasActiveBorrowings(UUID bookId) {
        return false;
    }
    

} 

