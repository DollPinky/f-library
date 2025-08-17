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

import static com.university.library.entity.Borrowing.BorrowingStatus.BORROWED;

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
    public BorrowingResponse scanAndBorrow(String qrCode, UUID borrowerId) {
        log.info("Processing scan and borrow for QR: {} by user: {}", qrCode, borrowerId);

        // Tìm bản sao sách bằng QR code
        BookCopy bookCopy = bookCopyRepository.findByQrCode(qrCode);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + qrCode);
        }

        Account borrower = accountRepository.findById(borrowerId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (!bookCopy.getStatus().equals(BookCopy.BookStatus.AVAILABLE)) {
            throw new RuntimeException("Book copy is not available for borrowing");
        }

        long activeBorrowings = borrowingRepository.countActiveBorrowingsByBorrower(borrowerId);
        if (activeBorrowings >= 5) {
            throw new RuntimeException("User has reached maximum number of active borrowings (5)");
        }


        // Tạo lệnh mượn sách
        CreateBorrowingCommand command = new CreateBorrowingCommand();
        command.setBookCopyId(bookCopy.getBookCopyId());
        command.setBorrowerId(borrowerId);

        Instant borrowedDate = command.getBorrowedDate() != null ?
                command.getBorrowedDate() : Instant.now();
        Instant dueDate = command.getDueDate() != null ?
                command.getDueDate() : Instant.now().plus(30, ChronoUnit.DAYS);


        // Tạo giao dịch mượn sách
        Borrowing borrowing = Borrowing.builder()
                .bookCopy(bookCopy)
                .borrower(borrower)
                .borrowedDate(borrowedDate)
                .dueDate(dueDate)
                .status(BORROWED)
                .notes(command.getNotes())
                .build();

        Borrowing savedBorrowing = borrowingRepository.save(borrowing);

        return BorrowingResponse.fromEntity(savedBorrowing);
    }

    @Transactional
    public BorrowingResponse createBorrowing(CreateBorrowingCommand command) {
        log.info("Creating borrowing for book copy: {} by user: {}", command.getBookCopyId(), command.getBorrowerId());
        
        BookCopy bookCopy = bookCopyRepository.findById(command.getBookCopyId())
            .orElseThrow(() -> new RuntimeException("Book copy not found with ID: " + command.getBookCopyId()));
        
        Account borrower = accountRepository.findById(command.getBorrowerId())
            .orElseThrow(() -> new RuntimeException("Borrower not found with ID: " + command.getBorrowerId()));
        
        if (!bookCopy.getStatus().equals(BookCopy.BookStatus.AVAILABLE)) {
            throw new RuntimeException("Book copy is not available for borrowing");
        }
        
        long activeBorrowings = borrowingRepository.countActiveBorrowingsByBorrower(command.getBorrowerId());
        if (activeBorrowings >= 5) {
            throw new RuntimeException("User has reached maximum number of active borrowings (5)");
        }
        
        // Xác định status: RESERVED hoặc PENDING_LIBRARIAN
        Borrowing.BorrowingStatus status;
        if (command.isReservation()) {
            status = Borrowing.BorrowingStatus.RESERVED;
        } else {
            status = Borrowing.BorrowingStatus.PENDING_LIBRARIAN; // Chờ thủ thư xác nhận
        }
        
        Instant borrowedDate = command.getBorrowedDate() != null ? 
            command.getBorrowedDate() : Instant.now();
        Instant dueDate = command.getDueDate() != null ? 
            command.getDueDate() : Instant.now().plus(30, ChronoUnit.DAYS); 
        
        Borrowing borrowing = Borrowing.builder()
            .bookCopy(bookCopy)
            .borrower(borrower)
            .borrowedDate(borrowedDate)
            .dueDate(dueDate)
            .status(status)
            .notes(command.getNotes())
            .build();
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        // Cập nhật trạng thái book copy
        if (command.isReservation()) {
            bookCopy.setStatus(BookCopy.BookStatus.RESERVED);
        } else {
            bookCopy.setStatus(BookCopy.BookStatus.PENDING); // Chờ thủ thư xác nhận
        }
        bookCopyRepository.save(bookCopy);
        
        log.info("Successfully created borrowing with status: {}", status);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
    
    /**
     * Thủ thư xác nhận mượn sách (chuyển từ RESERVED/PENDING_LIBRARIAN sang BORROWED)
     */
    @Transactional
    public BorrowingResponse confirmBorrowing(UUID borrowingId) {
        log.info("Librarian confirming borrowing: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.PENDING_LIBRARIAN) &&
            !borrowing.getStatus().equals(Borrowing.BorrowingStatus.RESERVED)) {
            throw new RuntimeException("Borrowing is not in PENDING_LIBRARIAN or RESERVED status");
        }
        
        borrowing.setStatus(BORROWED);
        borrowing.setBorrowedDate(Instant.now());
        
        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.BORROWED);
        bookCopyRepository.save(bookCopy);
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        log.info("Librarian successfully confirmed borrowing: {}", borrowingId);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
    
    /**
     * User yêu cầu trả sách (chuyển từ BORROWED sang PENDING_RETURN)
     */
    @Transactional
    public BorrowingResponse requestReturn(UUID borrowingId) {
        log.info("User requesting return for borrowing: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(BORROWED)) {
            throw new RuntimeException("Borrowing is not in BORROWED status");
        }
        
        borrowing.setStatus(Borrowing.BorrowingStatus.PENDING_RETURN);
        borrowingRepository.save(borrowing);
        
        log.info("User successfully requested return for borrowing: {}", borrowingId);
        return BorrowingResponse.fromEntity(borrowing);
    }
    
    /**
     * Thủ thư xác nhận trả sách (chuyển từ PENDING_RETURN sang RETURNED)
     */
    @Transactional
    public BorrowingResponse confirmReturn(UUID borrowingId) {
        log.info("Librarian confirming return for borrowing: {}", borrowingId);
        
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
            .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.PENDING_RETURN)) {
            throw new RuntimeException("Borrowing is not in PENDING_RETURN status");
        }
        
        double fine = borrowing.calculateFine();
        
        borrowing.setStatus(Borrowing.BorrowingStatus.RETURNED);
        borrowing.setReturnedDate(Instant.now());
        borrowing.setFineAmount(fine);

        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.AVAILABLE);
        bookCopyRepository.save(bookCopy);
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        log.info("Librarian successfully confirmed return for borrowing: {} with fine: {}", borrowingId, fine);
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
        
        if (!borrowing.getStatus().equals(BORROWED)) {
            throw new RuntimeException("Borrowing is not in BORROWED status");
        }
        
        double fine = borrowing.calculateFine();
        
        borrowing.setStatus(Borrowing.BorrowingStatus.RETURNED);
        borrowing.setReturnedDate(Instant.now());
        borrowing.setFineAmount(fine);

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
        
        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.RESERVED) && 
            !borrowing.getStatus().equals(Borrowing.BorrowingStatus.PENDING_LIBRARIAN)) {
            throw new RuntimeException("Borrowing is not in RESERVED or PENDING_LIBRARIAN status");
        }
        
        borrowing.setStatus(Borrowing.BorrowingStatus.CANCELLED);
        borrowingRepository.save(borrowing);
        
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
        
        if (!borrowing.getStatus().equals(BORROWED)) {
            throw new RuntimeException("Borrowing is not in BORROWED status");
        }
        
        double fine = 500000.0; 
        
        borrowing.setStatus(Borrowing.BorrowingStatus.LOST);
        borrowing.setFineAmount(fine);
        
        BookCopy bookCopy = borrowing.getBookCopy();
        bookCopy.setStatus(BookCopy.BookStatus.LOST);
        bookCopyRepository.save(bookCopy);
        
        Borrowing savedBorrowing = borrowingRepository.save(borrowing);
        
        log.info("Successfully reported lost book for borrowing: {} with fine: {}", borrowingId, fine);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
} 