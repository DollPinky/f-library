package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.constants.LibraryConstants;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.LibrarySearchParams;
import com.university.library.dto.CreateLibraryCommand;
import com.university.library.service.LibraryFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/libraries")
@RequiredArgsConstructor
@Tag(name = "Library Management", description = "APIs for managing libraries in the library system")
public class LibraryController {
    
    private final LibraryFacade libraryFacade;
    
    @GetMapping("/{libraryId}")
    @Operation(summary = "Get library by ID", description = "Retrieve a specific library by its ID")
    public ResponseEntity<StandardResponse<LibraryResponse>> getLibraryById(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId) {
        try {
            log.info(LibraryConstants.API_GET_LIBRARY, libraryId);
            LibraryResponse response = libraryFacade.getLibraryById(libraryId);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARY_RETRIEVED, response));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_GET_LIBRARY, libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardResponse.error(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + libraryId));
        }
    }
    
    @GetMapping
    @Operation(summary = "Search libraries", description = "Search and filter libraries with pagination")
    public ResponseEntity<StandardResponse<PagedResponse<LibraryResponse>>> searchLibraries(
            @Parameter(description = "Search parameters") @ModelAttribute LibrarySearchParams params) {
        try {
            log.info(LibraryConstants.API_SEARCH_LIBRARIES, params);
            PagedResponse<LibraryResponse> response = libraryFacade.searchLibraries(params);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_SEARCH_LIBRARIES, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(LibraryConstants.ERROR_SEARCH_FAILED));
        }
    }
    
    @GetMapping("/campus/{campusId}")
    @Operation(summary = "Get libraries by campus ID", description = "Retrieve all libraries in a specific campus")
    public ResponseEntity<StandardResponse<List<LibraryResponse>>> getLibrariesByCampusId(
            @Parameter(description = "Campus ID") @PathVariable UUID campusId) {
        try {
            log.info(LibraryConstants.API_GET_BY_CAMPUS, campusId);
            List<LibraryResponse> response = libraryFacade.getLibrariesByCampusId(campusId);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting libraries by campus ID: {} - {}", campusId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Error retrieving libraries"));
        }
    }
    
    @GetMapping("/code/{code}")
    @Operation(summary = "Get library by code", description = "Retrieve a library by its code")
    public ResponseEntity<StandardResponse<LibraryResponse>> getLibraryByCode(
            @Parameter(description = "Library code") @PathVariable String code) {
        try {
            log.info(LibraryConstants.API_GET_BY_CODE, code);
            LibraryResponse response = libraryFacade.getLibraryByCode(code);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARY_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting library by code: {} - {}", code, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardResponse.error("Library not found with code: " + code));
        }
    }
    
    @GetMapping("/all")
    @Operation(summary = "Get all libraries", description = "Retrieve all libraries")
    public ResponseEntity<StandardResponse<List<LibraryResponse>>> getAllLibraries() {
        try {
            List<LibraryResponse> response = libraryFacade.getAllLibraries();
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARIES_RETRIEVED, response));
        } catch (Exception e) {
            log.error("Error getting all libraries: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Error retrieving libraries"));
        }
    }
    
    @PostMapping
    @Operation(summary = "Create library", description = "Create a new library")
    public ResponseEntity<StandardResponse<LibraryResponse>> createLibrary(
            @Parameter(description = "Library data") @Valid @RequestBody CreateLibraryCommand command) {
        try {
            log.info(LibraryConstants.API_CREATE_LIBRARY, command.getCode());
            LibraryResponse response = libraryFacade.createLibrary(command);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARY_CREATED, response));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_CREATE_LIBRARY, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{libraryId}")
    @Operation(summary = "Update library", description = "Update an existing library")
    public ResponseEntity<StandardResponse<LibraryResponse>> updateLibrary(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId,
            @Parameter(description = "Updated library data") @Valid @RequestBody CreateLibraryCommand command) {
        try {
            log.info(LibraryConstants.API_UPDATE_LIBRARY, libraryId);
            LibraryResponse response = libraryFacade.updateLibrary(libraryId, command);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARY_UPDATED, response));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_UPDATE_LIBRARY, libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{libraryId}")
    @Operation(summary = "Delete library", description = "Delete a library")
    public ResponseEntity<StandardResponse<String>> deleteLibrary(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId) {
        try {
            log.info(LibraryConstants.API_DELETE_LIBRARY, libraryId);
            libraryFacade.deleteLibrary(libraryId);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_LIBRARY_DELETED, null));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_DELETE_LIBRARY, libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(StandardResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{libraryId}/cache")
    @Operation(summary = "Clear library cache", description = "Clear cache for a specific library")
    public ResponseEntity<StandardResponse<LibraryCacheStatus>> clearLibraryCache(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId) {
        try {
            log.info(LibraryConstants.API_CLEAR_LIBRARY_CACHE, libraryId);
            boolean wasCached = libraryFacade.isLibraryCached(libraryId);
            libraryFacade.clearLibraryCache(libraryId);
            
            LibraryCacheStatus status = new LibraryCacheStatus(libraryId, wasCached, false);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_CACHE_CLEARED, status));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_CLEAR_CACHE, libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(LibraryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @DeleteMapping("/cache/search")
    @Operation(summary = "Clear search cache", description = "Clear all library search cache")
    public ResponseEntity<StandardResponse<Void>> clearSearchCache() {
        try {
            log.info(LibraryConstants.API_CLEAR_SEARCH_CACHE);
            libraryFacade.clearSearchCache();
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_CLEAR_SEARCH_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(LibraryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @DeleteMapping("/cache")
    @Operation(summary = "Clear all cache", description = "Clear all library cache")
    public ResponseEntity<StandardResponse<Void>> clearAllCache() {
        try {
            log.info(LibraryConstants.API_CLEAR_ALL_CACHE);
            libraryFacade.clearAllCache();
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_CACHE_CLEARED, null));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_CLEAR_ALL_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(LibraryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @PostMapping("/cache/bulk-clear")
    @Operation(summary = "Bulk clear cache", description = "Clear cache for multiple libraries")
    public ResponseEntity<StandardResponse<Void>> bulkClearCache(
            @Parameter(description = "List of library IDs") @RequestBody List<UUID> libraryIds) {
        try {
            log.info(LibraryConstants.API_BULK_CLEAR_CACHE, libraryIds.size());
            libraryFacade.clearLibrariesCache(libraryIds);
            return ResponseEntity.ok(StandardResponse.success(String.format(LibraryConstants.SUCCESS_CACHE_BULK_CLEARED, libraryIds.size()), null));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_BULK_CLEAR_CACHE, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(LibraryConstants.ERROR_CACHE_CLEAR_FAILED));
        }
    }
    
    @GetMapping("/{libraryId}/cache/status")
    @Operation(summary = "Get cache status", description = "Get cache status for a specific library")
    public ResponseEntity<StandardResponse<LibraryCacheStatus>> getCacheStatus(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId) {
        try {
            log.info(LibraryConstants.API_CACHE_STATUS, libraryId);
            boolean isCached = libraryFacade.isLibraryCached(libraryId);
            Long ttl = libraryFacade.getLibraryCacheTtl(libraryId);
            
            LibraryCacheStatus status = new LibraryCacheStatus(libraryId, isCached, ttl);
            return ResponseEntity.ok(StandardResponse.success(LibraryConstants.SUCCESS_CACHE_STATUS_RETRIEVED, status));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_CACHE_STATUS, libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(LibraryConstants.ERROR_CACHE_STATUS_FAILED));
        }
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check the health of the library service")
    public ResponseEntity<StandardResponse<HealthStatus>> healthCheck() {
        try {
            log.info(LibraryConstants.API_HEALTH_CHECK);
            boolean isHealthy = libraryFacade.isHealthy();
            
            HealthStatus status = new HealthStatus(isHealthy, LibraryConstants.SERVICE_NAME);
            String message = isHealthy ? LibraryConstants.SUCCESS_SERVICE_HEALTHY : LibraryConstants.ERROR_SERVICE_UNHEALTHY;
            
            return ResponseEntity.ok(StandardResponse.success(message, status));
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_LOG_HEALTH_CHECK, e.getMessage());
            HealthStatus status = new HealthStatus(false, LibraryConstants.SERVICE_NAME);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(StandardResponse.error(LibraryConstants.ERROR_SERVICE_UNHEALTHY, status));
        }
    }
    
    public static class LibraryCacheStatus {
        private final UUID libraryId;
        private final boolean isCached;
        private final Long ttl;
        
        public LibraryCacheStatus(UUID libraryId, boolean isCached, Long ttl) {
            this.libraryId = libraryId;
            this.isCached = isCached;
            this.ttl = ttl;
        }
        
        public LibraryCacheStatus(UUID libraryId, boolean isCached, boolean wasCached) {
            this.libraryId = libraryId;
            this.isCached = isCached;
            this.ttl = null;
        }
        
        public UUID getLibraryId() { return libraryId; }
        public boolean isCached() { return isCached; }
        public Long getTtl() { return ttl; }
    }
    
    public static class HealthStatus {
        private final boolean healthy;
        private final String serviceName;
        
        public HealthStatus(boolean healthy, String serviceName) {
            this.healthy = healthy;
            this.serviceName = serviceName;
        }
        
        public boolean isHealthy() { return healthy; }
        public String getServiceName() { return serviceName; }
    }
} 

