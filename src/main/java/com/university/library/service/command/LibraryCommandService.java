package com.university.library.service.command;

import com.university.library.constants.LibraryConstants;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.CreateLibraryCommand;
import com.university.library.entity.Library;
import com.university.library.entity.Campus;
import com.university.library.repository.LibraryRepository;
import com.university.library.repository.CampusRepository;
import com.university.library.service.ManualCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryCommandService {
    
    private final LibraryRepository libraryRepository;
    private final CampusRepository campusRepository;
    private final ManualCacheService cacheService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Transactional
    public LibraryResponse createLibrary(CreateLibraryCommand command) {
        log.info("Creating new library with code: {}", command.getCode());
        
        // Validate code uniqueness
        if (libraryRepository.existsByCode(command.getCode())) {
            throw new RuntimeException(LibraryConstants.ERROR_CODE_ALREADY_EXISTS + command.getCode());
        }
        
        // Validate campus exists
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
        
        // Cache the new library
        cacheLibrary(response);
        
        // Publish event
        publishLibraryCreatedEvent(savedLibrary);
        
        log.info(LibraryConstants.LOG_LIBRARY_CREATED, savedLibrary.getLibraryId());
        return response;
    }
    
    @Transactional
    public LibraryResponse updateLibrary(UUID libraryId, CreateLibraryCommand command) {
        log.info("Updating library with ID: {}", libraryId);
        
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + libraryId));
        
        // Check code uniqueness if it's being changed
        if (!library.getCode().equals(command.getCode()) && 
            libraryRepository.existsByCode(command.getCode())) {
            throw new RuntimeException(LibraryConstants.ERROR_CODE_ALREADY_EXISTS + command.getCode());
        }
        
        // Validate campus exists if it's being changed
        Campus campus = null;
        if (!library.getCampus().getCampusId().equals(command.getCampusId())) {
            campus = campusRepository.findById(command.getCampusId())
                    .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_CAMPUS_NOT_FOUND + command.getCampusId()));
        } else {
            campus = library.getCampus();
        }
        
        // Update fields
        library.setName(command.getName());
        library.setCode(command.getCode());
        library.setAddress(command.getAddress());
        library.setCampus(campus);
        
        Library updatedLibrary = libraryRepository.save(library);
        LibraryResponse response = LibraryResponse.fromEntity(updatedLibrary);
        
        // Update cache
        cacheLibrary(response);
        
        // Publish event
        publishLibraryUpdatedEvent(updatedLibrary);
        
        log.info(LibraryConstants.LOG_LIBRARY_UPDATED, libraryId);
        return response;
    }
    
    @Transactional
    public void deleteLibrary(UUID libraryId) {
        log.info("Deleting library with ID: {}", libraryId);
        
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + libraryId));
        
        // Check if library can be deleted (no book copies or staff)
        long bookCopyCount = libraryRepository.countBooksByLibraryId(libraryId);
        long staffCount = libraryRepository.countStaffByLibraryId(libraryId);
        
        if (bookCopyCount > 0 || staffCount > 0) {
            throw new RuntimeException(LibraryConstants.ERROR_LIBRARY_IN_USE);
        }
        
        libraryRepository.delete(library);
        
        // Clear cache
        clearLibraryCache(libraryId);
        
        // Publish event
        publishLibraryDeletedEvent(library);
        
        log.info(LibraryConstants.LOG_LIBRARY_DELETED, libraryId);
    }
    
    public void clearLibraryCache(UUID libraryId) {
        log.info("Clearing cache for library: {}", libraryId);
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_LIBRARY + libraryId;
        cacheService.evict(LibraryConstants.CACHE_NAME, cacheKey);
    }
    
    public void clearLibrariesCache(List<UUID> libraryIds) {
        log.info("Clearing cache for {} libraries", libraryIds.size());
        libraryIds.forEach(this::clearLibraryCache);
    }
    
    public void clearSearchCache() {
        log.info("Clearing all library search cache");
        cacheService.evictAll(LibraryConstants.CACHE_NAME);
    }
    
    private void publishLibraryCreatedEvent(Library library) {
        try {
            kafkaTemplate.send(LibraryConstants.TOPIC_LIBRARY_CREATED, library.getLibraryId().toString(), library);
            log.info(LibraryConstants.LOG_KAFKA_EVENT_SENT, LibraryConstants.EVENT_LIBRARY_CREATED, library.getLibraryId());
        } catch (Exception e) {
            log.error("Failed to publish library created event: {}", e.getMessage());
        }
    }
    
    private void publishLibraryUpdatedEvent(Library library) {
        try {
            kafkaTemplate.send(LibraryConstants.TOPIC_LIBRARY_UPDATED, library.getLibraryId().toString(), library);
            log.info(LibraryConstants.LOG_KAFKA_EVENT_SENT, LibraryConstants.EVENT_LIBRARY_UPDATED, library.getLibraryId());
        } catch (Exception e) {
            log.error("Failed to publish library updated event: {}", e.getMessage());
        }
    }
    
    private void publishLibraryDeletedEvent(Library library) {
        try {
            kafkaTemplate.send(LibraryConstants.TOPIC_LIBRARY_DELETED, library.getLibraryId().toString(), library);
            log.info(LibraryConstants.LOG_KAFKA_EVENT_SENT, LibraryConstants.EVENT_LIBRARY_DELETED, library.getLibraryId());
        } catch (Exception e) {
            log.error("Failed to publish library deleted event: {}", e.getMessage());
        }
    }
    
    public void publishCacheEvictEvent(UUID libraryId) {
        try {
            kafkaTemplate.send(LibraryConstants.TOPIC_LIBRARY_CACHE_EVICT, libraryId.toString(), libraryId);
            log.info(LibraryConstants.LOG_KAFKA_EVENT_SENT, LibraryConstants.EVENT_CACHE_EVICT, libraryId);
        } catch (Exception e) {
            log.error("Failed to publish cache evict event: {}", e.getMessage());
        }
    }
    
    private void cacheLibrary(LibraryResponse libraryResponse) {
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_LIBRARY + libraryResponse.getLibraryId();
        cacheService.put(LibraryConstants.CACHE_NAME, cacheKey, libraryResponse, 
                Duration.ofMinutes(LibraryConstants.CACHE_TTL_LIBRARY_DETAIL), 
                Duration.ofMinutes(LibraryConstants.CACHE_TTL_LOCAL));
    }
} 