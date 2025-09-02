package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.response.borrowing.BorrowingResponse;

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
    BorrowingResponse Borrow(String bookCopyId, UUID borrowerId);
    BorrowingResponse returnBook(String bookCopyId);
    BorrowingResponse reportLost(String bookCopyId);

}
