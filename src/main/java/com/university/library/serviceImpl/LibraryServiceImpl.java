package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.LibraryConstants;
import com.university.library.dto.request.library.CreateLibraryCommand;
import com.university.library.dto.request.library.LibrarySearchParams;
import com.university.library.dto.response.library.LibraryResponse;
import com.university.library.entity.Campus;
import com.university.library.entity.Library;
import com.university.library.repository.CampusRepository;
import com.university.library.repository.LibraryRepository;
import com.university.library.service.LibraryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {
    private final LibraryRepository libraryRepository;
    private final CampusRepository campusRepository;

    /**
     * Library Query
     */
    public LibraryResponse getLibraryById(UUID libraryId) {
        log.info("Getting library by ID: {}", libraryId);

        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException("Library not found with ID: " + libraryId));

        LibraryResponse response = LibraryResponse.fromEntity(library);

        log.info("Library retrieved successfully: {}", libraryId);
        return response;
    }

    public PagedResponse<LibraryResponse> searchLibraries(LibrarySearchParams params) {
        log.info("Searching libraries with params: {}", params);

        Specification<Library> spec = createSearchSpecification(params);

        String sortBy = params.getSortBy() != null ? params.getSortBy() : "name";
        String sortDirection = params.getSortDirection() != null ? params.getSortDirection() : "ASC";

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);

        Page<Library> libraryPage = libraryRepository.findAll(spec, pageable);

        List<LibraryResponse> responses = libraryPage.getContent().stream()
                .map(LibraryResponse::fromEntity)
                .collect(Collectors.toList());

        PagedResponse<LibraryResponse> response = PagedResponse.of(
                responses,
                params.getPage(),
                params.getSize(),
                libraryPage.getTotalElements()
        );

        log.info("Library search completed. Found {} results", libraryPage.getTotalElements());
        return response;
    }

    public List<LibraryResponse> getLibrariesByCampusId(UUID campusId) {
        log.info("Getting libraries by campus ID: {}", campusId);

        List<Library> libraries = libraryRepository.findByCampusCampusId(campusId);
        List<LibraryResponse> responses = libraries.stream()
                .map(LibraryResponse::fromEntity)
                .collect(Collectors.toList());



        log.info("Retrieved {} libraries for campus: {}", responses.size(), campusId);
        return responses;
    }

    public LibraryResponse getLibraryByCode(String code) {
        log.info("Getting library by code: {}", code);

        Library library = libraryRepository.findByCode(code);
        if (library == null) {
            throw new RuntimeException("Library not found with code: " + code);
        }

        LibraryResponse response = LibraryResponse.fromEntity(library);

        log.info("Library retrieved successfully by code: {}", code);
        return response;
    }

    public List<LibraryResponse> getAllLibraries() {
        log.info("Getting all libraries");

        List<Library> libraries = libraryRepository.findAll();
        List<LibraryResponse> responses = libraries.stream()
                .map(LibraryResponse::fromEntity)
                .collect(Collectors.toList());

        log.info("Retrieved {} libraries", responses.size());
        return responses;
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

    /**
     * Library Command
     */

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
