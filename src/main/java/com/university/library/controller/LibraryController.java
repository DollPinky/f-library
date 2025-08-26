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
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@SecurityRequirement(name = "api")
public class LibraryController {
    
    private final LibraryFacade libraryFacade;
    
    @GetMapping("/{libraryId}")
    @Operation(summary = "Get library by ID", description = "Retrieve a specific library by its ID")
    public ResponseEntity<StandardResponse<LibraryResponse>> getLibraryById(
            @Parameter(description = "Library ID") @PathVariable UUID libraryId) {
        try {
            log.info("Get library by ID: {}", libraryId);
            LibraryResponse response = libraryFacade.getLibraryById(libraryId);
            return ResponseEntity.ok(StandardResponse.success("Lấy thư viện thành công", response));
        } catch (Exception e) {
            log.error("Error getting library by ID: {} - {}", libraryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardResponse.error(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + libraryId));
        }
    }
    
    @GetMapping
    @Operation(summary = "Search libraries", description = "Search and filter libraries with pagination")
    public ResponseEntity<StandardResponse<PagedResponse<LibraryResponse>>> searchLibraries(
            @Parameter(description = "Search parameters") @ModelAttribute LibrarySearchParams params) {
        try {
            log.info("Search libraries with params: {}", params);
            PagedResponse<LibraryResponse> response = libraryFacade.searchLibraries(params);
            return ResponseEntity.ok(StandardResponse.success("Lấy danh sách thư viện thành công", response));
        } catch (Exception e) {
            log.error("Error searching libraries: {}", e.getMessage());
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
    

} 

