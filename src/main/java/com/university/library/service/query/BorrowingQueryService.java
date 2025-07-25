package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BorrowingResponse;
import com.university.library.entity.Borrowing;
import com.university.library.repository.BorrowingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BorrowingQueryService {

    private final BorrowingRepository borrowingRepository;

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
        Page<Borrowing> borrowingPage = borrowingRepository.findByBorrowerAccountId(userId, pageable);
        
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
     * Lấy borrowings theo trạng thái
     */
    public List<BorrowingResponse> getBorrowingsByStatus(Borrowing.BorrowingStatus status) {
        log.info("Getting borrowings by status: {}", status);
        
        List<Borrowing> borrowings = borrowingRepository.findByStatus(status);
        
        return borrowings.stream()
            .map(BorrowingResponse::fromEntity)
            .collect(Collectors.toList());
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
     * Lấy borrowings theo thư viện
     */
    public List<BorrowingResponse> getBorrowingsByLibrary(UUID libraryId) {
        log.info("Getting borrowings by library: {}", libraryId);
        
        List<Borrowing> borrowings = borrowingRepository.findByLibraryId(libraryId);
        
        return borrowings.stream()
            .map(BorrowingResponse::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Lấy borrowings theo thời gian
     */
    public List<BorrowingResponse> getBorrowingsByDateRange(Instant startDate, Instant endDate) {
        log.info("Getting borrowings by date range: {} to {}", startDate, endDate);
        
        List<Borrowing> borrowings = borrowingRepository.findByBorrowedDateBetween(startDate, endDate);
        
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
     * Kiểm tra xem book copy có đang được mượn không
     */
    public boolean isBookCopyCurrentlyBorrowed(UUID bookCopyId) {
        log.info("Checking if book copy is currently borrowed: {}", bookCopyId);
        
        return borrowingRepository.isBookCopyCurrentlyBorrowed(bookCopyId);
    }

    /**
     * Đếm số sách đang mượn của một người dùng
     */
    public long countActiveBorrowingsByUser(UUID userId) {
        log.info("Counting active borrowings for user: {}", userId);
        
        return borrowingRepository.countActiveBorrowingsByBorrower(userId);
    }
} 