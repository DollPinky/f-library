package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.dto.request.book.CreateBookCommand;
import com.university.library.dto.request.book.UpdateBookCommand;
import com.university.library.dto.response.PageResponse;
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
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.poi.openxml4j.exceptions.OLE2NotOfficeXmlFileException;
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

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CampusRepository campusRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BookCopyRepository copyRepository;

    /**
     * QueryBook
     */
    public List<BookResponse> getAllBook() {
        List<Book> book = bookRepository.findAll();
        List<BookResponse> responses = book.stream()
                .map(BookResponse::fromEntity)
                .collect(Collectors.toList());
        return responses;
    }

    @Override
    public PagedResponse<BookResponse> getAllBookPageable(int page, int size) {
        Sort sort = Sort.by("title").descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> pageData = bookRepository.findAll(pageable);
        List<BookResponse> content = pageData.getContent()
                .stream()
                .map(BookResponse::fromEntity).toList();

        log.info("Found {} total books", content.size());

        return PagedResponse.<BookResponse>builder()
                .content(content)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .number(page)
                .size(size)
                .build();
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

    @Override
    @Transactional
    public BookImportResponse importBooksFromExcel(MultipartFile file) {
        log.info("Importing books from file: {}", file == null ? "null" : file.getOriginalFilename());

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        String filename = Optional.ofNullable(file.getOriginalFilename()).orElse("").toLowerCase();
        BookImportResponse response = new BookImportResponse();
        List<BookImportResponse.ImportError> errors = new ArrayList<>();
        int rowNum = 0;
        int successCount = 0;
        int processedCount = 0;

        try {
            if (filename.endsWith(".csv")) {
                // CSV path
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    boolean isHeader = true;
                    while ((line = reader.readLine()) != null) {
                        rowNum++;
                        if (isHeader) { isHeader = false; continue; }
                        if (line.trim().isEmpty()) continue;

                        processedCount++;
                        try {
                            String[] parts = line.split(",", -1); // keep empty columns
                            importBookFromRow(parts);
                            successCount++;
                        } catch (Exception e) {
                            log.error("Error importing book at CSV row {}: {}", rowNum, e.getMessage());
                            errors.add(new BookImportResponse.ImportError(rowNum, e.getMessage()));
                        }
                    }
                }
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                // Excel path (supports both .xls and .xlsx)
                try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                    Sheet sheet = workbook.getNumberOfSheets() > 0 ? workbook.getSheetAt(0) : null;
                    if (sheet == null) {
                        throw new RuntimeException("No sheets found in Excel file");
                    }

                    boolean isHeader = true;
                    for (Row row : sheet) {
                        rowNum++;
                        // skip header row
                        if (isHeader) { isHeader = false; continue; }
                        // skip entirely blank rows
                        boolean blank = true;
                        int lastCell = Math.max(5, row.getLastCellNum() == -1 ? 5 : row.getLastCellNum() - 1);
                        for (int c = 0; c <= lastCell; c++) {
                            Cell cell = row.getCell(c);
                            if (cell != null && cell.getCellType() != CellType.BLANK) { blank = false; break; }
                        }
                        if (blank) continue;

                        processedCount++;
                        try {
                            // Build parts array so that parts[1] = first cell, parts[2] = second cell, ... (to match importBookFromRow)
                            int maxCols = Math.max(6, lastCell + 2); // ensure >=6 elements (indices 0..5)
                            String[] parts = new String[maxCols];
                            // keep parts[0] empty by design (existing importBookFromRow expects title at index 1)
                            parts[0] = "";
                            for (int c = 0; c <= lastCell; c++) {
                                Cell cell = row.getCell(c);
                                String cellVal = "";
                                if (cell != null) {
                                    switch (cell.getCellType()) {
                                        case STRING:
                                            cellVal = cell.getStringCellValue();
                                            break;
                                        case NUMERIC:
                                            if (DateUtil.isCellDateFormatted(cell)) {
                                                cellVal = cell.getDateCellValue().toString();
                                            } else {
                                                cellVal = String.valueOf(cell.getNumericCellValue());
                                            }
                                            break;
                                        case BOOLEAN:
                                            cellVal = String.valueOf(cell.getBooleanCellValue());
                                            break;
                                        case FORMULA:
                                            try {
                                                cellVal = cell.getStringCellValue();
                                            } catch (Exception ex) {
                                                cellVal = String.valueOf(cell.getNumericCellValue());
                                            }
                                            break;
                                        default:
                                            cellVal = "";
                                    }
                                }
                                // shift by +1 so first Excel column maps to parts[1]
                                parts[c + 1] = cellVal == null ? "" : cellVal.trim();
                            }
                            // ensure no null entries
                            for (int i = 0; i < parts.length; i++) if (parts[i] == null) parts[i] = "";

                            importBookFromRow(parts);
                            successCount++;
                        } catch (Exception e) {
                            log.error("Error importing book at Excel row {}: {}", rowNum, e.getMessage());
                            errors.add(new BookImportResponse.ImportError(rowNum, e.getMessage()));
                        }
                    }
                } catch (OLE2NotOfficeXmlFileException ioe) {
                    // clear, explicit message when file content doesn't match extension
                    String msg = "File content is not a valid Excel file: " + ioe.getMessage();
                    log.error("Error processing Excel file: {}", msg);
                    throw new RuntimeException("Failed to process Excel file: " + msg, ioe);
                }
            } else {
                throw new IllegalArgumentException("Unsupported file type. Please upload a CSV or Excel (.xls/.xlsx) file.");
            }

            response.setTotalRecords(processedCount);
            response.setSuccessCount(successCount);
            response.setErrorCount(errors.size());
            response.setErrors(errors);
        } catch (IOException e) {
            log.error("Error reading uploaded file: {}", e.getMessage());
            throw new RuntimeException("Failed to read uploaded file: " + e.getMessage(), e);
        }

        return response;
    }


    private boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) return false;
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    @Override
    public byte[] exportExcel(List<String[]> data) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Books");
        for (int i = 0; i < data.size(); i++) {
            Row row = sheet.createRow(i);
            String[] dataRow = data.get(i);
            for (int j = 0; j < dataRow.length; j++) {
                Cell cell = row.createCell(j);
                String value = dataRow[j];
                if (isNumeric(value)) {
                    if(value.equals("0"))
                    {
                        cell.setCellValue("");
                    }
                    else {
                        cell.setCellValue(Double.parseDouble(value));
                    }
                } else {
                    cell.setCellValue(value);
                }
            }
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }

    @Override
    public List<String[]> getDataBookToExport() {
      List<String[]> data = new ArrayList<>();
      data.add(new String[]{"Title", "Author", "Quantity","FT1: Learning Hub","FT2: Library","FT2: CanTeen"
      ,"FT3: FHM","FT3: EBS","FT3: SanhBang","FT3: Lounge"
      });
        List<Book> books = bookRepository.findAll();

      for (Book book : books) {
          data.add(
                  new String[]{
                          book.getTitle(), book.getAuthor(), String.valueOf(book.getBookCopies().size()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT1_LEARNING_HUB.name()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT1_LIBRARY.name()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT2_CANTEEN.name()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT3_FHM.name()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT3_EBS.name()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT3_SANH_BANG.name()),
                          bookCopyRepository.countByBookAndShelfLocation(book,BookCopy.ShelfLocation.FT3_LOUNGE.name()),
                  }
          );
      }
        return data;
    }

    @Override
    public BookResponse updateBookCoverUrl(UUID bookId, String bookCoverUrl) {

        log.info(BookConstants.LOG_UPDATING_BOOK, bookId);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException(BookConstants.ERROR_BOOK_NOT_FOUND + bookId));

        book.setBookCover(bookCoverUrl);

        Book updateBook = bookRepository.save(book);

        BookResponse bookResponse = BookResponse.fromEntity(updateBook);

        log.info(BookConstants.LOG_BOOK_UPDATED, bookId);

        return bookResponse;
    }


    private void importBookFromRow(String values[]) {
        log.info("Parse data from file: {}", values);
        // Parse dữ liệu từ dòng Excel
        String titleRaw = values[1];
        String title = titleRaw.contains("-") ? titleRaw.split("-")[1].trim() : titleRaw.trim();
        String author = values[2].trim();
        String categoryName = values[3].trim();
        String publisher = values[4].trim();
        Integer quantity;
        try {
            quantity = Integer.parseInt(values[5].trim());
        } catch (Exception e) {
            throw new RuntimeException("Fail to cast number: " + e.getMessage());
        }
        String bookCoverUrl;
        if (values.length > 6 && values[6] != null && !values[6].trim().isEmpty()) {
            bookCoverUrl = values[6].trim();
        } else {
            bookCoverUrl = "";
        }
        String campusCode =  "HCM";
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
        Book book = bookRepository.findByTitleAndAuthorAndPublisher(title, author, publisher)
                .orElseGet(() -> {
                    Book newBook = Book.builder()
                            .title(title)
                            .author(author)
                            .publisher(publisher)
                            .bookCover(bookCoverUrl)
                            .category(category)
                            .build();
                    return bookRepository.save(newBook);
                });
          List<String> shefl = getShelfLocation(quantity);
        // Tạo book copy
        List<BookCopy> bookCopyList = new ArrayList<>();
        while (quantity > 0) {
            BookCopy bookCopy = BookCopy.builder()
                    .book(book)
                    .campus(campus)
                    .shelfLocation(shefl.get(shefl.size() - quantity))
                    .status(BookCopy.BookStatus.AVAILABLE)
                    .build();
            bookCopyList.add(bookCopy);
            quantity--;
        }
        bookCopyRepository.saveAll(bookCopyList);
        log.info("Save data to database");

    }
    public List<String> getShelfLocation(int quantiy)
    {
        List<String> shelfLocation = new ArrayList<>();
        Random random = new Random();
            if(quantiy == 1) {
                shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());
            }else if (quantiy == 2) {
                shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT1_LIBRARY.name());
            }else if (quantiy == 3 ) {
                shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT1_LIBRARY.name());
                if(random.nextInt(2) == 1 )
                {
                    shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());

                }else {
                    shelfLocation.add( BookCopy.ShelfLocation.FT1_LIBRARY.name());

                }
            }else if (quantiy == 4) {
                shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT1_LIBRARY.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_FHM.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_EBS.name());
            }
            else if(quantiy == 5) {
                shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT1_LIBRARY.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT2_CANTEEN.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_FHM.name());
                if(random.nextInt(2) == 1 )
                {
                    shelfLocation.add(BookCopy.ShelfLocation.FT1_LEARNING_HUB.name());
                }else {
                    shelfLocation.add( BookCopy.ShelfLocation.FT1_LIBRARY.name());
                }
            }else if(quantiy > 5) {
                shelfLocation.add( BookCopy.ShelfLocation.FT2_CANTEEN.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_FHM.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_EBS.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_SANH_BANG.name());
                shelfLocation.add( BookCopy.ShelfLocation.FT3_LOUNGE.name());
                int du = quantiy - 5;
                if(du > 0) {
                    int chia =  (int) Math.ceil(du / 2.0);
                    shelfLocation.addAll(Collections.nCopies(chia, BookCopy.ShelfLocation.FT1_LEARNING_HUB.name()));
                    shelfLocation.addAll(Collections.nCopies(du -chia, BookCopy.ShelfLocation.FT1_LIBRARY.name()));
                }
            }

        return  shelfLocation;
    }






}
