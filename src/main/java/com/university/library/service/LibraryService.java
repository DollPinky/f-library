package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.request.library.CreateLibraryCommand;
import com.university.library.dto.request.library.LibrarySearchParams;
import com.university.library.dto.response.library.LibraryResponse;

import java.util.List;
import java.util.UUID;

public interface LibraryService {
    /**
     * Library query
     */
    LibraryResponse getLibraryById(UUID libraryId);
    PagedResponse<LibraryResponse> searchLibraries(LibrarySearchParams params);
    List<LibraryResponse> getLibrariesByCampusId(UUID campusId);
    LibraryResponse getLibraryByCode(String code);
    List<LibraryResponse> getAllLibraries();

    /**
     * Library command
     */
    LibraryResponse createLibrary(CreateLibraryCommand command);
    LibraryResponse updateLibrary(UUID libraryId, CreateLibraryCommand command);
    void deleteLibrary(UUID libraryId);
}
