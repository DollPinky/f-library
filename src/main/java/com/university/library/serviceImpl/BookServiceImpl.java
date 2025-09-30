package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.dto.request.book.CreateBookCommand;
import com.university.library.dto.request.book.UpdateBookCommand;
import com.university.library.dto.response.book.BookImportResponse;
import com.university.library.dto.response.book.BookResponse;
import com.university.library.entity.Book;
import com.university.library.entity.BookCopy;
import com.university.library.entity.Campus;
import com.university.library.entity.Category;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.BookRepository;
import com.university.library.repository.CampusRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.BookService;
import com.university.library.specification.BookSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CampusRepository campusRepository;
    private final BookCopyRepository bookCopyRepository;
    /**
     QueryBook
     */
     public List<BookResponse> getAllBook(){
        List<Book> book = bookRepository.findAll();
        List<BookResponse> responses = book.stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());

        return responses;
    }
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

    // BookServiceImpl.java - update searchBooks method
    public PagedResponse<BookResponse> searchBooks(BookSearchParams params) {
        log.info("Searching books with params: {}", params);

        // Create specification from search params
        Specification<Book> spec = BookSpecification.withSearchParams(params);

        // Create pageable with sorting
        Sort.Direction direction = Sort.Direction.fromString(params.getSortDirection());
        Sort sort = Sort.by(direction, params.getSortBy());
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);

        // Execute query
        Page<Book> bookPage = bookRepository.findAll(spec, pageable);

        // Convert to response
        List<BookResponse> content = bookPage.getContent().stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                bookPage.getNumber(),
                bookPage.getSize(),
                bookPage.getTotalElements()
        );
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
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
                .bookCover(command.getBookCover())
                .build();

        Book savedBook = bookRepository.save(book);


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
        existingBook.setBookCover(command.getBookCover());

        Book updatedBook = bookRepository.save(existingBook);

        BookResponse bookResponse = BookResponse.fromEntity(updatedBook);

        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);
        return bookResponse;
    }


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



    private boolean hasActiveBorrowings(UUID bookId) {
        return false;
    }

    @Transactional
    public BookImportResponse importBooksFromExcel(MultipartFile file) {
        log.info("Importing books from Excel file: {}", file.getOriginalFilename());

        BookImportResponse response = new BookImportResponse();
        List<BookImportResponse.ImportError> errors = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Bỏ qua dòng tiêu đề
            if (rowIterator.hasNext()) rowIterator.next();

            int rowNum = 1;
            int successCount = 0;
            int processedCount = 0;

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                rowNum++;

                // Bỏ qua các dòng trống
                if (isRowEmpty(row)) {
                    continue;
                }

                processedCount++;

                try {
                    importBookFromRow(row);
                    successCount++;
                } catch (Exception e) {
                    log.error("Error importing book at row {}: {}", rowNum, e.getMessage());
                    String isbn = getCellValueAsString(row.getCell(0));
                    errors.add(new BookImportResponse.ImportError(rowNum, isbn, e.getMessage()));
                }
            }

            response.setTotalRecords(processedCount);
            response.setSuccessCount(successCount);
            response.setErrorCount(errors.size());
            response.setErrors(errors);

        } catch (Exception e) {
            log.error("Error processing Excel file: {}", e.getMessage());
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage());
        }

        return response;
    }

    @Override
    public BookResponse updateBookCoverUrl(UUID bookId, String bookCoverUrl){

        log.info(BookConstants.LOG_UPDATING_BOOK, bookId);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));

        book.setBookCover(bookCoverUrl);

        Book updateBook = bookRepository.save(book);

        BookResponse bookResponse = BookResponse.fromEntity(updateBook);

        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);

        return bookResponse;
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) {
            return true;
        }
        if (row.getLastCellNum() <= 0) {
            return true;
        }
        for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && cell.getCellType() != CellType.BLANK && !isCellEmpty(cell)) {
                return false;
            }
        }
        return true;
    }

    private boolean isCellEmpty(Cell cell) {
        if (cell.getCellType() == CellType.BLANK) {
            return true;
        }
        if (cell.getCellType() == CellType.STRING && cell.getStringCellValue().trim().isEmpty()) {
            return true;
        }
        return false;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    double numericValue = cell.getNumericCellValue();
                    // Kiểm tra xem giá trị số có phải là số nguyên không
                    if (numericValue == Math.floor(numericValue)) {
                        // Sử dụng BigDecimal để giữ nguyên độ chính xác của số lớn
                        BigDecimal bigDecimal = BigDecimal.valueOf(numericValue);
                        return bigDecimal.toPlainString();
                    } else {
                        return String.valueOf(numericValue);
                    }
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                // Xử lý ô công thức
                FormulaEvaluator evaluator = new XSSFWorkbook().getCreationHelper().createFormulaEvaluator();
                CellValue cellValue = evaluator.evaluate(cell);
                switch (cellValue.getCellType()) {
                    case STRING:
                        return cellValue.getStringValue();
                    case NUMERIC:
                        return String.valueOf(cellValue.getNumberValue());
                    case BOOLEAN:
                        return String.valueOf(cellValue.getBooleanValue());
                    default:
                        return "";
                }
            default:
                return "";
        }
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case NUMERIC:
                return (int) cell.getNumericCellValue();
            case STRING:
                try {
                    return Integer.parseInt(cell.getStringCellValue().trim());
                } catch (NumberFormatException e) {
                    return null;
                }
            default:
                return null;
        }
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    private void importBookFromRow(Row row) {
        // Parse dữ liệu từ dòng Excel
        String isbn = getCellValueAsString(row.getCell(0)); // BookCopyId (ISBN)

        if (isBlank(isbn)) {
            throw new RuntimeException("ISBN is required");
        }

        if (isbn.length() != 10 && isbn.length() != 13) {
            throw new RuntimeException("ISBN must be 10 or 13 digits");
        }

        String title = getCellValueAsString(row.getCell(1));
        String author = getCellValueAsString(row.getCell(2));
        String publisher = getCellValueAsString(row.getCell(3));
        Integer year = getCellValueAsInteger(row.getCell(4));
        String description = getCellValueAsString(row.getCell(5));
        String categoryName = getCellValueAsString(row.getCell(6));
        String language = getCellValueAsString(row.getCell(7));
        String campusCode = getCellValueAsString(row.getCell(8));
        String shelfLocation = getCellValueAsString(row.getCell(9));

        // Kiểm tra nếu book copy đã tồn tại theo ISBN
        if (bookCopyRepository.existsById(isbn)) {
            throw new RuntimeException("Book copy with ISBN " + isbn + " already exists");
        }

        // Tìm hoặc tạo category
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> {
                    Category newCategory = Category.builder()
                            .name(categoryName)
                            .build();
                    return categoryRepository.save(newCategory);
                });

        // Tìm campus theo code
        Campus campus = campusRepository.findByCode(campusCode);
        if (campus == null) {
            throw new RuntimeException("Campus  not found");
        }

        // Tìm sách đã tồn tại hoặc tạo mới
        Book book = bookRepository.findByTitleAndAuthorAndPublisherAndYear(title, author, publisher, year)
                .orElseGet(() -> {
                    Book newBook = Book.builder()
                            .title(title)
                            .author(author)
                            .publisher(publisher)
                            .year(year)
                            .description(description)
                            .language(language != null ? language : "Vietnamese")
                            .category(category)
                            .build();
                    return bookRepository.save(newBook);
                });

        // Tạo book copy với ISBN làm ID
        BookCopy bookCopy = BookCopy.builder()
                .bookCopyId(isbn)
                .book(book)
                .campus(campus)
                .shelfLocation(shelfLocation)
                .status(BookCopy.BookStatus.AVAILABLE)
                .build();

        bookCopyRepository.save(bookCopy);
    }


}
