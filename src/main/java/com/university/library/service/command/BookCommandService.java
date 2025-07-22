package com.university.library.service.command;

import com.university.library.annotation.MultiLayerCacheEvict;
import com.university.library.dto.CreateBookCommand;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookCommandService {
    
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final CategoryRepository categoryRepository;
    private final LibraryRepository libraryRepository;
    
    /**
     * Tạo sách mới
     */
    @Transactional
    @MultiLayerCacheEvict(value = {"books"}, allEntries = true)
    public Book createBook(CreateBookCommand command) {
        log.info("Creating new book: {}", command.getTitle());
        
        // Validate business rules
        validateBookCreation(command);
        
        // Tìm category
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found: " + command.getCategoryId()));
        
        // Tạo sách mới
        Book book = Book.builder()
            .title(command.getTitle())
            .author(command.getAuthor())
            .isbn(command.getIsbn())
            .publisher(command.getPublisher())
            .year(command.getPublishYear()) // Book entity dùng 'year'
            // Book entity không có description field
            .category(category)
            .build();
        
        Book savedBook = bookRepository.save(book);
        log.info("Book created successfully: {}", savedBook.getBookId()); // Book entity dùng 'bookId'
        
        // Tạo các bản sao sách nếu có
        if (command.getCopies() != null && !command.getCopies().isEmpty()) {
            createBookCopies(savedBook, command.getCopies());
        }
        
        return savedBook;
    }
    
    /**
     * Cập nhật thông tin sách
     */
    @Transactional
    @MultiLayerCacheEvict(value = {"books"}, allEntries = true)
    public Book updateBook(UUID id, CreateBookCommand command) {
        log.info("Updating book with id: {}", id);
        
        // Tìm sách hiện tại
        Book existingBook = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found: " + id));
        
        // Validate business rules
        validateBookUpdate(command, existingBook);
        
        // Tìm category
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found: " + command.getCategoryId()));
        
        // Cập nhật thông tin sách
        existingBook.setTitle(command.getTitle());
        existingBook.setAuthor(command.getAuthor());
        existingBook.setIsbn(command.getIsbn());
        existingBook.setPublisher(command.getPublisher());
        existingBook.setYear(command.getPublishYear()); // Book entity dùng 'year'
        // Book entity không có description field
        existingBook.setCategory(category);
        
        Book updatedBook = bookRepository.save(existingBook);
        log.info("Book updated successfully: {}", updatedBook.getBookId()); // Book entity dùng 'bookId'
        
        return updatedBook;
    }
    
    /**
     * Xóa sách
     */
    @Transactional
    @MultiLayerCacheEvict(value = {"books"}, allEntries = true)
    public void deleteBook(UUID id) {
        log.info("Deleting book with id: {}", id);
        
        // Kiểm tra sách có tồn tại không
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found: " + id));
        
        // Kiểm tra có bản sao nào đang được mượn không
        List<BookCopy> borrowedCopies = bookCopyRepository.findByBookBookIdAndStatus(id, BookCopy.BookStatus.BORROWED);
        if (!borrowedCopies.isEmpty()) {
            throw new RuntimeException("Cannot delete book with borrowed copies");
        }
        
        // Xóa các bản sao sách
        List<BookCopy> copies = bookCopyRepository.findByBookBookId(id);
        bookCopyRepository.deleteAll(copies);
        
        // Xóa sách
        bookRepository.delete(book);
        
        log.info("Book deleted successfully: {}", id);
    }
    
    /**
     * Tạo các bản sao sách
     */
    private void createBookCopies(Book book, List<CreateBookCommand.BookCopyInfo> copyInfos) {
        for (CreateBookCommand.BookCopyInfo copyInfo : copyInfos) {
            // Tìm thư viện
            Library library = libraryRepository.findById(copyInfo.getLibraryId())
                .orElseThrow(() -> new RuntimeException("Library not found: " + copyInfo.getLibraryId()));
            
            for (int i = 0; i < copyInfo.getQuantity(); i++) {
                BookCopy copy = BookCopy.builder()
                    .book(book)
                    .library(library)
                    .qrCode(generateQRCode())
                    .status(BookCopy.BookStatus.AVAILABLE)
                    .shelfLocation(copyInfo.getLocation()) 
                    .build();
                
                bookCopyRepository.save(copy);
            }
        }
        
        log.info("Created {} book copies for book: {}", 
            copyInfos.stream().mapToInt(CreateBookCommand.BookCopyInfo::getQuantity).sum(), 
            book.getBookId());  
    }
    
    /**
     * Validate khi tạo sách
     */
    private void validateBookCreation(CreateBookCommand command) {
        if (bookRepository.existsByIsbn(command.getIsbn())) {
            throw new RuntimeException("ISBN already exists: " + command.getIsbn());
        }
        
        if (command.getPublishYear() > java.time.Year.now().getValue()) {
            throw new RuntimeException("Publish year cannot be in the future");
        }
    }
    
    /**
     * Validate khi cập nhật sách
     */
    private void validateBookUpdate(CreateBookCommand command, Book existingBook) {
        if (!existingBook.getIsbn().equals(command.getIsbn()) && 
            bookRepository.existsByIsbn(command.getIsbn())) {
            throw new RuntimeException("ISBN already exists: " + command.getIsbn());
        }
        
        if (command.getPublishYear() > java.time.Year.now().getValue()) {
            throw new RuntimeException("Publish year cannot be in the future");
        }
    }
    
    /**
     * Tạo QR code duy nhất
     */
    private String generateQRCode() {
        return "QR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
} 