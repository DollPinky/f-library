package com.university.library.service.command;

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
     * Tạo sách mới với các bản sao
     */
    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public Book createBook(CreateBookCommand command) {
        log.info("Creating new book: {}", command.getTitle());
        
        // Validate business rules
        validateBookCreation(command);
        
        // Tìm category
        Category category = categoryRepository.findById(command.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found: " + command.getCategoryId()));
        
        // Tạo sách
        Book book = Book.builder()
            .title(command.getTitle())
            .author(command.getAuthor())
            .isbn(command.getIsbn())
            .publisher(command.getPublisher())
            .publishYear(command.getPublishYear())
            .description(command.getDescription())
            .category(category)
            .status("ACTIVE")
            .build();
        
        book = bookRepository.save(book);
        log.info("Book created with id: {}", book.getId());
        
        // Tạo các bản sao sách
        if (command.getCopies() != null && !command.getCopies().isEmpty()) {
            createBookCopies(book, command.getCopies());
        }
        
        return book;
    }
    
    /**
     * Cập nhật thông tin sách
     */
    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public Book updateBook(Long id, CreateBookCommand command) {
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
        existingBook.setPublishYear(command.getPublishYear());
        existingBook.setDescription(command.getDescription());
        existingBook.setCategory(category);
        
        Book updatedBook = bookRepository.save(existingBook);
        log.info("Book updated successfully: {}", updatedBook.getId());
        
        return updatedBook;
    }
    
    /**
     * Xóa sách
     */
    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void deleteBook(Long id) {
        log.info("Deleting book with id: {}", id);
        
        // Kiểm tra sách có tồn tại không
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found: " + id));
        
        // Kiểm tra có bản sao nào đang được mượn không
        List<BookCopy> borrowedCopies = bookCopyRepository.findByBookIdAndStatus(id, "BORROWED");
        if (!borrowedCopies.isEmpty()) {
            throw new RuntimeException("Cannot delete book with borrowed copies");
        }
        
        // Xóa các bản sao sách
        List<BookCopy> copies = bookCopyRepository.findByBookId(id);
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
            
            // Tạo các bản sao
            for (int i = 0; i < copyInfo.getQuantity(); i++) {
                BookCopy copy = BookCopy.builder()
                    .book(book)
                    .library(library)
                    .qrCode(generateQRCode())
                    .status("AVAILABLE")
                    .location(copyInfo.getLocation())
                    .build();
                
                bookCopyRepository.save(copy);
            }
        }
        
        log.info("Created {} book copies for book: {}", 
            copyInfos.stream().mapToInt(CreateBookCommand.BookCopyInfo::getQuantity).sum(), 
            book.getId());
    }
    
    /**
     * Validate khi tạo sách
     */
    private void validateBookCreation(CreateBookCommand command) {
        // Kiểm tra ISBN đã tồn tại chưa
        if (bookRepository.existsByIsbn(command.getIsbn())) {
            throw new RuntimeException("ISBN already exists: " + command.getIsbn());
        }
        
        // Kiểm tra năm xuất bản
        if (command.getPublishYear() > java.time.Year.now().getValue()) {
            throw new RuntimeException("Publish year cannot be in the future");
        }
    }
    
    /**
     * Validate khi cập nhật sách
     */
    private void validateBookUpdate(CreateBookCommand command, Book existingBook) {
        // Kiểm tra ISBN đã tồn tại chưa (trừ sách hiện tại)
        if (!existingBook.getIsbn().equals(command.getIsbn()) && 
            bookRepository.existsByIsbn(command.getIsbn())) {
            throw new RuntimeException("ISBN already exists: " + command.getIsbn());
        }
        
        // Kiểm tra năm xuất bản
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