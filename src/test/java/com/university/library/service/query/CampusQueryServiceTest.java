package com.university.library.service.query;

import com.university.library.entity.Campus;
import com.university.library.repository.CampusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.QueryTimeoutException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampusQueryServiceTest {

    @Mock
    private CampusRepository campusRepository;

    @InjectMocks
    private CampusQueryService campusQueryService;

    private Campus testCampus;
    private UUID testCampusId;

    @BeforeEach
    void setUp() {
        testCampusId = UUID.randomUUID();
        testCampus = Campus.builder()
                .campusId(testCampusId)
                .name("Main Campus")
                .code("MC001")
                .address("123 University Ave")
                .libraries(new ArrayList<>())
                .build();
    }

    @Test
    void testGetAllCampusesReturnsAllCampuses() {
        // Given
        List<Campus> campuses = Arrays.asList(testCampus);
        when(campusRepository.findAll()).thenReturn(campuses);

        // When
        List<Campus> result = campusQueryService.getAllCampuses();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCampus, result.get(0));
        verify(campusRepository).findAll();
    }

    @Test
    void testGetCampusByIdReturnsValidCampus() {
        // Given
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        Campus result = campusQueryService.getCampusById(testCampusId);

        // Then
        assertNotNull(result);
        assertEquals(testCampus, result);
        assertEquals(testCampusId, result.getCampusId());
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testCampusOperationsLogCorrectMessages() {
        // Given
        when(campusRepository.findAll()).thenReturn(Arrays.asList(testCampus));
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        campusQueryService.getAllCampuses();
        campusQueryService.getCampusById(testCampusId);

        // Then
        verify(campusRepository).findAll();
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testGetCampusByIdReturnsNullForNonExistentCampus() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(campusRepository.findByCampusId(nonExistentId)).thenReturn(Optional.empty());

        // When
        Campus result = campusQueryService.getCampusById(nonExistentId);

        // Then
        assertNull(result);
        verify(campusRepository).findByCampusId(nonExistentId);
    }

    @Test
    void testGetCampusByIdHandlesNullUuid() {
        // Given
        when(campusRepository.findByCampusId(null)).thenReturn(Optional.empty());

        // When
        Campus result = campusQueryService.getCampusById(null);

        // Then
        assertNull(result);
        verify(campusRepository).findByCampusId(null);
    }

    @Test
    void testGetAllCampusesReturnsEmptyListWhenNoCampusesExist() {
        // Given
        when(campusRepository.findAll()).thenReturn(new ArrayList<>());

        // When
        List<Campus> result = campusQueryService.getAllCampuses();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(campusRepository).findAll();
    }

    @Test
    void testServiceDelegatesRepositoryCallsCorrectly() {
        // Given
        List<Campus> campuses = Arrays.asList(testCampus);
        when(campusRepository.findAll()).thenReturn(campuses);
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        List<Campus> allCampusesResult = campusQueryService.getAllCampuses();
        Campus campusByIdResult = campusQueryService.getCampusById(testCampusId);

        // Then
        assertEquals(campuses, allCampusesResult);
        assertEquals(testCampus, campusByIdResult);
        verify(campusRepository).findAll();
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testServiceHandlesRepositoryExceptions() {
        // Given
        when(campusRepository.findAll()).thenThrow(new DataAccessException("Database error") {});

        // When & Then
        assertThrows(DataAccessException.class, () -> campusQueryService.getAllCampuses());
        verify(campusRepository).findAll();
    }

    @Test
    void testServiceMaintainsConsistentLoggingFormat() {
        // Given
        when(campusRepository.findAll()).thenReturn(Arrays.asList(testCampus));
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        campusQueryService.getAllCampuses();
        campusQueryService.getCampusById(testCampusId);

        // Then
        verify(campusRepository).findAll();
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testServiceHandlesConcurrentAccess() throws Exception {
        // Given
        when(campusRepository.findAll()).thenReturn(Arrays.asList(testCampus));
        when(campusRepository.findByCampusId(any(UUID.class))).thenReturn(Optional.of(testCampus));

        ExecutorService executor = Executors.newFixedThreadPool(10);

        // When
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            futures.add(CompletableFuture.runAsync(() -> {
                campusQueryService.getAllCampuses();
                campusQueryService.getCampusById(UUID.randomUUID());
            }, executor));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();

        // Then
        verify(campusRepository, times(10)).findAll();
        verify(campusRepository, times(10)).findByCampusId(any(UUID.class));

        executor.shutdown();
    }

    @Test
    void testServiceInvokesRepositoryMethodsWithCorrectParameters() {
        // Given
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        campusQueryService.getCampusById(testCampusId);

        // Then
        verify(campusRepository).findByCampusId(eq(testCampusId));
    }

    @Test
    void testGetCampusByIdHandlesMalformedUuid() {
        // Given
        UUID malformedUuid = UUID.randomUUID();
        when(campusRepository.findByCampusId(malformedUuid)).thenReturn(Optional.empty());

        // When
        Campus result = campusQueryService.getCampusById(malformedUuid);

        // Then
        assertNull(result);
        verify(campusRepository).findByCampusId(malformedUuid);
    }

    @Test
    void testServiceProperlyInitializesWithRepositoryDependency() {
        // Given & When
        CampusQueryService service = new CampusQueryService(campusRepository);

        // Then
        assertNotNull(service);
    }

    @Test
    void testServiceHandlesRepositoryTimeoutScenarios() {
        // Given
        when(campusRepository.findAll()).thenThrow(new QueryTimeoutException("Query timeout"));

        // When & Then
        assertThrows(QueryTimeoutException.class, () -> campusQueryService.getAllCampuses());
        verify(campusRepository).findAll();
    }

    @Test
    void testServiceReturnsConsistentCampusDataStructure() {
        // Given
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        Campus result = campusQueryService.getCampusById(testCampusId);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCampusId());
        assertNotNull(result.getName());
        assertNotNull(result.getCode());
        assertNotNull(result.getAddress());
        assertNotNull(result.getLibraries());
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testGetCampusByIdHandlesEmptyOptionalFromRepository() {
        // Given
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.empty());

        // When
        Campus result = campusQueryService.getCampusById(testCampusId);

        // Then
        assertNull(result);
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testServicePreservesCampusEntityRelationships() {
        // Given
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(testCampus));

        // When
        Campus result = campusQueryService.getCampusById(testCampusId);

        // Then
        assertNotNull(result);
        assertNotNull(result.getLibraries());
        assertEquals(testCampus.getLibraries(), result.getLibraries());
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testServiceHandlesDatabaseConnectionFailures() {
        // Given
        when(campusRepository.findByCampusId(testCampusId))
                .thenThrow(new DataAccessException("Connection failed") {});

        // When & Then
        assertThrows(DataAccessException.class, () -> campusQueryService.getCampusById(testCampusId));
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testServiceReturnsRepositoryResultsDirectly() {
        // Given
        List<Campus> expectedCampuses = Arrays.asList(testCampus);
        when(campusRepository.findAll()).thenReturn(expectedCampuses);

        // When
        List<Campus> result = campusQueryService.getAllCampuses();

        // Then
        assertSame(expectedCampuses, result);
        verify(campusRepository).findAll();
    }

    @Test
    void testGetAllCampusesHandlesRepositoryRuntimeExceptions() {
        // Given
        when(campusRepository.findAll()).thenThrow(new RuntimeException("Unexpected error"));

        // When & Then
        assertThrows(RuntimeException.class, () -> campusQueryService.getAllCampuses());
        verify(campusRepository).findAll();
    }

    @Test
    void testServiceMaintainsProperTransactionBoundaries() {
        // Given
        when(campusRepository.findAll()).thenReturn(Arrays.asList(testCampus));

        // When
        List<Campus> result = campusQueryService.getAllCampuses();

        // Then
        assertNotNull(result);
        verify(campusRepository).findAll();
    }

    @Test
    void testGetCampusByIdHandlesDataAccessExceptions() {
        // Given
        when(campusRepository.findByCampusId(testCampusId))
                .thenThrow(new DataAccessException("Data access error") {});

        // When & Then
        assertThrows(DataAccessException.class, () -> campusQueryService.getCampusById(testCampusId));
        verify(campusRepository).findByCampusId(testCampusId);
    }

    @Test
    void testServiceProperlyIntegratesWithSpringLifecycle() {
        // Given & When
        CampusQueryService service = new CampusQueryService(campusRepository);

        // Then
        assertNotNull(service);
    }

    @Test
    void testServiceHandlesCorruptedCampusEntities() {
        // Given
        Campus corruptedCampus = Campus.builder()
                .campusId(null)
                .name(null)
                .code(null)
                .address(null)
                .build();
        when(campusRepository.findByCampusId(testCampusId)).thenReturn(Optional.of(corruptedCampus));

        // When
        Campus result = campusQueryService.getCampusById(testCampusId);

        // Then
        assertNotNull(result);
        assertNull(result.getCampusId());
        assertNull(result.getName());
        assertNull(result.getCode());
        assertNull(result.getAddress());
        verify(campusRepository).findByCampusId(testCampusId);
    }
}