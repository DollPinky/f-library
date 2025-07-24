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
    
} 

