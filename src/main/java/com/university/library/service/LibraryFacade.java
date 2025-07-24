package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.constants.LibraryConstants;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.LibrarySearchParams;
import com.university.library.dto.CreateLibraryCommand;
import com.university.library.service.command.LibraryCommandService;
import com.university.library.service.query.LibraryQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryFacade {
    
    private final LibraryQueryService libraryQueryService;
    private final LibraryCommandService libraryCommandService;
    
    
    // Query Operations
    public LibraryResponse getLibraryById(UUID libraryId) {
        return libraryQueryService.getLibraryById(libraryId);
    }
    
    public PagedResponse<LibraryResponse> searchLibraries(LibrarySearchParams params) {
        return libraryQueryService.searchLibraries(params);
    }
    
    public List<LibraryResponse> getLibrariesByCampusId(UUID campusId) {
        return libraryQueryService.getLibrariesByCampusId(campusId);
    }
    
    public LibraryResponse getLibraryByCode(String code) {
        return libraryQueryService.getLibraryByCode(code);
    }
    
    public List<LibraryResponse> getAllLibraries() {
        return libraryQueryService.getAllLibraries();
    }
    
    public boolean isLibraryCached(UUID libraryId) {
        return libraryQueryService.isLibraryCached(libraryId);
    }
    
    public Long getLibraryCacheTtl(UUID libraryId) {
        return libraryQueryService.getLibraryCacheTtl(libraryId);
    }
    
    // Command Operations
    public LibraryResponse createLibrary(CreateLibraryCommand command) {
        return libraryCommandService.createLibrary(command);
    }
    
    public LibraryResponse updateLibrary(UUID libraryId, CreateLibraryCommand command) {
        return libraryCommandService.updateLibrary(libraryId, command);
    }
    
    public void deleteLibrary(UUID libraryId) {
        libraryCommandService.deleteLibrary(libraryId);
    }
    
    // Cache Operations
    public void clearLibraryCache(UUID libraryId) {
        libraryQueryService.clearLibraryCache(libraryId);
        libraryCommandService.clearLibraryCache(libraryId);
    }
    
    public void clearLibrariesCache(List<UUID> libraryIds) {
        libraryQueryService.clearLibrariesCache(libraryIds);
        libraryCommandService.clearLibrariesCache(libraryIds);
    }
    
    public void clearSearchCache() {
        libraryQueryService.clearSearchCache();
        libraryCommandService.clearSearchCache();
    }
    
    public void clearSearchCache(LibrarySearchParams params) {
        libraryQueryService.clearSearchCache(params);
    }
    
    public void clearAllCache() {
        log.info("Clearing all library cache");
        // CACHE DISABLED;
    }
    
    // Health Check
    public boolean isHealthy() {
        try {
            // Basic health check - try to access cache service
            false;
            return true;
        } catch (Exception e) {
            log.error(LibraryConstants.ERROR_HEALTH_CHECK_FAILED, e.getMessage());
            return false;
        }
    }
} 

