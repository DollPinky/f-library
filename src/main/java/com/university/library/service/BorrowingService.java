package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.response.borrowing.BorrowingHistoryResponse;
import com.university.library.dto.response.borrowing.BorrowingResponse;
import com.university.library.dto.response.borrowing.BorrowingStateResponse;
import com.university.library.entity.Borrowing;

import java.util.List;
import java.util.UUID;

public interface BorrowingService {
    /**
     * BorrowingQuery
     */
    PagedResponse<BorrowingResponse> getAllBorrowings(int page, int size, String status, String query);
    PagedResponse<BorrowingResponse> getBorrowingsByUser(UUID userId, int page, int size);
    List<BorrowingResponse> getOverdueBorrowings();
    BorrowingResponse getBorrowingById(UUID borrowingId);
    /**
     BorrowingCommand
     */
    BorrowingResponse borrowBook(UUID bookCopyId, String companyAccount);
    BorrowingResponse returnBook(UUID bookCopyId);
    BorrowingResponse reportLost(UUID bookCopyId);

    List<BorrowingStateResponse> getMostBorrowStats(int limit);

    PagedResponse<BorrowingHistoryResponse> findBorrowingByBookCopy_BookCopyId(int page, int size, UUID bookCopyId);

}
