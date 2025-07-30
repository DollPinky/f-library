package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BorrowingResponse;
import com.university.library.entity.Borrowing;
import com.university.library.repository.BorrowingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BorrowingQueryServiceTest {

    @Mock
    private BorrowingRepository borrowingRepository;

    @InjectMocks
    private BorrowingQueryService borrowingQueryService;

    private Borrowing borrowing;
    private BorrowingResponse borrowingResponse;
    private UUID borrowingId;
    private UUID userId;
    private UUID libraryId;
    private UUID bookCopyId;

    @BeforeEach
    void setUp() {
        borrowingId = UUID.randomUUID();
        userId = UUID.randomUUID();
        libraryId = UUID.randomUUID();
        bookCopyId = UUID.randomUUID();
        
        borrowing = new Borrowing();
        borrowing.setBorrowingId(borrowingId);
        borrowing.setStatus(Borrowing.BorrowingStatus.BORROWED);
        
        borrowingResponse = BorrowingResponse.builder()
            .borrowingId(borrowingId)
            .status(Borrowing.BorrowingStatus.BORROWED)
            .build();
    }

    @Test
    void testGetAllBorrowingsWithPaginationNoFilters() {
        // Given
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findAll(pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, null, null);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            assertEquals(1, result.getTotalElements());
            assertEquals(1, result.getTotalPages());
            assertEquals(page, result.getNumber());
            assertEquals(size, result.getSize());
            verify(borrowingRepository).findAll(pageable);
        }
    }

    @Test
    void testGetAllBorrowingsWithStatusAndQueryFilters() {
        // Given
        int page = 0;
        int size = 10;
        String status = "BORROWED";
        String query = "test";
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findByStatusAndQuery(Borrowing.BorrowingStatus.BORROWED, query, pageable))
            .thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, status, query);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(borrowingRepository).findByStatusAndQuery(Borrowing.BorrowingStatus.BORROWED, query, pageable);
        }
    }

    @Test
    void testGetBorrowingByValidId() {
        // Given
        when(borrowingRepository.findById(borrowingId)).thenReturn(Optional.of(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            BorrowingResponse result = borrowingQueryService.getBorrowingById(borrowingId);

            // Then
            assertNotNull(result);
            assertEquals(borrowingId, result.getBorrowingId());
            verify(borrowingRepository).findById(borrowingId);
        }
    }

    @Test
    void testGetAllBorrowingsWithInvalidStatus() {
        // Given
        int page = 0;
        int size = 10;
        String invalidStatus = "INVALID_STATUS";
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findAll(pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, invalidStatus, null);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(borrowingRepository).findAll(pageable);
        }
    }

    @Test
    void testGetBorrowingByNonExistentId() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(borrowingRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> borrowingQueryService.getBorrowingById(nonExistentId));
        
        assertTrue(exception.getMessage().contains("Borrowing not found with ID"));
        verify(borrowingRepository).findById(nonExistentId);
    }

    @Test
    void testGetAllBorrowingsWithEmptyOrNullParameters() {
        // Given
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findAll(pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result1 = borrowingQueryService.getAllBorrowings(page, size, "", "");
            PagedResponse<BorrowingResponse> result2 = borrowingQueryService.getAllBorrowings(page, size, null, null);

            // Then
            assertNotNull(result1);
            assertNotNull(result2);
            verify(borrowingRepository, times(2)).findAll(pageable);
        }
    }

    @Test
    void testGetBorrowingsByUserWithPagination() {
        // Given
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findByBorrowerAccountId(userId, pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getBorrowingsByUser(userId, page, size);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            assertEquals(1, result.getTotalElements());
            verify(borrowingRepository).findByBorrowerAccountId(userId, pageable);
        }
    }

    @Test
    void testGetBorrowingsByDateRangeWithNoResults() {
        // Given
        Instant startDate = Instant.now().minusSeconds(86400);
        Instant endDate = Instant.now();
        
        when(borrowingRepository.findByBorrowedDateBetween(startDate, endDate))
            .thenReturn(Collections.emptyList());

        // When
        List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByDateRange(startDate, endDate);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(borrowingRepository).findByBorrowedDateBetween(startDate, endDate);
    }

    @Test
    void testGetOverdueBorrowingsReturnsCorrectList() {
        // Given
        when(borrowingRepository.findOverdueBorrowings(any(Instant.class)))
            .thenReturn(Arrays.asList(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            List<BorrowingResponse> result = borrowingQueryService.getOverdueBorrowings();

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            verify(borrowingRepository).findOverdueBorrowings(any(Instant.class));
        }
    }

    @Test
    void testGetBorrowingsByDateRangeWithInvalidDates() {
        // Given
        Instant startDate = null;
        Instant endDate = null;
        
        when(borrowingRepository.findByBorrowedDateBetween(startDate, endDate))
            .thenReturn(Collections.emptyList());

        // When
        List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByDateRange(startDate, endDate);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(borrowingRepository).findByBorrowedDateBetween(startDate, endDate);
    }

    @Test
    void testGetBorrowingsByLibraryReturnsCorrectList() {
        // Given
        when(borrowingRepository.findByLibraryId(libraryId))
            .thenReturn(Arrays.asList(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByLibrary(libraryId);

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            verify(borrowingRepository).findByLibraryId(libraryId);
        }
    }

    @Test
    void testCountActiveBorrowingsByUserWithMixedStatuses() {
        // Given
        long expectedCount = 2L;
        when(borrowingRepository.countActiveBorrowingsByBorrower(userId)).thenReturn(expectedCount);

        // When
        long result = borrowingQueryService.countActiveBorrowingsByUser(userId);

        // Then
        assertEquals(expectedCount, result);
        verify(borrowingRepository).countActiveBorrowingsByBorrower(userId);
    }

    @Test
    void testGetBorrowingsByStatusReturnsCorrectList() {
        // Given
        Borrowing.BorrowingStatus status = Borrowing.BorrowingStatus.BORROWED;
        when(borrowingRepository.findByStatus(status))
            .thenReturn(Arrays.asList(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByStatus(status);

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            verify(borrowingRepository).findByStatus(status);
        }
    }

    @Test
    void testIsBookCopyCurrentlyBorrowedWithActiveStatuses() {
        // Given
        when(borrowingRepository.isBookCopyCurrentlyBorrowed(bookCopyId)).thenReturn(true);

        // When
        boolean result = borrowingQueryService.isBookCopyCurrentlyBorrowed(bookCopyId);

        // Then
        assertTrue(result);
        verify(borrowingRepository).isBookCopyCurrentlyBorrowed(bookCopyId);
    }

    @Test
    void testGetAllBorrowingsWithQueryFilterOnly() {
        // Given
        int page = 0;
        int size = 10;
        String query = "test";
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findByQuery(query, pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, null, query);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(borrowingRepository).findByQuery(query, pageable);
        }
    }

    @Test
    void testCountActiveBorrowingsByUserWithNoBorrowings() {
        // Given
        when(borrowingRepository.countActiveBorrowingsByBorrower(userId)).thenReturn(0L);

        // When
        long result = borrowingQueryService.countActiveBorrowingsByUser(userId);

        // Then
        assertEquals(0L, result);
        verify(borrowingRepository).countActiveBorrowingsByBorrower(userId);
    }

    @Test
    void testGetAllBorrowingsWithStatusFilterOnly() {
        // Given
        int page = 0;
        int size = 10;
        String status = "BORROWED";
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findByStatus(Borrowing.BorrowingStatus.BORROWED, pageable))
            .thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, status, null);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(borrowingRepository).findByStatus(Borrowing.BorrowingStatus.BORROWED, pageable);
        }
    }

    @Test
    void testIsBookCopyCurrentlyBorrowedWithInactiveStatuses() {
        // Given
        when(borrowingRepository.isBookCopyCurrentlyBorrowed(bookCopyId)).thenReturn(false);

        // When
        boolean result = borrowingQueryService.isBookCopyCurrentlyBorrowed(bookCopyId);

        // Then
        assertFalse(result);
        verify(borrowingRepository).isBookCopyCurrentlyBorrowed(bookCopyId);
    }

    @Test
    void testGetBorrowingsByDateRangeWithValidDates() {
        // Given
        Instant startDate = Instant.parse("2023-01-01T00:00:00Z");
        Instant endDate = Instant.parse("2023-12-31T23:59:59Z");
        
        when(borrowingRepository.findByBorrowedDateBetween(startDate, endDate))
            .thenReturn(Arrays.asList(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByDateRange(startDate, endDate);

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(borrowingResponse, result.get(0));
            verify(borrowingRepository).findByBorrowedDateBetween(startDate, endDate);
        }
    }

    @Test
    void testGetBorrowingsByUserWithMultipleBorrowings() {
        // Given
        int page = 0;
        int size = 10;
        Borrowing borrowing2 = new Borrowing();
        borrowing2.setBorrowingId(UUID.randomUUID());
        borrowing2.setStatus(Borrowing.BorrowingStatus.RETURNED);
        
        BorrowingResponse borrowingResponse2 = BorrowingResponse.builder()
            .borrowingId(borrowing2.getBorrowingId())
            .status(Borrowing.BorrowingStatus.RETURNED)
            .build();
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing, borrowing2), pageable, 2);

        when(borrowingRepository.findByBorrowerAccountId(userId, pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing2)).thenReturn(borrowingResponse2);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getBorrowingsByUser(userId, page, size);

            // Then
            assertNotNull(result);
            assertEquals(2, result.getContent().size());
            assertEquals(2, result.getTotalElements());
            verify(borrowingRepository).findByBorrowerAccountId(userId, pageable);
        }
    }

    @Test
    void testGetBorrowingsByLibraryWithExistingBorrowings() {
        // Given
        when(borrowingRepository.findByLibraryId(libraryId))
            .thenReturn(Arrays.asList(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByLibrary(libraryId);

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(borrowingResponse, result.get(0));
            verify(borrowingRepository).findByLibraryId(libraryId);
        }
    }

    @Test
    void testGetAllBorrowingsWithPageSizeLargerThanResults() {
        // Given
        int page = 0;
        int size = 100;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findAll(pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, null, null);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            assertEquals(1, result.getTotalElements());
            assertEquals(1, result.getTotalPages());
            assertEquals(page, result.getNumber());
            assertEquals(size, result.getSize());
            verify(borrowingRepository).findAll(pageable);
        }
    }

    @Test
    void testGetBorrowingsByNonExistentUser() {
        // Given
        UUID nonExistentUserId = UUID.randomUUID();
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(borrowingRepository.findByBorrowerAccountId(nonExistentUserId, pageable)).thenReturn(emptyPage);

        // When
        PagedResponse<BorrowingResponse> result = borrowingQueryService.getBorrowingsByUser(nonExistentUserId, page, size);

        // Then
        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
        verify(borrowingRepository).findByBorrowerAccountId(nonExistentUserId, pageable);
    }

    @Test
    void testGetBorrowingsByNonExistentLibrary() {
        // Given
        UUID nonExistentLibraryId = UUID.randomUUID();
        when(borrowingRepository.findByLibraryId(nonExistentLibraryId))
            .thenReturn(Collections.emptyList());

        // When
        List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByLibrary(nonExistentLibraryId);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(borrowingRepository).findByLibraryId(nonExistentLibraryId);
    }

    @Test
    void testGetBorrowingByIdWhenExists() {
        // Given
        when(borrowingRepository.findById(borrowingId)).thenReturn(Optional.of(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            BorrowingResponse result = borrowingQueryService.getBorrowingById(borrowingId);

            // Then
            assertNotNull(result);
            assertEquals(borrowingResponse, result);
            verify(borrowingRepository).findById(borrowingId);
        }
    }

    @Test
    void testIsBookCopyCurrentlyBorrowedWhenBorrowed() {
        // Given
        when(borrowingRepository.isBookCopyCurrentlyBorrowed(bookCopyId)).thenReturn(true);

        // When
        boolean result = borrowingQueryService.isBookCopyCurrentlyBorrowed(bookCopyId);

        // Then
        assertTrue(result);
        verify(borrowingRepository).isBookCopyCurrentlyBorrowed(bookCopyId);
    }

    @Test
    void testGetBorrowingsByDateRangeWithNullDates() {
        // Given
        Instant startDate = null;
        Instant endDate = null;
        
        when(borrowingRepository.findByBorrowedDateBetween(startDate, endDate))
            .thenReturn(Collections.emptyList());

        // When
        List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByDateRange(startDate, endDate);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(borrowingRepository).findByBorrowedDateBetween(startDate, endDate);
    }

    @Test
    void testCountActiveBorrowingsByUserWithMultipleActive() {
        // Given
        long expectedCount = 5L;
        when(borrowingRepository.countActiveBorrowingsByBorrower(userId)).thenReturn(expectedCount);

        // When
        long result = borrowingQueryService.countActiveBorrowingsByUser(userId);

        // Then
        assertEquals(expectedCount, result);
        verify(borrowingRepository).countActiveBorrowingsByBorrower(userId);
    }

    @Test
    void testGetAllBorrowingsWithEmptyQueryString() {
        // Given
        int page = 0;
        int size = 10;
        String emptyQuery = "";
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Borrowing> borrowingPage = new PageImpl<>(Arrays.asList(borrowing), pageable, 1);

        when(borrowingRepository.findAll(pageable)).thenReturn(borrowingPage);

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            PagedResponse<BorrowingResponse> result = borrowingQueryService.getAllBorrowings(page, size, null, emptyQuery);

            // Then
            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(borrowingRepository).findAll(pageable);
            verify(borrowingRepository, never()).findByQuery(anyString(), any());
        }
    }

    @Test
    void testGetOverdueBorrowingsWithExistingOverdue() {
        // Given
        when(borrowingRepository.findOverdueBorrowings(any(Instant.class)))
            .thenReturn(Arrays.asList(borrowing));

        try (MockedStatic<BorrowingResponse> mockedStatic = mockStatic(BorrowingResponse.class)) {
            mockedStatic.when(() -> BorrowingResponse.fromEntity(borrowing)).thenReturn(borrowingResponse);

            // When
            List<BorrowingResponse> result = borrowingQueryService.getOverdueBorrowings();

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(borrowingResponse, result.get(0));
            verify(borrowingRepository).findOverdueBorrowings(any(Instant.class));
        }
    }

    @Test
    void testGetBorrowingsByDateRangeWithInvalidDateOrder() {
        // Given
        Instant startDate = Instant.parse("2023-12-31T23:59:59Z");
        Instant endDate = Instant.parse("2023-01-01T00:00:00Z");
        
        when(borrowingRepository.findByBorrowedDateBetween(startDate, endDate))
            .thenReturn(Collections.emptyList());

        // When
        List<BorrowingResponse> result = borrowingQueryService.getBorrowingsByDateRange(startDate, endDate);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(borrowingRepository).findByBorrowedDateBetween(startDate, endDate);
    }
}

