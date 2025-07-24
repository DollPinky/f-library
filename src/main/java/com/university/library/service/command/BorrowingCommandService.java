package com.university.library.service.command;

import com.university.library.dto.BorrowingResponse;
import com.university.library.dto.CreateBorrowingCommand;
import com.university.library.entity.Borrowing;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Account;
import com.university.library.repository.BorrowingRepository;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BorrowingCommandService {

    private final BorrowingRepository borrowingRepository;
    private final BookCopyRepository bookCopyRepository;
    private final AccountRepository accountRepository;

    /**
     * Tạo yêu cầu mượn sách hoặc đặt sách
     */
    @Transactional
    public BorrowingResponse createBorrowing(CreateBorrowingCommand command) {
        log.info("Creating borrowing for book copy: {} by user: {}", command.getBookCopyId(), command.getBorrowerId());
        
        // Validate book copy exists and is available
        BookCopy bookCopy = bookCopyRepository.findById(command.getBookCopyId())
            .orElseThrow(() -> new RuntimeException("Book copy not found with ID: " + command.getBookCopyId()));
        
        // Validate borrower exists
        Account borrower = accountRepository.findById(command.getBorrowerId())
            .orElseThrow(() -> new RuntimeException("Borrower not found with ID: " + command.getBorrowerId()));
        
        // Check if book copy is available
        if (!bookCopy.getStatus().equals(BookCopy.BookStatus.AVAILABLE)) {
            throw new RuntimeException("Book copy is not available for borrowing");
        }
        
        // Check if user has too many active borrowings (max 5 books)
        long activeBorrowings = borrowingRepository.countActiveBorrowingsByBorrower(command.getBorrowerId());
        if (activeBorrowings >= 5) {
            throw new RuntimeException("User has reached maximum number of active borrowings (5)");
        }
        
        // Determine status based on command
        Borrowing.BorrowingStatus status = command.isReservation() ? 
            Borrowing.BorrowingStatus.RESERVED : Borrowing.BorrowingStatus.BORROWED;
        
        // Set default dates if not provided
        Instant borrowedDate = command.getBorrowedDate() != null ? 
            command.getBorrowedDate() : Instant.now();
        Instant dueDate = command.getDueDate() != null ? 
            command.getDueDate() : Instant.now().plus(30, ChronoUnit.DAYS); // Default 30 days
        
        // Create borrowing record
        Borrowing borrowing = Borrowing.builder()
            .bookCopy(bookCopy)
            .borrower(borrower)
            .borrowedDate(borrowedDate)
            .dueDate(dueDate)
            .status(status)
            .notes(command.getNotes())
            .build();
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        // Update book copy status
        if (command.isReservation()) {
            bookCopy.setStatus(BookCopy.BookStatus.RESERVED);
        } else {
            bookCopy.setStatus(BookCopy.BookStatus.BORROWED);
        }
        bookCopyRepository.save(bookCopy);
        
        log.info("Successfully created borrowing: {}", savedBorrowing.getBorrowingId());
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
    
    /**
     * Xác nhận mượn sách (chuyển từ RESERVED sang BORROWED)
     */
    @Transactional
    public BorrowingResponse confirmBorrowing(UUID borrowingId) {
        log.info("Confirming borrowing: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.RESERVED)) {
            throw new RuntimeException("Borrowing is not in RESERVED status");
        }
        
        // Update status to BORROWED
        borrowing.setStatus(Borrowing.BorrowingStatus.BORROWED);
        borrowing.setBorrowedDate(Instant.now());
        
        // Update book copy status
        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.BORROWED);
        bookCopyRepository.save(bookCopy);
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        log.info("Successfully confirmed borrowing: {}", borrowingId);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
    
    /**
     * Trả sách
     */
    @Transactional
    public BorrowingResponse returnBook(UUID borrowingId) {
        log.info("Returning book for borrowing: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.BORROWED)) {
            throw new RuntimeException("Borrowing is not in BORROWED status");
        }
        
        // Calculate fine if overdue
        double fine = borrowing.calculateFine();
        
        // Update borrowing
        borrowing.setStatus(Borrowing.BorrowingStatus.RETURNED);
        borrowing.setReturnedDate(Instant.now());
        borrowing.setFineAmount(fine);
        
        // Update book copy status
        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.AVAILABLE);
        bookCopyRepository.save(bookCopy);
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        log.info("Successfully returned book for borrowing: {} with fine: {}", borrowingId, fine);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
    
    /**
     * Hủy đặt sách
     */
    @Transactional
    public void cancelReservation(UUID borrowingId) {
        log.info("Cancelling reservation: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.RESERVED)) {
            throw new RuntimeException("Borrowing is not in RESERVED status");
        }
        
        // Update borrowing status
        borrowing.setStatus(Borrowing.BorrowingStatus.CANCELLED);
        borrowingRepository.save(borrowing);
        
        // Update book copy status back to available
        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.AVAILABLE);
        bookCopyRepository.save(bookCopy);
        
        log.info("Successfully cancelled reservation: {}", borrowingId);
    }
    
    /**
     * Báo mất sách
     */
    @Transactional
    public BorrowingResponse reportLost(UUID borrowingId) {
        log.info("Reporting lost book for borrowing: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.BORROWED)) {
            throw new RuntimeException("Borrowing is not in BORROWED status");
        }
        
        // Calculate fine (higher penalty for lost books)
        double fine = 500000.0; // 500,000 VND penalty for lost books
        
        // Update borrowing
        borrowing.setStatus(Borrowing.BorrowingStatus.LOST);
        borrowing.setFineAmount(fine);
        
        // Update book copy status
        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.LOST);
        bookCopyRepository.save(bookCopy);
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        log.info("Successfully reported lost book for borrowing: {} with fine: {}", borrowingId, fine);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
} 