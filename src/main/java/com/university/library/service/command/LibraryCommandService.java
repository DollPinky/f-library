package com.university.library.service.command;

import com.university.library.constants.LibraryConstants;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.CreateLibraryCommand;
import com.university.library.entity.Library;
import com.university.library.entity.Campus;
import com.university.library.repository.LibraryRepository;
import com.university.library.repository.CampusRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryCommandService {
    
    private final LibraryRepository libraryRepository;
    private final CampusRepository campusRepository;
    
    
    @Transactional
    public LibraryResponse createLibrary(CreateLibraryCommand command) {
        log.info("Creating new library with code: {}", command.getCode());
        
        if (libraryRepository.existsByCode(command.getCode())) {
            throw new RuntimeException(LibraryConstants.ERROR_CODE_ALREADY_EXISTS + command.getCode());
        }
        
        Campus campus = campusRepository.findById(command.getCampusId())
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_CAMPUS_NOT_FOUND + command.getCampusId()));
        
        Library library = Library.builder()
                .name(command.getName())
                .code(command.getCode())
                .address(command.getAddress())
                .campus(campus)
                .build();
        
        Library savedLibrary = libraryRepository.save(library);
        LibraryResponse response = LibraryResponse.fromEntity(savedLibrary);
        

        
        // Publish event
        
        log.info(LibraryConstants.LOG_LIBRARY_CREATED, savedLibrary.getLibraryId());
        return response;
    }
    
    @Transactional
    public LibraryResponse updateLibrary(UUID libraryId, CreateLibraryCommand command) {
        log.info("Updating library with ID: {}", libraryId);
        
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + libraryId));
        
        if (!library.getCode().equals(command.getCode()) && 
            libraryRepository.existsByCode(command.getCode())) {
            throw new RuntimeException(LibraryConstants.ERROR_CODE_ALREADY_EXISTS + command.getCode());
        }
        
        Campus campus = null;
        if (!library.getCampus().getCampusId().equals(command.getCampusId())) {
            campus = campusRepository.findById(command.getCampusId())
                    .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_CAMPUS_NOT_FOUND + command.getCampusId()));
        } else {
            campus = library.getCampus();
        }
        
        library.setName(command.getName());
        library.setCode(command.getCode());
        library.setAddress(command.getAddress());
        library.setCampus(campus);
        
        Library updatedLibrary = libraryRepository.save(library);
        LibraryResponse response = LibraryResponse.fromEntity(updatedLibrary);
        

        
        // Publish event
        
        log.info(LibraryConstants.LOG_LIBRARY_UPDATED, libraryId);
        return response;
    }
    
    @Transactional
    public void deleteLibrary(UUID libraryId) {
        log.info("Deleting library with ID: {}", libraryId);
        
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + libraryId));
        
        long bookCopyCount = libraryRepository.countBooksByLibraryId(libraryId);
        long staffCount = libraryRepository.countStaffByLibraryId(libraryId);
        
        if (bookCopyCount > 0 || staffCount > 0) {
            throw new RuntimeException(LibraryConstants.ERROR_LIBRARY_IN_USE);
        }
        
        libraryRepository.delete(library);
        
        
        log.info(LibraryConstants.LOG_LIBRARY_DELETED, libraryId);
    }
    
    
} 

