package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.dto.response.borrowing.BorrowingResponse;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Borrowing;
import com.university.library.entity.User;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.BorrowingRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.university.library.entity.Borrowing.BorrowingStatus.BORROWED;

@Slf4j
@Service
@RequiredArgsConstructor
public class BorrowingServiceImpl implements BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;

    /**
     * Borrowing Query
     */


    /**
     * Lấy tất cả borrowings với pagination và filter
     */
    public PagedResponse<BorrowingResponse> getAllBorrowings(int page, int size, String status, String query) {
        log.info("Querying borrowings - page: {}, size: {}, status: {}, query: {}", page, size, status, query);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingsPage;

        if (status != null && !status.isEmpty()) {
            try {
                Borrowing.BorrowingStatus borrowingStatus = Borrowing.BorrowingStatus.valueOf(status);
                if (query != null && !query.isEmpty()) {
                    // Filter by both status and query
                    borrowingsPage = borrowingRepository.findByStatusAndQuery(borrowingStatus, query, pageable);
                } else {
                    // Filter by status only
                    borrowingsPage = borrowingRepository.findByStatus(borrowingStatus, pageable);
                }
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}, falling back to all borrowings", status);
                borrowingsPage = borrowingRepository.findAll(pageable);
            }
        } else if (query != null && !query.isEmpty()) {
            // Filter by query only
            borrowingsPage = borrowingRepository.findByQuery(query, pageable);
        } else {
            // No filters
            borrowingsPage = borrowingRepository.findAll(pageable);
        }

        List<BorrowingResponse> responses = borrowingsPage.getContent().stream()
                .map(BorrowingResponse::fromEntity)
                .toList();

        log.info("Found {} borrowings out of {} total", responses.size(), borrowingsPage.getTotalElements());

        return PagedResponse.<BorrowingResponse>builder()
                .content(responses)
                .totalElements(borrowingsPage.getTotalElements())
                .totalPages(borrowingsPage.getTotalPages())
                .number(page)
                .size(size)
                .build();
    }

    /**
     * Lấy borrowings của một người dùng
     */
    public PagedResponse<BorrowingResponse> getBorrowingsByUser(UUID userId, int page, int size) {
        log.info("Getting borrowings for user: {} with pagination: page={}, size={}", userId, page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = borrowingRepository.findByBorrowerUserId(userId, pageable);

        List<BorrowingResponse> borrowings = borrowingPage.getContent().stream()
                .map(BorrowingResponse::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.of(
                borrowings,
                borrowingPage.getNumber(),
                borrowingPage.getSize(),
                borrowingPage.getTotalElements()
        );
    }



    /**
     * Lấy borrowings quá hạn
     */
    public List<BorrowingResponse> getOverdueBorrowings() {
        log.info("Getting overdue borrowings");

        List<Borrowing> borrowings = borrowingRepository.findOverdueBorrowings(Instant.now());

        return borrowings.stream()
                .map(BorrowingResponse::fromEntity)
                .collect(Collectors.toList());
    }



    /**
     * Lấy borrowing theo ID
     */
    public BorrowingResponse getBorrowingById(UUID borrowingId) {
        log.info("Getting borrowing by ID: {}", borrowingId);

        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Borrowing not found with ID: " + borrowingId));

        return BorrowingResponse.fromEntity(borrowing);
    }

    /**
     * Borrowing Command
     */

    /**
     * Tạo yêu cầu mượn sách hoặc đặt sách
     */
    @Transactional
    public BorrowingResponse Borrow(UUID bookCopyId, UUID borrowerId) {

        BookCopy bookCopy = bookCopyRepository.findByBookCopyId(bookCopyId);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + bookCopyId);
        }

        // Kiểm tra trạng thái sách
        if (!bookCopy.getStatus().equals(BookCopy.BookStatus.AVAILABLE)) {
            throw new RuntimeException("Sách không có sẵn để mượn");
        }

        User borrower = userRepository.findById(borrowerId)
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
    public BorrowingResponse returnBook(UUID bookCopyId) {

        // Tìm bản sao sách bằng QR code
        BookCopy bookCopy = bookCopyRepository.findByBookCopyId(bookCopyId);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + bookCopyId);
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
    public BorrowingResponse reportLost(UUID bookCopyId) {

        // Tìm bản sao sách bằng QR code
        BookCopy bookCopy = bookCopyRepository.findByBookCopyId(bookCopyId);
        if (bookCopy == null) {
            throw new RuntimeException("Không tìm thấy sách với mã QR: " + bookCopyId);
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
