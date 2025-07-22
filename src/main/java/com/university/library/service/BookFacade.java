package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBookCommand;
import com.university.library.entity.Book;
import com.university.library.entity.Account;
import com.university.library.entity.Staff;
import com.university.library.event.BookCreatedEvent;
import com.university.library.event.BookUpdatedEvent;
import com.university.library.event.BookDeletedEvent;
import com.university.library.service.command.BookCommandService;
import com.university.library.service.query.BookQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import com.university.library.entity.BookCopy;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookFacade {
    
    private final BookQueryService bookQueryService;
    private final BookCommandService bookCommandService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    /**
     * Tìm kiếm sách với pagination và caching
     */
    public PagedResponse<Book> searchBooks(BookSearchParams params) {
        log.info("Searching books with params: {}", params);
        return bookQueryService.searchBooks(params);
    }
    
    /**
     * Lấy thông tin sách theo ID
     */
    public Book getBookById(UUID id) {
        log.info("Getting book by id: {}", id);
        return bookQueryService.getBookById(id);
    }
    
    /**
     * Tạo sách mới với event publishing
     */
    public Book createBook(CreateBookCommand command, Account currentAccount) {
        log.info("Creating new book: {} by user: {}", command.getTitle(), currentAccount.getUsername());
        
        // Tạo sách
        Book book = bookCommandService.createBook(command);
        
        // Gửi event qua Kafka với đầy đủ thông tin
        BookCreatedEvent event = BookCreatedEvent.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .publisher(book.getPublisher())
            .publishYear(book.getYear())
            .description(null) // Book entity không có description field
            .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
            .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
            .createdByAccountId(currentAccount.getAccountId())
            .createdByUsername(currentAccount.getUsername())
            .createdByFullName(currentAccount.getFullName())
            .createdByUserType(currentAccount.getUserType().name())
            .createdByStaffRole(currentAccount.isStaff() ? getStaffRole(currentAccount) : null)
            .createdByEmployeeId(currentAccount.isStaff() ? getEmployeeId(currentAccount) : null)
            .libraryId(command.getCopies() != null && !command.getCopies().isEmpty() ? 
                command.getCopies().get(0).getLibraryId() : null)
            .libraryName("") // Sẽ được populate từ service
            .campusId(currentAccount.getCampus() != null ? currentAccount.getCampus().getCampusId() : null)
            .campusName(currentAccount.getCampus() != null ? currentAccount.getCampus().getName() : null)
            .createdAt(LocalDateTime.now())
            .totalCopies(command.getCopies() != null ? 
                command.getCopies().stream().mapToInt(c -> c.getQuantity()).sum() : 0)
            .availableCopies(command.getCopies() != null ? 
                command.getCopies().stream().mapToInt(c -> c.getQuantity()).sum() : 0)
            .build();
            
        kafkaTemplate.send("book-events", event);
        
        log.info("Book created successfully with id: {} and event sent", book.getBookId());
        return book;
    }
    
    /**
     * Cập nhật thông tin sách
     */
    public Book updateBook(UUID id, CreateBookCommand command, Account currentAccount, String changeReason) {
        log.info("Updating book with id: {} by user: {}", id, currentAccount.getUsername());
        
        // Lấy thông tin sách cũ để tracking changes
        Book oldBook = bookQueryService.getBookById(id);
        
        // Cập nhật sách
        Book book = bookCommandService.updateBook(id, command);
        
        // Gửi event với đầy đủ thông tin
        BookUpdatedEvent event = BookUpdatedEvent.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .publisher(book.getPublisher())
            .publishYear(book.getYear())
            .description(null) // Book entity không có description field
            .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
            .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
            .updatedByAccountId(currentAccount.getAccountId())
            .updatedByUsername(currentAccount.getUsername())
            .updatedByFullName(currentAccount.getFullName())
            .updatedByUserType(currentAccount.getUserType().name())
            .updatedByStaffRole(currentAccount.isStaff() ? getStaffRole(currentAccount) : null)
            .updatedByEmployeeId(currentAccount.isStaff() ? getEmployeeId(currentAccount) : null)
            .libraryId(command.getCopies() != null && !command.getCopies().isEmpty() ? 
                command.getCopies().get(0).getLibraryId() : null)
            .libraryName("") // Sẽ được populate từ service
            .campusId(currentAccount.getCampus() != null ? currentAccount.getCampus().getCampusId() : null)
            .campusName(currentAccount.getCampus() != null ? currentAccount.getCampus().getName() : null)
            .updatedAt(LocalDateTime.now())
            .totalCopies(command.getCopies() != null ? 
                command.getCopies().stream().mapToInt(c -> c.getQuantity()).sum() : 0)
            .availableCopies(command.getCopies() != null ? 
                command.getCopies().stream().mapToInt(c -> c.getQuantity()).sum() : 0)
            .changeReason(changeReason)
            .previousTitle(oldBook.getTitle())
            .previousAuthor(oldBook.getAuthor())
            .previousIsbn(oldBook.getIsbn())
            .build();
            
        kafkaTemplate.send("book-events", event);
        
        log.info("Book updated successfully with id: {} and event sent", book.getBookId());
        return book;
    }
    
    /**
     * Xóa sách
     */
    public void deleteBook(UUID id, Account currentAccount, String deletionReason) {
        log.info("Deleting book with id: {} by user: {}", id, currentAccount.getUsername());
        
        // Lấy thông tin sách trước khi xóa
        Book book = bookQueryService.getBookById(id);
        
        // Xóa sách
        bookCommandService.deleteBook(id);
        
        // Gửi event với đầy đủ thông tin
        BookDeletedEvent event = BookDeletedEvent.builder()
            .bookId(book.getBookId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .isbn(book.getIsbn())
            .deletedByAccountId(currentAccount.getAccountId())
            .deletedByUsername(currentAccount.getUsername())
            .deletedByFullName(currentAccount.getFullName())
            .deletedByUserType(currentAccount.getUserType().name())
            .deletedByStaffRole(currentAccount.isStaff() ? getStaffRole(currentAccount) : null)
            .deletedByEmployeeId(currentAccount.isStaff() ? getEmployeeId(currentAccount) : null)
            .libraryId(null) // Book entity không có library field
            .libraryName("") // Sẽ được populate từ service
            .campusId(currentAccount.getCampus() != null ? currentAccount.getCampus().getCampusId() : null)
            .campusName(currentAccount.getCampus() != null ? currentAccount.getCampus().getName() : null)
            .deletedAt(LocalDateTime.now())
            .deletionReason(deletionReason)
            .totalCopiesBeforeDeletion(book.getBookCopies() != null ? book.getBookCopies().size() : 0)
            .borrowedCopiesBeforeDeletion(book.getBookCopies() != null ? 
                (int) book.getBookCopies().stream().filter(copy -> BookCopy.BookStatus.BORROWED.equals(copy.getStatus())).count() : 0)
            .hasActiveBorrowings(book.getBookCopies() != null && 
                book.getBookCopies().stream().anyMatch(copy -> BookCopy.BookStatus.BORROWED.equals(copy.getStatus())))
            .build();
            
        kafkaTemplate.send("book-events", event);
        
        log.info("Book deleted successfully with id: {} and event sent", book.getBookId());
    }
    
    // Helper methods để lấy thông tin Staff
    private String getStaffRole(Account account) {
        // TODO: Implement để lấy Staff role từ Staff entity
        // Cần inject StaffRepository hoặc StaffService
        return "LIBRARIAN"; // Default value
    }
    
    private String getEmployeeId(Account account) {
        // TODO: Implement để lấy Employee ID từ Staff entity
        // Cần inject StaffRepository hoặc StaffService
        return "EMP001"; // Default value
    }
} 