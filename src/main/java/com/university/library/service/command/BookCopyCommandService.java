package com.university.library.service.command;

import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.CreateBookCopyCommand;
import com.university.library.dto.CreateBookCopyFromBookCommand;
import com.university.library.entity.Book;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Library;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.BookRepository;
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
public class BookCopyCommandService {
    
    private final BookCopyRepository bookCopyRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    
    @Transactional
    public BookCopyResponse createBookCopy(CreateBookCopyCommand command) {
        log.info("Creating new book copy with QR code: {}", command.getQrCode());
        
        if (bookCopyRepository.existsByQrCode(command.getQrCode())) {
            throw new RuntimeException(BookCopyConstants.ERROR_QR_CODE_ALREADY_EXISTS + command.getQrCode());
        }
        
        BookCopy bookCopy = BookCopy.builder()
                .qrCode(command.getQrCode())
                .shelfLocation(command.getShelfLocation())
                .status(convertBookStatus(command.getStatus()))
                .build();
        
        BookCopy savedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(savedBookCopy);
        
        log.info(BookCopyConstants.LOG_BOOK_COPY_CREATED, savedBookCopy.getBookCopyId());
        return response;
    }
    
    @Transactional
    public BookCopyResponse updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command) {
        log.info("Updating book copy with ID: {}", bookCopyId);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        
        if (!bookCopy.getQrCode().equals(command.getQrCode()) && 
            bookCopyRepository.existsByQrCode(command.getQrCode())) {
            throw new RuntimeException(BookCopyConstants.ERROR_QR_CODE_ALREADY_EXISTS + command.getQrCode());
        }
        
        bookCopy.setQrCode(command.getQrCode());
        bookCopy.setShelfLocation(command.getShelfLocation());
        bookCopy.setStatus(convertBookStatus(command.getStatus()));
        
        BookCopy updatedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(updatedBookCopy);
        
        log.info(BookCopyConstants.LOG_BOOK_COPY_UPDATED, bookCopyId);
        return response;
    }
    
    @Transactional
    public void deleteBookCopy(UUID bookCopyId) {
        log.info("Deleting book copy with ID: {}", bookCopyId);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        
        if (bookCopy.getStatus() == BookCopy.BookStatus.BORROWED) {
            throw new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_IN_USE);
        }
        
        bookCopyRepository.delete(bookCopy);
        
        
        log.info(BookCopyConstants.LOG_BOOK_COPY_DELETED, bookCopyId);
    }
    
    @Transactional
    public BookCopyResponse changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus) {
        log.info("Changing book copy status: {} -> {}", bookCopyId, newStatus);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));
        
        BookCopy.BookStatus oldStatus = bookCopy.getStatus();
        bookCopy.setStatus(convertBookStatus(newStatus));
        
        BookCopy updatedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(updatedBookCopy);
 
        
        log.info(BookCopyConstants.LOG_STATUS_CHANGED, oldStatus, newStatus);
        return response;
    }
    
    /**
     * Tạo book copies cho một book
     */
    @Transactional
    public void createBookCopiesFromBook(CreateBookCopyFromBookCommand command) {
        log.info("Creating {} book copies for book: {}", command.getCopies().size(), command.getBookId());
        
        Book book = bookRepository.findById(command.getBookId())
            .orElseThrow(() -> new RuntimeException("Book not found with ID: " + command.getBookId()));
        
        List<BookCopy> bookCopies = new ArrayList<>();
        
        for (CreateBookCopyFromBookCommand.BookCopyInfo copyInfo : command.getCopies()) {
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
        
        log.info("Successfully created {} book copies for book: {}", bookCopies.size(), command.getBookId());
    }
    
    /**
     * Generate unique QR code
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
    
    private BookCopy.BookStatus convertBookStatus(CreateBookCopyCommand.BookStatus status) {
        if (status == null) {
            return BookCopy.BookStatus.AVAILABLE;
        }
        
        switch (status) {
            case AVAILABLE:
                return BookCopy.BookStatus.AVAILABLE;
            case BORROWED:
                return BookCopy.BookStatus.BORROWED;
            case RESERVED:
                return BookCopy.BookStatus.RESERVED;
            case LOST:
                return BookCopy.BookStatus.LOST;
            case DAMAGED:
                return BookCopy.BookStatus.DAMAGED;
            default:
                return BookCopy.BookStatus.AVAILABLE;
        }
    }
    
    public static class StatusChangeEvent {
        private final UUID bookCopyId;
        private final BookCopy.BookStatus oldStatus;
        private final BookCopy.BookStatus newStatus;
        
        public StatusChangeEvent(UUID bookCopyId, BookCopy.BookStatus oldStatus, BookCopy.BookStatus newStatus) {
            this.bookCopyId = bookCopyId;
            this.oldStatus = oldStatus;
            this.newStatus = newStatus;
        }
        
        public UUID getBookCopyId() { return bookCopyId; }
        public BookCopy.BookStatus getOldStatus() { return oldStatus; }
        public BookCopy.BookStatus getNewStatus() { return newStatus; }
    }
} 

