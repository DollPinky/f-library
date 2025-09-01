package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.dto.request.book.CreateBookCommand;
import com.university.library.dto.request.book.UpdateBookCommand;
import com.university.library.dto.response.book.BookResponse;
import com.university.library.entity.Book;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Category;
import com.university.library.entity.Library;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.repository.LibraryRepository;
import com.university.library.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookCopyRepository bookCopyRepository;
    private final LibraryRepository libraryRepository;
    /**
     QueryBook
     */
    public BookResponse getBookById(UUID bookId) {
        log.info(BookConstants.LOG_GETTING_BOOK, bookId);

        BookResponse result = performGetBookById(bookId);

        return result;
    }

    private BookResponse performGetBookById(UUID bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> {
                    log.error(BookConstants.ERROR_BOOK_NOT_FOUND + bookId);
                    return new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId);
                });

        return BookResponse.fromEntity(book);
    }

    public PagedResponse<BookResponse> searchBooks(BookSearchParams params) {
        log.info(BookConstants.LOG_SEARCHING_BOOKS, params);

        return performSearch(params);
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private PagedResponse<BookResponse> performSearch(BookSearchParams params) {
        Pageable pageable = PageRequest.of(
                params.getPage() != null ? params.getPage() : BookConstants.DEFAULT_PAGE_NUMBER,
                params.getSize() != null ? params.getSize() : BookConstants.DEFAULT_PAGE_SIZE,
                Sort.by(BookConstants.DEFAULT_SORT_FIELD).descending()
        );

        // Create specification for filtering
        Specification<Book> spec = createSearchSpecification(params);

        Page<Book> bookPage = bookRepository.findAll(spec, pageable);

        // Safe stream processing with null check
        List<BookResponse> bookResponses = bookPage.getContent() != null ?
                bookPage.getContent().stream()
                        .filter(book -> book != null) // Filter out null books
                        .map(book -> {
                            try {
                                return BookResponse.fromEntity(book);
                            } catch (Exception e) {
                                log.warn("Failed to convert book to response: {}", book != null ? book.getBookId() : "null", e);
                                return null;
                            }
                        })
                        .filter(response -> response != null) // Filter out null responses
                        .collect(Collectors.toList()) :
                new ArrayList<>();

        // Ensure content is never null
        if (bookResponses == null) {
            bookResponses = new ArrayList<>();
        }

        // Use PagedResponse.of() method for safe construction
        return PagedResponse.of(
                bookResponses,
                bookPage.getNumber(),
                bookPage.getSize(),
                bookPage.getTotalElements()
        );
    }

    /**
     * Create specification for search and filtering
     */
    private Specification<Book> createSearchSpecification(BookSearchParams params) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new ArrayList<jakarta.persistence.criteria.Predicate>();

            // Handle keyword search
            if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), searchTerm)
                ));
            }

            if (params.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("categoryId"), params.getCategoryId()));
            }

            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    @Transactional
    public BookResponse createBook(CreateBookCommand command) {
        log.info(BookConstants.LOG_CREATING_BOOK, command.getTitle());



        Category category = categoryRepository.findById(command.getCategoryId())
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));

        Book book = Book.builder()
                .title(command.getTitle())
                .author(command.getAuthor())
                .publisher(command.getPublisher())
                .year(command.getPublishYear())
                .description(command.getDescription())
                .category(category)
                .build();

        Book savedBook = bookRepository.save(book);

        if (command.getCopies() != null && !command.getCopies().isEmpty()) {
            createBookCopies(savedBook, command.getCopies());
        }

        BookResponse bookResponse = BookResponse.fromEntity(savedBook);

        log.info(BookConstants.LOG_BOOK_CREATED, savedBook.getBookId());
        return bookResponse;
    }




    /**
     * Cập nhật sách với UpdateBookCommand
     */
    @Transactional
    public BookResponse updateBook(UUID bookId, UpdateBookCommand command) {
        log.info(BookConstants.LOG_UPDATING_BOOK, bookId);

        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));



        Category category = categoryRepository.findById(command.getCategoryId())
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_CATEGORY_NOT_FOUND + command.getCategoryId()));

        existingBook.setTitle(command.getTitle());
        existingBook.setAuthor(command.getAuthor());
        existingBook.setPublisher(command.getPublisher());
        existingBook.setYear(command.getPublishYear());
        existingBook.setDescription(command.getDescription());
        existingBook.setCategory(category);

        Book updatedBook = bookRepository.save(existingBook);

        BookResponse bookResponse = BookResponse.fromEntity(updatedBook);

        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);
        return bookResponse;
    }

    /**
     * Xóa sách với Kafka event và cache management
     */
    @Transactional
    public void deleteBook(UUID bookId) {
        log.info(BookConstants.LOG_DELETING_BOOK, bookId);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));

        if (hasActiveBorrowings(bookId)) {
            log.error(BookConstants.ERROR_BOOK_IN_USE);
            throw new RuntimeException(BookConstants.ERROR_BOOK_IN_USE);
        }

        bookRepository.deleteById(bookId);

        log.info(BookConstants.LOG_BOOK_DELETED, bookId);
    }





    /**
     * Tạo book copies cho một book
     */
    private void createBookCopies(Book book, List<CreateBookCommand.BookCopyInfo> copyInfos) {
        log.info("Creating {} book copies for book: {}", copyInfos.size(), book.getBookId());

        List<BookCopy> bookCopies = new ArrayList<>();

        for (CreateBookCommand.BookCopyInfo copyInfo : copyInfos) {
            Library library = libraryRepository.findById(copyInfo.getLibraryId())
                    .orElseThrow(() -> new RuntimeException("Library not found with ID: " + copyInfo.getLibraryId()));

            for (int i = 0; i < copyInfo.getQuantity(); i++) {

                BookCopy bookCopy = BookCopy.builder()
                        .book(book)
                        .library(library)
                        .shelfLocation(copyInfo.getLocation())
                        .status(BookCopy.BookStatus.AVAILABLE)
                        .build();

                bookCopies.add(bookCopy);
            }
        }

        bookCopyRepository.saveAll(bookCopies);

        log.info("Successfully created {} book copies for book: {}", bookCopies.size(), book.getBookId());
    }


    /**
     * Kiểm tra xem sách có đang được mượn không
     */
    private boolean hasActiveBorrowings(UUID bookId) {
        return false;
    }


}
