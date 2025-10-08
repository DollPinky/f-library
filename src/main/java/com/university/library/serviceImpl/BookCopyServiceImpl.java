package com.university.library.serviceImpl;

import com.university.library.base.PagedResponse;
import com.university.library.constants.BookConstants;
import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.request.bookCopy.BookCopySearchParams;
import com.university.library.dto.request.bookCopy.BookDonationRequest;
import com.university.library.dto.request.bookCopy.CreateBookCopyCommand;
import com.university.library.dto.request.bookCopy.CreateBookCopyFromBookCommand;
import com.university.library.dto.response.bookCopy.BookCopyResponse;
import com.university.library.entity.*;
import com.university.library.exception.exceptions.NotFoundException;
import com.university.library.repository.*;
import com.university.library.service.BookCopyService;
import com.university.library.specification.BookCopySpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BookCopyServiceImpl implements BookCopyService {
    private final BookCopyRepository bookCopyRepository;
    private final QRCodeServiceImpl qrCodeService;
    private final BookRepository bookRepository;
    private final CampusRepository campusRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;


    @Value("${app.cors.allowed-origins:*}")
    private String corsAllowedOrigins;

    /**
    QrCode Book
     */
    public byte[] generateAllQRCodesPDF() throws Exception {
        // Use the new method name
        List<BookCopy> bookCopies = bookCopyRepository.findAllBookCopiesWithBook();

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // Load a Unicode-supporting font
            PDFont font = loadUnicodeFont(document);

            for (BookCopy bookCopy : bookCopies) {
                PDPage page = new PDPage(PDRectangle.A4);
                document.addPage(page);

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    // Generate QR code
                    String qrContent = corsAllowedOrigins + "/app/v1/book-copies/" + String.valueOf(bookCopy.getBookCopyId());
//                    String qrContent = String.valueOf(bookCopy.getBookCopyId());
                    byte[] qrImageBytes = qrCodeService.generateQRCodeImage(qrContent, 200, 200);
                    PDImageXObject qrImage = PDImageXObject.createFromByteArray(document, qrImageBytes, "QRCode");
                    // Add QR code to PDF
                    contentStream.drawImage(qrImage, 50, 600, 150, 150);
                    // Add book information with Unicode font
                    contentStream.setFont(font, 12);
                    contentStream.beginText();
                    contentStream.newLineAtOffset(50, 550);
                    // Add null checks to prevent NullPointerException
                    String title = bookCopy.getBook().getTitle() != null ? bookCopy.getBook().getTitle() : "N/A";
                    // Use English labels to avoid font issues
                    safeShowText(contentStream, "Book Title: " + title);
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Book Copy ID: " + bookCopy.getBookCopyId());
                    contentStream.newLineAtOffset(0, -20);
                    contentStream.endText();
                }
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private PDFont loadUnicodeFont(PDDocument document) throws IOException {
        try {
            // Try to load a system font that supports Vietnamese
            // First, try to use Arial (common on Windows)
            try {
                ClassPathResource resource = new ClassPathResource("fonts/arial.ttf");
                if (resource.exists()) {
                    try (InputStream fontStream = resource.getInputStream()) {
                        return PDType0Font.load(document, fontStream);
                    }
                }
            } catch (Exception e) {
                log.debug("Could not load Arial font from classpath: {}", e.getMessage());
            }

            // Try to load from system fonts
            String[] fontPaths = {
                    "C:/Windows/Fonts/arial.ttf",           // Windows
                    "/System/Library/Fonts/Arial.ttf",      // macOS
                    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", // Linux
                    "/usr/share/fonts/TTF/arial.ttf"        // Linux alternative
            };

            for (String fontPath : fontPaths) {
                try {
                    File fontFile = new File(fontPath);
                    if (fontFile.exists()) {
                        return PDType0Font.load(document, fontFile);
                    }
                } catch (Exception e) {
                    log.debug("Could not load font from {}: {}", fontPath, e.getMessage());
                }
            }

            // If no system font is found, use built-in font with ASCII fallback
            log.warn("No Unicode font found, using built-in font with ASCII conversion");
            return PDType0Font.load(document,
                    getClass().getResourceAsStream("/fonts/NotoSans-Regular.ttf"));

        } catch (Exception e) {
            log.error("Failed to load Unicode font, falling back to Helvetica: {}", e.getMessage());
            // As last resort, return a basic font but we'll convert text to ASCII
            throw new RuntimeException("Could not load a Unicode-supporting font. Please add a TTF font that supports Vietnamese to the classpath or system fonts.", e);
        }
    }

    private void safeShowText(PDPageContentStream contentStream, String text) throws IOException {
        try {
            contentStream.showText(text);
        } catch (Exception e) {
            // If Unicode text fails, convert to ASCII approximation
            String asciiText = convertVietnameseToAscii(text);
            contentStream.showText(asciiText);
        }
    }

    private String convertVietnameseToAscii(String text) {
        // Basic Vietnamese to ASCII conversion
        return text
                .replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a")
                .replaceAll("[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]", "A")
                .replaceAll("[èéẹẻẽêềếệểễ]", "e")
                .replaceAll("[ÈÉẸẺẼÊỀẾỆỂỄ]", "E")
                .replaceAll("[ìíịỉĩ]", "i")
                .replaceAll("[ÌÍỊỈĨ]", "I")
                .replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o")
                .replaceAll("[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]", "O")
                .replaceAll("[ùúụủũưừứựửữ]", "u")
                .replaceAll("[ÙÚỤỦŨƯỪỨỰỬỮ]", "U")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("[ỲÝỴỶỸ]", "Y")
                .replaceAll("[đ]", "d")
                .replaceAll("[Đ]", "D");
    }

    /**
     BookCopyQuery
     */

    public BookCopyResponse getBookCopyById(UUID bookCopyId) {

        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException("Book copy not found with ID: " + bookCopyId));

        BookCopyResponse response = BookCopyResponse.fromEntity(bookCopy);

        return response;
    }


    // BookCopyServiceImpl.java - update searchBookCopies method
    public PagedResponse<BookCopyResponse> searchBookCopies(BookCopySearchParams params) {
        log.info("Searching book copies with params: {}", params);

        // Create specification from search params
        Specification<BookCopy> spec = BookCopySpecification.withSearchParams(params);

        // Create pageable with sorting
        Sort.Direction direction = Sort.Direction.fromString(params.getSortDirection());
        Sort sort = Sort.by(direction, params.getSortBy());
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), sort);

        // Execute query with fetch joins to avoid N+1 problem
        Page<BookCopy> bookCopyPage = bookCopyRepository.findAll(spec, pageable);

        // Convert to response
        List<BookCopyResponse> content = bookCopyPage.getContent().stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                bookCopyPage.getNumber(),
                bookCopyPage.getSize(),
                bookCopyPage.getTotalElements()
        );
    }

    public List<BookCopyResponse> getBookCopiesByBookId(UUID bookId) {

        List<BookCopy> bookCopies = bookCopyRepository.findByBookBookId(bookId);
        List<BookCopyResponse> responses = bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());

        return responses;
    }


    public List<BookCopyResponse> getAvailableBookCopiesByBookId(UUID bookId) {

        List<BookCopy> bookCopies = bookCopyRepository.findByBookBookIdAndStatus(bookId, BookCopy.BookStatus.AVAILABLE);
        List<BookCopyResponse> responses = bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());

        return responses;
    }


    /**
     BookCopyCommand
     */

    public byte[] generateQRCodeImage(UUID bookCopyID) throws Exception {
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyID)
                .orElseThrow(() -> new RuntimeException("Book copy not found with ID: " + bookCopyID));
        String idBookCopy = corsAllowedOrigins + "/api/v1/book-copies/" + bookCopy.getBookCopyId();
        return qrCodeService.generateQRCodeImage(idBookCopy, 250, 250);
    }

    @Override
    public List<BookCopyResponse> findByCategory(UUID category) {
        List<BookCopy> bookCopies = bookCopyRepository.findByBook_Category_CategoryId(category);

        return bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookCopyResponse> findByCategoryAndStatus(UUID category, BookCopy.BookStatus status) {
        List<BookCopy> bookCopies = bookCopyRepository.findByBook_Category_CategoryIdAndStatus(category, status);

        return bookCopies.stream()
                .map(BookCopyResponse::fromEntity)
                .collect(Collectors.toList());
    }


    @Transactional
    public BookCopyResponse updateBookCopy(UUID bookCopyId, CreateBookCopyCommand command) {
        log.info("Updating book copy with ID: {}", bookCopyId);

        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));



        bookCopy.setShelfLocation(command.getShelfLocation());
        bookCopy.setStatus(convertBookStatus(command.getStatus()));

        BookCopy updatedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(updatedBookCopy);

        log.info(BookCopyConstants.LOG_BOOK_COPY_UPDATED, bookCopyId);
        return response;
    }

    @Transactional
    public void deleteBookCopy(UUID bookCopyId) {
        log.info("Deleting book copy with ID: {}", bookCopyId);

        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));

        if (bookCopy.getStatus() == BookCopy.BookStatus.BORROWED) {
            throw new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_IN_USE);
        }

        bookCopyRepository.delete(bookCopy);


        log.info(BookCopyConstants.LOG_BOOK_COPY_DELETED, bookCopyId);
    }

    @Transactional
    public BookCopyResponse changeBookCopyStatus(UUID bookCopyId, CreateBookCopyCommand.BookStatus newStatus) {
        log.info("Changing book copy status: {} -> {}", bookCopyId, newStatus);

        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException(BookCopyConstants.ERROR_BOOK_COPY_NOT_FOUND + bookCopyId));

        BookCopy.BookStatus oldStatus = bookCopy.getStatus();
        bookCopy.setStatus(convertBookStatus(newStatus));

        BookCopy updatedBookCopy = bookCopyRepository.save(bookCopy);
        BookCopyResponse response = BookCopyResponse.fromEntity(updatedBookCopy);


        log.info(BookCopyConstants.LOG_STATUS_CHANGED, oldStatus, newStatus);
        return response;
    }

    /**
     * Tạo book copies cho một book
     */
    @Transactional
    public void createBookCopiesFromBook(CreateBookCopyFromBookCommand command) {
        log.info("Creating {} book copies for book: {}", command.getCopies().size(), command.getBookId());

        Book book = bookRepository.findById(command.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + command.getBookId()));

        List<BookCopy> bookCopies = new ArrayList<>();

        for (CreateBookCopyFromBookCommand.BookCopyInfo copyInfo : command.getCopies()) {
            Campus library = campusRepository.findById(copyInfo.getCampusId())
                    .orElseThrow(() -> new RuntimeException("Library not found with ID: " + copyInfo.getCampusId()));
                BookCopy bookCopy = BookCopy.builder()
                        .book(book)
                        .bookCopyId(copyInfo.getBookCopyId())
                        .campus(library)
                        .shelfLocation(copyInfo.getLocation())
                        .status(BookCopy.BookStatus.AVAILABLE)
                        .build();
                bookCopies.add(bookCopy);

        }

        bookCopyRepository.saveAll(bookCopies);

        log.info("Successfully created {} book copies for book: {}", bookCopies.size(), command.getBookId());
    }

    @Override
    @Transactional
    public BookCopyResponse bookDonation(BookDonationRequest request) {
        User user = userRepository.findByEmail(request.getUsername()).orElseThrow(()->
                new NotFoundException("User not found with username: " + request.getUsername())
        );
        // + diem cho user
        Category cate = categoryRepository.findById(request.getCategoryId()).orElseThrow(()
                ->  new NotFoundException("Category not found with category id: " + request.getCategoryId())
        );
        Book b = bookRepository.findByTitleEqualsIgnoreCase(request.getTitle());
        if (b == null) {
           b = Book.builder()
                    .title(request.getTitle())
                    .category(cate)
                    .build();
          b =  bookRepository.save(b);
        }
        Campus cpus = campusRepository.findByCode( request.getCampusCode());
        if(cpus == null) {
            throw new NotFoundException("Campus not found with code: " + request.getCampusCode());
        }
        BookCopy bc = BookCopy.builder()
                .book(b)
                .campus(cpus)
                .status(BookCopy.BookStatus.AVAILABLE)
                .shelfLocation(request.getShelfLocation())
                .build();
        BookCopy save  =   bookCopyRepository.save(bc);
       BookCopyResponse response = BookCopyResponse.fromEntity(save);
       return response;
    }

    private BookCopy.BookStatus convertBookStatus(CreateBookCopyCommand.BookStatus status) {
        if (status == null) {
            return BookCopy.BookStatus.AVAILABLE;
        }

        switch (status) {
            case AVAILABLE:
                return BookCopy.BookStatus.AVAILABLE;
            case BORROWED:
                return BookCopy.BookStatus.BORROWED;
            case RESERVED:
                return BookCopy.BookStatus.RESERVED;
            case LOST:
                return BookCopy.BookStatus.LOST;
            case DAMAGED:
                return BookCopy.BookStatus.DAMAGED;
            default:
                return BookCopy.BookStatus.AVAILABLE;
        }
    }
}
