package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.BookCopySearchParams;
import com.university.library.dto.CreateBookCopyCommand;
import com.university.library.dto.CreateBookCopyFromBookCommand;
import com.university.library.service.command.BookCopyCommandService;
import com.university.library.service.query.BookCopyQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * BookCopyFacade - Facade pattern để kết hợp BookCopy Query và Command operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookCopyFacade {

    private final BookCopyQueryService bookCopyQueryService;
    private final BookCopyCommandService bookCopyCommandService;
    

    // ==================== QUERY OPERATIONS ====================

    /**
     * Lấy thông tin book copy theo ID với cache
     */
    public BookCopyResponse getBookCopyById(UUID bookCopyId) {
        log.info("BookCopyFacade: Getting book copy by ID: {}", bookCopyId);
        return bookCopyQueryService.getBookCopyById(bookCopyId);
    }

    /**
     * Tìm kiếm book copies với cache
     */
    public PagedResponse<BookCopyResponse> searchBookCopies(BookCopySearchParams params) {
        log.info("BookCopyFacade: Searching book copies with params: {}", params);
        return bookCopyQueryService.searchBookCopies(params);
    }

    /**
     * Lấy book copies theo book ID
     */
    public List<BookCopyResponse> getBookCopiesByBookId(UUID bookId) {
        log.info("BookCopyFacade: Getting book copies by book ID: {}", bookId);
        return bookCopyQueryService.getBookCopiesByBookId(bookId);
    }

    /**
     * Lấy book copies theo library ID
     */
    public List<BookCopyResponse> getBookCopiesByLibraryId(UUID libraryId) {
        log.info("BookCopyFacade: Getting book copies by library ID: {}", libraryId);
        return bookCopyQueryService.getBookCopiesByLibraryId(libraryId);
    }

    /**
     * Lấy available book copies theo book ID
     */
    public List<BookCopyResponse> getAvailableBookCopiesByBookId(UUID bookId) {
        log.info("BookCopyFacade: Getting available book copies by book ID: {}", bookId);
        return bookCopyQueryService.getAvailableBookCopiesByBookId(bookId);
    }

    /**
     * Lấy book copy theo QR code
     */
    public BookCopyResponse getBookCopyByQrCode(String qrCode) {
        log.info("BookCopyFacade: Getting book copy by QR code: {}", qrCode);
        return bookCopyQueryService.getBookCopyByQrCode(qrCode);
    }

    /**
     * Kiểm tra xem book copy có trong cache không
     */
    public boolean isBookCopyCached(UUID bookCopyId) {
        return bookCopyQueryService.isBookCopyCached(bookCopyId);
    }

    /**
     * Lấy TTL của book copy trong cache
     */
    public Long getBookCopyCacheTtl(UUID bookCopyId) {
        return bookCopyQueryService.getBookCopyCacheTtl(bookCopyId);
    }

    // ==================== COMMAND OPERATIONS ====================

    /**
     * Tạo book copy mới
     */
    public BookCopyResponse createBookCopy(CreateBookCopyCommand command) {
        log.info("BookCopyFacade: Creating new book copy with QR code: {}", command.getQrCode());
        return bookCopyCommandService.createBookCopy(command);
    }

    /**
     * Tạo book copies cho một book đã tồn tại
     */
    public void createBookCopiesFromBook(CreateBookCopyFromBookCommand command) {
        log.info("BookCopyFacade: Creating {} book copies for book: {}", command.getCopies().size(), command.getBookId());
        bookCopyCommandService.createBookCopiesFromBook(command);
    }

    /**
     * Cập nhật book copy
     */
    public BookCopyResponse updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command) {
        log.info("BookCopyFacade: Updating book copy with ID: {}", bookCopyId);
        return bookCopyCommandService.updateBookCopy(bookCopyId, command);
    }

    /**
     * Xóa book copy
     */
    public void deleteBookCopy(UUID bookCopyId) {
        log.info("BookCopyFacade: Deleting book copy with ID: {}", bookCopyId);
        bookCopyCommandService.deleteBookCopy(bookCopyId);
    }

    /**
     * Thay đổi trạng thái book copy
     */
    public BookCopyResponse changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus) {
        log.info("BookCopyFacade: Changing book copy status: {} -> {}", bookCopyId, newStatus);
        return bookCopyCommandService.changeBookCopyStatus(bookCopyId, newStatus);
    }

    // ==================== CACHE MANAGEMENT ====================

    /**
     * Xóa cache cho một book copy cụ thể
     */
    public void clearBookCopyCache(UUID bookCopyId) {
        log.info("BookCopyFacade: Clearing cache for book copy: {}", bookCopyId);
        bookCopyQueryService.clearBookCopyCache(bookCopyId);
        bookCopyCommandService.clearBookCopyCache(bookCopyId);
    }

    /**
     * Xóa cache cho nhiều book copies
     */
    public void clearBookCopiesCache(List<UUID> bookCopyIds) {
        log.info("BookCopyFacade: Clearing cache for {} book copies", bookCopyIds.size());
        bookCopyQueryService.clearBookCopiesCache(bookCopyIds);
        bookCopyCommandService.clearBookCopiesCache(bookCopyIds);
    }

    /**
     * Xóa toàn bộ search cache
     */
    public void clearSearchCache() {
        log.info("BookCopyFacade: Clearing all search cache");
        bookCopyQueryService.clearSearchCache();
    }

    /**
     * Xóa cache cho một tìm kiếm cụ thể
     */
    public void clearSearchCache(BookCopySearchParams params) {
        log.info("BookCopyFacade: Clearing search cache for specific params");
        bookCopyQueryService.clearSearchCache(params);
    }

    /**
     * Xóa toàn bộ cache
     */
    public void clearAllCache() {
        log.info("BookCopyFacade: Clearing all book copy cache");
        // CACHE DISABLED;
    }

    // ==================== HEALTH CHECK ====================

    /**
     * Health check cho BookCopy service
     */
    public boolean isHealthy() {
        try {
            // Kiểm tra các dependencies
            // Trong thực tế, bạn sẽ kiểm tra database, cache, kafka connections
            return true;
        } catch (Exception e) {
            log.error("BookCopyFacade health check failed: {}", e.getMessage());
            return false;
        }
    }
} 

