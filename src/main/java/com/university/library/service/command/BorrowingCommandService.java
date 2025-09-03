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
import java.time.LocalDateTime;
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
    public BorrowingResponse Borrow(String qrCode, UUID borrowerId) {
        log.info("Processing scan and borrow for QR: {} by user: {}", qrCode, borrowerId);

        // Tìm bản sao sách bằng QR code với lock để tránh race condition
        BookCopy bookCopy = bookCopyRepository.findByQrCodeWithLock(qrCode);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + qrCode);
        }

        // Kiểm tra trạng thái sách
        if (!bookCopy.getStatus().equals(BookCopy.BookStatus.AVAILABLE)) {
            throw new RuntimeException("Sách không có sẵn để mượn");
        }

        Account borrower = accountRepository.findById(borrowerId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        long activeBorrowings = borrowingRepository.countActiveBorrowingsByBorrower(borrowerId);
        if (activeBorrowings >= 5) {
            throw new RuntimeException("User has reached maximum number of active borrowings (5)");
        }

        // Tạo giao dịch mượn sách
        Borrowing borrowing = Borrowing.builder()
                .bookCopy(bookCopy)
                .borrower(borrower)
                .borrowedDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(30))
                .status(BORROWED)
                .build();

        Borrowing savedBorrowing = borrowingRepository.save(borrowing);

        // Cập nhật trạng thái sách thành BORROWED
        bookCopy.setStatus(BookCopy.BookStatus.BORROWED);
        bookCopyRepository.save(bookCopy);

        return BorrowingResponse.fromEntity(savedBorrowing);
    }
    

    /**
     * Trả sách
     */
    @Transactional
    public BorrowingResponse returnBook(String qrCode) {
        log.info("Returning book for QR code: {}", qrCode);

        // Tìm bản sao sách bằng QR code
        BookCopy bookCopy = bookCopyRepository.findByQrCode(qrCode);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + qrCode);
        }

        // Tìm borrowing mới nhất của book copy này
        Borrowing borrowing = borrowingRepository
                .findTopByBookCopyAndStatusOrderByCreatedAtDesc(
                        bookCopy,
                        Borrowing.BorrowingStatus.BORROWED
                )
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch mượn sách cho sách này"));

        if (!borrowing.getStatus().equals(Borrowing.BorrowingStatus.BORROWED)) {
            throw new RuntimeException("Sách không trong trạng thái đang mượn");
        }

        LocalDateTime returnDate = LocalDateTime.now();
        double fine = borrowing.calculateFine();

        if (returnDate.isAfter(borrowing.getDueDate())) {
            borrowing.setStatus(Borrowing.BorrowingStatus.OVERDUE);
        } else {
            borrowing.setStatus(Borrowing.BorrowingStatus.RETURNED);
        }

        borrowing.setReturnedDate(returnDate);
        borrowing.setFineAmount(fine);

        // Cập nhật trạng thái book copy
        bookCopy.setStatus(BookCopy.BookStatus.AVAILABLE);
        bookCopyRepository.save(bookCopy);

        Borrowing savedBorrowing = borrowingRepository.save(borrowing);

        log.info("Successfully returned book for borrowing: {} with status: {} and fine: {}",
                borrowing.getBorrowingId(), borrowing.getStatus(), fine);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }

    /**
     * Báo mất sách
     */
    @Transactional
    public BorrowingResponse reportLost(String qrCode) {
        log.info("Reporting lost book for QR code: {}", qrCode);

        // Tìm bản sao sách bằng QR code
        BookCopy bookCopy = bookCopyRepository.findByQrCode(qrCode);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + qrCode);
        }

        // Tìm borrowing mới nhất của book copy này
        Borrowing borrowing = borrowingRepository
                .findTopByBookCopyAndStatusOrderByCreatedAtDesc(
                        bookCopy,
                        Borrowing.BorrowingStatus.BORROWED
                )
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch mượn sách cho sách này"));

        if (!borrowing.getStatus().equals(BORROWED)) {
            throw new RuntimeException("Sách không trong trạng thái đang mượn");
        }

        double fine = 500000.0;

        borrowing.setStatus(Borrowing.BorrowingStatus.LOST);
        borrowing.setFineAmount(fine);

        bookCopy.setStatus(BookCopy.BookStatus.LOST);
        bookCopyRepository.save(bookCopy);

        Borrowing savedBorrowing = borrowingRepository.save(borrowing);

        log.info("Successfully reported lost book for borrowing: {} with fine: {}",
                borrowing.getBorrowingId(), fine);
        return BorrowingResponse.fromEntity(savedBorrowing);
    }
} 