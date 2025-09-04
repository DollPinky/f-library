package com.university.library.service;

import com.university.library.entity.BookCopy;
import com.university.library.repository.BookCopyRepository;
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
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookCopyQRPDFService {

    private final BookCopyRepository bookCopyRepository;
    private final QRCodeService qrCodeService;
    @Value("${app.cors.allowed-origins:*}")
    private String corsAllowedOrigins;

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
                    String qrContent = corsAllowedOrigins + "/api/v1/bookDetail/" + bookCopy.getQrCode();

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
                    String author = bookCopy.getBook().getAuthor() != null ? bookCopy.getBook().getAuthor() : "N/A";
                    String isbn = bookCopy.getBook().getIsbn() != null ? bookCopy.getBook().getIsbn() : "N/A";
                    String publisher = bookCopy.getBook().getPublisher() != null ? bookCopy.getBook().getPublisher() : "N/A";
                    String year = bookCopy.getBook().getYear() != null ? bookCopy.getBook().getYear().toString() : "N/A";
                    String shelfLocation = bookCopy.getShelfLocation() != null ? bookCopy.getShelfLocation() : "N/A";

                    // Use English labels to avoid font issues
                    safeShowText(contentStream, "Book Title: " + title);
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Author: " + author);
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "ISBN: " + isbn);
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Publisher: " + publisher);
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Year: " + year);
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Book Copy ID: " + bookCopy.getBookCopyId());
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "QR Code: " + bookCopy.getQrCode());
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Status: " + bookCopy.getStatus());
                    contentStream.newLineAtOffset(0, -20);
                    safeShowText(contentStream, "Shelf Location: " + shelfLocation);
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
                    java.io.File fontFile = new java.io.File(fontPath);
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

    private String getStatusInVietnamese(BookCopy.BookStatus status) {
        switch (status) {
            case AVAILABLE: return "Có sẵn";
            case BORROWED: return "Đã mượn";
            case RESERVED: return "Đã đặt trước";
            case PENDING: return "Đang chờ";
            case LOST: return "Bị mất";
            case DAMAGED: return "Bị hỏng";
            default: return status.toString();
        }
    }
}