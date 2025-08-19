package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BookCopyResponse;
import com.university.library.dto.BookCopySearchParams;
import com.university.library.entity.BookCopy;
import com.university.library.repository.BookCopyRepository;

import com.university.library.service.BookCopyFacade;
import com.university.library.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import jakarta.persistence.criteria.Predicate;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookCopyQueryService {
    
    private final BookCopyRepository bookCopyRepository;

    public BookCopyResponse getBookCopyById(UUID bookCopyId) {
        log.info("Getting book copy by ID: {}", bookCopyId);
        
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException("Book copy not found with ID: " + bookCopyId));
        
        BookCopyResponse response = BookCopyResponse.fromEntity(bookCopy);
        
        log.info("Book copy retrieved successfully: {}", bookCopyId);
        return response;
    }


    public PagedResponse<BookCopyResponse> searchBookCopies(BookCopySearchParams params) {
        log.info("Searching book copies with params: {}", params);
        
        Specification<BookCopy> spec = createSearchSpecification(params);
        Sort sort = Sort.by(Sort.Direction.fromString(params.getSortDirection()), params.getSortBy());
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);
        
        Page<BookCopy> bookCopyPage = bookCopyRepository.findAll(spec, pageable);
        
        List<BookCopyResponse> responses = bookCopyPage.getContent().stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());
        
        PagedResponse<BookCopyResponse> response = PagedResponse.of(
                responses,
                params.getPage(),
                params.getSize(),
                bookCopyPage.getTotalElements()
        );
        
        log.info("Book copy search completed. Found {} results", bookCopyPage.getTotalElements());
        return response;
    }
    
    public List<BookCopyResponse> getBookCopiesByBookId(UUID bookId) {
        log.info("Getting book copies by book ID: {}", bookId);
        
        List<BookCopy> bookCopies = bookCopyRepository.findByBookBookId(bookId);
        List<BookCopyResponse> responses = bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());
        
        log.info("Retrieved {} book copies for book: {}", responses.size(), bookId);
        return responses;
    }
    
    public List<BookCopyResponse> getBookCopiesByLibraryId(UUID libraryId) {
        log.info("Getting book copies by library ID: {}", libraryId);
        
        List<BookCopy> bookCopies = bookCopyRepository.findByLibraryLibraryId(libraryId);
        List<BookCopyResponse> responses = bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());
        
        log.info("Retrieved {} book copies for library: {}", responses.size(), libraryId);
        return responses;
    }
    
    public List<BookCopyResponse> getAvailableBookCopiesByBookId(UUID bookId) {
        log.info("Getting available book copies by book ID: {}", bookId);
        
        List<BookCopy> bookCopies = bookCopyRepository.findByBookBookIdAndStatus(bookId, BookCopy.BookStatus.AVAILABLE);
        List<BookCopyResponse> responses = bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());
        
        log.info("Retrieved {} available book copies for book: {}", responses.size(), bookId);
        return responses;
    }
    
    public BookCopyResponse getBookCopyByQrCode(String qrCode) {
        log.info("Getting book copy by QR code: {}", qrCode);
        
        BookCopy bookCopy = bookCopyRepository.findByQrCode(qrCode);
        if (bookCopy == null) {
            throw new RuntimeException("Book copy not found with QR code: " + qrCode);
        }
        
        BookCopyResponse response = BookCopyResponse.fromEntity(bookCopy);
        
        log.info("Book copy retrieved successfully by QR code: {}", qrCode);
        return response;
    }
    
    private Specification<BookCopy> createSearchSpecification(BookCopySearchParams params) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<Predicate>();
            
            if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("qrCode")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("shelfLocation")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("book").get("title")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("book").get("author")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("library").get("name")), searchTerm)
                ));
            }
            
            if (params.getBookId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("book").get("bookId"), params.getBookId()));
            }
            
            if (params.getLibraryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("library").get("libraryId"), params.getLibraryId()));
            }
            
            if (params.getStatus() != null && !params.getStatus().trim().isEmpty()) {
                try {
                    BookCopy.BookStatus status = BookCopy.BookStatus.valueOf(params.getStatus().toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), status));
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid book copy status: {}", params.getStatus());
                }
            }
            
            if (Boolean.TRUE.equals(params.getAvailableOnly())) {
                predicates.add(criteriaBuilder.equal(root.get("status"), BookCopy.BookStatus.AVAILABLE));
            }
            
            if (Boolean.TRUE.equals(params.getBorrowedOnly())) {
                predicates.add(criteriaBuilder.equal(root.get("status"), BookCopy.BookStatus.BORROWED));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    

} 

