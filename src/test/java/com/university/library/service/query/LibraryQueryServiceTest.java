package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.LibrarySearchParams;
import com.university.library.entity.Library;
import com.university.library.entity.Campus;
import com.university.library.repository.LibraryRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryQueryServiceTest {

    @Mock
    private LibraryRepository libraryRepository;

    @InjectMocks
    private LibraryQueryService libraryQueryService;

    private Library testLibrary;
    private Campus testCampus;
    private UUID testLibraryId;
    private UUID testCampusId;

    @BeforeEach
    void setUp() {
        testLibraryId = UUID.randomUUID();
        testCampusId = UUID.randomUUID();
        
        testCampus = Campus.builder()
                .campusId(testCampusId)
                .name("Test Campus")
                .code("TC001")
                .address("Test Campus Address")
                .build();

        testLibrary = Library.builder()
                .libraryId(testLibraryId)
                .name("Test Library")
                .code("TL001")
                .address("Test Library Address")
                .campus(testCampus)
                .staff(new ArrayList<>())
                .bookCopies(new ArrayList<>())
                .build();
        testLibrary.setCreatedAt(Instant.now());
        testLibrary.setUpdatedAt(Instant.now());
    }

    @Test
    void testGetLibraryByIdReturnsValidResponse() {
        when(libraryRepository.findById(testLibraryId)).thenReturn(Optional.of(testLibrary));

        LibraryResponse result = libraryQueryService.getLibraryById(testLibraryId);

        assertNotNull(result);
        assertEquals(testLibraryId, result.getLibraryId());
        assertEquals("Test Library", result.getName());
        assertEquals("TL001", result.getCode());
        assertEquals("Test Library Address", result.getAddress());
        verify(libraryRepository).findById(testLibraryId);
    }

    @Test
    void testSearchLibrariesWithValidParamsReturnsPaginatedResults() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("ASC")
                .build();

        List<Library> libraries = List.of(testLibrary);
        Page<Library> libraryPage = new PageImpl<>(libraries, Pageable.ofSize(10), 1);

        when(libraryRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(libraryPage);

        PagedResponse<LibraryResponse> result = libraryQueryService.searchLibraries(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(0, result.getNumber());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
        verify(libraryRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testGetLibrariesByCampusIdReturnsValidList() {
        List<Library> libraries = List.of(testLibrary);
        when(libraryRepository.findByCampusCampusId(testCampusId)).thenReturn(libraries);

        List<LibraryResponse> result = libraryQueryService.getLibrariesByCampusId(testCampusId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testLibraryId, result.get(0).getLibraryId());
        verify(libraryRepository).findByCampusCampusId(testCampusId);
    }

    @Test
    void testGetLibraryByIdThrowsExceptionWhenNotFound() {
        when(libraryRepository.findById(testLibraryId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> libraryQueryService.getLibraryById(testLibraryId));

        assertTrue(exception.getMessage().contains("Library not found with ID"));
        verify(libraryRepository).findById(testLibraryId);
    }

    @Test
    void testGetLibraryByCodeThrowsExceptionWhenNotFound() {
        when(libraryRepository.findByCode("INVALID")).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> libraryQueryService.getLibraryByCode("INVALID"));

        assertTrue(exception.getMessage().contains("Library not found with code"));
        verify(libraryRepository).findByCode("INVALID");
    }

    @Test
    void testSearchLibrariesReturnsEmptyResponseWhenNoMatches() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .query("nonexistent")
                .page(0)
                .size(10)
                .build();

        Page<Library> emptyPage = new PageImpl<>(List.of(), Pageable.ofSize(10), 0);
        when(libraryRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(emptyPage);

        PagedResponse<LibraryResponse> result = libraryQueryService.searchLibraries(params);

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
        verify(libraryRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testGetLibraryByCodeReturnsValidResponse() {
        when(libraryRepository.findByCode("TL001")).thenReturn(testLibrary);

        LibraryResponse result = libraryQueryService.getLibraryByCode("TL001");

        assertNotNull(result);
        assertEquals(testLibraryId, result.getLibraryId());
        assertEquals("Test Library", result.getName());
        assertEquals("TL001", result.getCode());
        verify(libraryRepository).findByCode("TL001");
    }

    @Test
    void testGetLibrariesByCampusIdReturnsEmptyListWhenNoLibraries() {
        when(libraryRepository.findByCampusCampusId(testCampusId)).thenReturn(List.of());

        List<LibraryResponse> result = libraryQueryService.getLibrariesByCampusId(testCampusId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(libraryRepository).findByCampusCampusId(testCampusId);
    }

    @Test
    void testGetAllLibrariesReturnsCompleteList() {
        List<Library> libraries = List.of(testLibrary);
        when(libraryRepository.findAll()).thenReturn(libraries);

        List<LibraryResponse> result = libraryQueryService.getAllLibraries();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testLibraryId, result.get(0).getLibraryId());
        verify(libraryRepository).findAll();
    }

    @Test
    void testSearchLibrariesHandlesNullQueryParameter() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .query(null)
                .page(0)
                .size(10)
                .build();

        List<Library> libraries = List.of(testLibrary);
        Page<Library> libraryPage = new PageImpl<>(libraries, Pageable.ofSize(10), 1);
        when(libraryRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(libraryPage);

        PagedResponse<LibraryResponse> result = libraryQueryService.searchLibraries(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(libraryRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testSearchLibrariesWithComplexFilteringCriteria() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .campusId(testCampusId)
                .hasBookCopies(true)
                .hasStaff(true)
                .page(0)
                .size(10)
                .build();

        List<Library> libraries = List.of(testLibrary);
        Page<Library> libraryPage = new PageImpl<>(libraries, Pageable.ofSize(10), 1);
        when(libraryRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(libraryPage);

        PagedResponse<LibraryResponse> result = libraryQueryService.searchLibraries(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(libraryRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testSearchLibrariesHandlesInvalidSortDirection() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .page(0)
                .size(10)
                .sortBy("name")
                .sortDirection("INVALID")
                .build();

        // This should throw an IllegalArgumentException due to invalid sort direction
        assertThrows(IllegalArgumentException.class, 
                () -> libraryQueryService.searchLibraries(params));
    }

    @Test
    void testSearchLibrariesWithQueryParameterReturnsFilteredResults() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .query("Test")
                .page(0)
                .size(10)
                .build();

        List<Library> libraries = List.of(testLibrary);
        Page<Library> libraryPage = new PageImpl<>(libraries, Pageable.ofSize(10), 1);
        when(libraryRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(libraryPage);

        PagedResponse<LibraryResponse> result = libraryQueryService.searchLibraries(params);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Library", result.getContent().get(0).getName());
        verify(libraryRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testHandlesNullLibraryEntityFromRepository() {
        when(libraryRepository.findByCode("NULL_CODE")).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> libraryQueryService.getLibraryByCode("NULL_CODE"));

        assertTrue(exception.getMessage().contains("Library not found with code"));
        verify(libraryRepository).findByCode("NULL_CODE");
    }

    @Test
    void testSearchLibrariesHandlesDatabaseConnectionFailure() {
        LibrarySearchParams params = LibrarySearchParams.builder()
                .page(0)
                .size(10)
                .build();

        when(libraryRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database connection failed"));

        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> libraryQueryService.searchLibraries(params));

        assertEquals("Database connection failed", exception.getMessage());
        verify(libraryRepository).findAll(any(Specification.class), any(Pageable.class));
    }
}

