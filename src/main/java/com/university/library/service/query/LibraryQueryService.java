package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.constants.LibraryConstants;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.LibrarySearchParams;
import com.university.library.entity.Library;
import com.university.library.repository.LibraryRepository;
import com.university.library.service.ManualCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryQueryService {
    
    private final LibraryRepository libraryRepository;
    private final ManualCacheService cacheService;
    
    public LibraryResponse getLibraryById(UUID libraryId) {
        log.info("Getting library by ID: {}", libraryId);
        
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_LIBRARY + libraryId;
        LibraryResponse cached = cacheService.get(LibraryConstants.CACHE_NAME, cacheKey, LibraryResponse.class).orElse(null);
        if (cached != null) {
            log.debug("Library found in cache: {}", libraryId);
            return cached;
        }
        
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException("Library not found with ID: " + libraryId));
        
        LibraryResponse response = LibraryResponse.fromEntity(library);
        cacheLibrary(response);
        
        log.info("Library retrieved successfully: {}", libraryId);
        return response;
    }
    
    public PagedResponse<LibraryResponse> searchLibraries(LibrarySearchParams params) {
        log.info("Searching libraries with params: {}", params);
        
        String cacheKey = buildSearchCacheKey(params);
        PagedResponse<LibraryResponse> cached = cacheService.get(LibraryConstants.CACHE_NAME, cacheKey, PagedResponse.class).orElse(null);
        if (cached != null) {
            log.debug("Search results found in cache for key: {}", cacheKey);
            return cached;
        }
        
        Specification<Library> spec = createSearchSpecification(params);
        Sort sort = Sort.by(Sort.Direction.fromString(params.getSortDirection()), params.getSortBy());
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);
        
        Page<Library> libraryPage = libraryRepository.findAll(spec, pageable);
        
        List<LibraryResponse> responses = libraryPage.getContent().stream()
                .map(LibraryResponse::fromEntity)
                .collect(Collectors.toList());
        
        PagedResponse<LibraryResponse> response = PagedResponse.<LibraryResponse>builder()
                .content(responses)
                .number(params.getPage())
                .size(params.getSize())
                .totalElements(libraryPage.getTotalElements())
                .totalPages(libraryPage.getTotalPages())
                .build();
        
        cacheService.put(LibraryConstants.CACHE_NAME, cacheKey, response, Duration.ofMinutes(LibraryConstants.CACHE_TTL_LIBRARY_SEARCH), Duration.ofMinutes(LibraryConstants.CACHE_TTL_LOCAL));
        
        log.info("Library search completed. Found {} results", libraryPage.getTotalElements());
        return response;
    }
    
    public List<LibraryResponse> getLibrariesByCampusId(UUID campusId) {
        log.info("Getting libraries by campus ID: {}", campusId);
        
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_CAMPUS + campusId;
        List<LibraryResponse> cached = cacheService.get(LibraryConstants.CACHE_NAME, cacheKey, List.class).orElse(null);
        if (cached != null) {
            log.debug("Libraries found in cache for campus: {}", campusId);
            return cached;
        }
        
        List<Library> libraries = libraryRepository.findByCampusCampusId(campusId);
        List<LibraryResponse> responses = libraries.stream()
                .map(LibraryResponse::fromEntity)
                .collect(Collectors.toList());
        
        cacheService.put(LibraryConstants.CACHE_NAME, cacheKey, responses, Duration.ofMinutes(LibraryConstants.CACHE_TTL_LIBRARY_LIST), Duration.ofMinutes(LibraryConstants.CACHE_TTL_LOCAL));
        
        log.info("Retrieved {} libraries for campus: {}", responses.size(), campusId);
        return responses;
    }
    
    public LibraryResponse getLibraryByCode(String code) {
        log.info("Getting library by code: {}", code);
        
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_CODE + code;
        LibraryResponse cached = cacheService.get(LibraryConstants.CACHE_NAME, cacheKey, LibraryResponse.class).orElse(null);
        if (cached != null) {
            log.debug("Library found in cache by code: {}", code);
            return cached;
        }
        
        Library library = libraryRepository.findByCode(code);
        if (library == null) {
            throw new RuntimeException("Library not found with code: " + code);
        }
        
        LibraryResponse response = LibraryResponse.fromEntity(library);
        cacheLibrary(response);
        
        log.info("Library retrieved successfully by code: {}", code);
        return response;
    }
    
    public List<LibraryResponse> getAllLibraries() {
        log.info("Getting all libraries");
        
        String cacheKey = "all";
        List<LibraryResponse> cached = cacheService.get(LibraryConstants.CACHE_NAME, cacheKey, List.class).orElse(null);
        if (cached != null) {
            log.debug("All libraries found in cache");
            return cached;
        }
        
        List<Library> libraries = libraryRepository.findAll();
        List<LibraryResponse> responses = libraries.stream()
                .map(LibraryResponse::fromEntity)
                .collect(Collectors.toList());
        
        cacheService.put(LibraryConstants.CACHE_NAME, cacheKey, responses, Duration.ofMinutes(LibraryConstants.CACHE_TTL_LIBRARY_LIST), Duration.ofMinutes(LibraryConstants.CACHE_TTL_LOCAL));
        
        log.info("Retrieved {} libraries", responses.size());
        return responses;
    }
    
    public boolean isLibraryCached(UUID libraryId) {
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_LIBRARY + libraryId;
        return cacheService.exists(LibraryConstants.CACHE_NAME, cacheKey);
    }
    
    public Long getLibraryCacheTtl(UUID libraryId) {
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_LIBRARY + libraryId;
        return cacheService.getTtl(LibraryConstants.CACHE_NAME, cacheKey);
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
    
    public void clearSearchCache(LibrarySearchParams params) {
        log.info("Clearing library search cache for params: {}", params);
        String cacheKey = buildSearchCacheKey(params);
        cacheService.evict(LibraryConstants.CACHE_NAME, cacheKey);
    }
    
    private void cacheLibrary(LibraryResponse libraryResponse) {
        String cacheKey = LibraryConstants.CACHE_KEY_PREFIX_LIBRARY + libraryResponse.getLibraryId();
        cacheService.put(LibraryConstants.CACHE_NAME, cacheKey, libraryResponse, Duration.ofMinutes(LibraryConstants.CACHE_TTL_LIBRARY_DETAIL), Duration.ofMinutes(LibraryConstants.CACHE_TTL_LOCAL));
    }
    
    private Specification<Library> createSearchSpecification(LibrarySearchParams params) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            
            if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("campus").get("name")), searchTerm)
                ));
            }
            
            if (params.getCampusId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("campus").get("campusId"), params.getCampusId()));
            }
            
            if (Boolean.TRUE.equals(params.getHasBookCopies())) {
                predicates.add(criteriaBuilder.greaterThan(
                    criteriaBuilder.size(root.get("bookCopies")), 0));
            }
            
            if (Boolean.TRUE.equals(params.getHasStaff())) {
                predicates.add(criteriaBuilder.greaterThan(
                    criteriaBuilder.size(root.get("staff")), 0));
            }
            
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
    
    private String buildSearchCacheKey(LibrarySearchParams params) {
        return String.format("search:%s:%s:%s:%s:%s:%s:%s:%s",
                params.getQuery() != null ? params.getQuery() : "",
                params.getCampusId() != null ? params.getCampusId() : "",
                params.getHasBookCopies() != null ? params.getHasBookCopies() : "",
                params.getHasStaff() != null ? params.getHasStaff() : "",
                params.getPage(),
                params.getSize(),
                params.getSortBy(),
                params.getSortDirection()
        );
    }
} 