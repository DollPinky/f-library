package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.BookResponse;
import com.university.library.dto.BookSearchParams;
import com.university.library.dto.CreateBorrowingCommand;
import com.university.library.entity.Account;
import com.university.library.entity.ChatHistory;
import com.university.library.repository.ChatHistoryRepository;
import com.university.library.service.command.BorrowingCommandService;
import com.university.library.service.query.BorrowingQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotFacade {
    private final GeminiFacade geminiFacade;
    private final ChatHistoryRepository chatHistoryRepository;
    private final BookFacade bookFacade;
    private final BorrowingCommandService borrowingCommandService;
    private final BorrowingQueryService borrowingQueryService;

    public String handlePrompt(String prompt, Account currentUser) {
        try {
            List<String> recentPrompts = chatHistoryRepository.findTop5Prompts(currentUser.getAccountId());

            StringBuilder context = new StringBuilder();
            for (String p : recentPrompts) {
                context.append("Người dùng: ").append(p).append("\n");
            }
            List<BookResponse> books = getAllBooksWithDetails();

            String bookList = books.stream()
                    .map(this::formatBookDetails)
                    .collect(Collectors.joining("\n"));

            context.append("Danh sách sách hiện có:\n").append(bookList).append("\n");

            if (currentUser != null) {
                context.append("\nThông tin người dùng hiện tại:\n");
                context.append("- ID: ").append(currentUser.getAccountId().toString()).append("\n");
                context.append("- Tên: ").append(currentUser.getFullName()).append("\n");
                context.append("- Email: ").append(currentUser.getEmail()).append("\n");
            }

            context.append("Người dùng: ").append(prompt).append("\n");
            context.append("Trợ lý: ");

            String systemInstruction = """
            Bạn là trợ lý thư viện thông minh. Ngoài việc trả lời câu hỏi, bạn có thể giúp người dùng mượn sách và hỗ trợ thủ thư quản lý thư viện.
            
            Các endpoint API hiện có:
            - GET /api/v1/books: Lấy danh sách sách
            - POST /api/v1/borrowings: Tạo yêu cầu mượn sách (cần CreateBorrowingCommand)
            - GET /api/v1/borrowings: Lấy danh sách yêu cầu mượn
            - PUT /api/v1/borrowings/{id}/confirm: Xác nhận mượn sách
            - PUT /api/v1/borrowings/{id}/return: Trả sách
            - DELETE /api/v1/borrowings/{id}/cancel: Hủy đặt sách
            - PUT /api/v1/borrowings/{id}/librarian-confirm: Thủ thư xác nhận mượn sách
            - PUT /api/v1/borrowings/{id}/librarian-confirm-return: Thủ thư xác nhận trả sách
            - PUT /api/v1/borrowings/{id}/lost: Báo mất sách
            
            Khi người dùng muốn mượn sách, hãy yêu cầu họ cung cấp:
            1. Tên sách muốn mượn
            2. ID người dùng (nếu người dùng chưa đăng nhập)
            3. Ngày muốn mượn (nếu khác ngày hiện tại, định dạng yyyy-MM-dd)
            
            Khi đủ thông tin, bạn có thể tạo yêu cầu mượn sách bằng cách trả lời theo định dạng đặc biệt sau:
            [BORROW_BOOK]Tên sách|ID người dùng (nếu cần)|Ngày mượn (yyyy-MM-dd)|Ghi chú[/BORROW_BOOK]
            
            Ví dụ: [BORROW_BOOK]Truyện Kiều|123e4567-e89b-12d3-a456-426614174000|2023-12-01|Sách cho nghiên cứu[/BORROW_BOOK]
            
            Nếu bạn là thủ thư và muốn xem danh sách các yêu cầu mượn sách đang chờ xác nhận, bạn có thể sử dụng:
            [GET_PENDING_BORROWINGS][/GET_PENDING_BORROWINGS]
            
            Nếu bạn là thủ thư và muốn xem danh sách các sách đang được mượn, bạn có thể sử dụng:
            [GET_BORROWED_BOOKS][/GET_BORROWED_BOOKS]
            
            Sau khi nhận được danh sách, bạn có thể:
            1. Xác nhận mượn sách cho người dùng bằng cách sử dụng ID của yêu cầu:
               [LIBRARIAN_CONFIRM_BORROWING]ID yêu cầu[/LIBRARIAN_CONFIRM_BORROWING]
            2. Xác nhận trả sách:
               [LIBRARIAN_CONFIRM_RETURN]ID yêu cầu[/LIBRARIAN_CONFIRM_RETURN]
            3. Báo mất sách:
               [REPORT_LOST]ID yêu cầu[/REPORT_LOST]
            
            Nếu người dùng cung cấp ID không hợp lệ, hãy yêu cầu họ cung cấp ID người dùng hợp lệ (UUID).
            """;

            String fullContext = systemInstruction + "\n" + context.toString();
            String reply = geminiFacade.generateReply(fullContext);

            String processedReply = processActions(reply, currentUser);

            float[] embedding = geminiFacade.generateEmbeddingWithCohere(prompt);

            ChatHistory chat = ChatHistory.builder()
                    .prompt(prompt)
                    .response(processedReply)
                    .embedding(embedding)
                    .createdAt(LocalDateTime.now())
                    .build();

            chatHistoryRepository.save(chat);

            return processedReply;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<BookResponse> getAllBooksWithDetails() {
        BookSearchParams params = new BookSearchParams();
        params.setPage(0);
        params.setSize(100);
        return bookFacade.searchBooks(params).getContent();
    }

    private String formatBookDetails(BookResponse book) {
        StringBuilder sb = new StringBuilder();
        sb.append("- ").append(book.getTitle()).append(" của ").append(book.getAuthor());

        // Thêm thông tin về số lượng bản sao có sẵn
        if (book.getBookCopies() != null && !book.getBookCopies().isEmpty()) {
            long availableCopies = book.getBookCopies().stream()
                .filter(copy -> "AVAILABLE".equals(copy.getStatus()))
                .count();
            sb.append(" (Còn ").append(availableCopies).append("/").append(book.getBookCopies().size()).append(" bản)");
        }

        return sb.toString();
    }

    private String processActions(String reply, Account currentUser) {
        // Kiểm tra xem AI có yêu cầu mượn sách không
        if (reply.contains("[BORROW_BOOK]")) {
            try {
                String borrowRequest = reply.substring(reply.indexOf("[BORROW_BOOK]") + 13, reply.indexOf("[/BORROW_BOOK]"));
                String[] parts = borrowRequest.split("\\|");

                if (parts.length >= 1) {
                    String bookTitle = parts[0].trim();

                    // Sử dụng ID người dùng từ session nếu có, nếu không thì yêu cầu từ AI
                    UUID userId;
                    if (currentUser != null) {
                        userId = currentUser.getAccountId();
                    } else if (parts.length >= 2) {
                        try {
                            userId = UUID.fromString(parts[1].trim());
                        } catch (IllegalArgumentException e) {
                            String errorMessage = "\n\n❌ ID người dùng không hợp lệ. Vui lòng cung cấp ID người dùng hợp lệ (UUID).";
                            return reply.replace("[BORROW_BOOK]" + borrowRequest + "[/BORROW_BOOK]", errorMessage);
                        }
                    } else {
                        String errorMessage = "\n\n❌ Không thể xác định ID người dùng. Vui lòng đăng nhập hoặc cung cấp ID người dùng.";
                        return reply.replace("[BORROW_BOOK]" + borrowRequest + "[/BORROW_BOOK]", errorMessage);
                    }

                    String borrowDateStr = parts.length > 2 ? parts[2].trim() : null;
                    String notes = parts.length > 3 ? parts[3].trim() : null;

                    // Tìm sách theo tiêu đề
                    BookSearchParams searchParams = new BookSearchParams();
                    searchParams.setQuery(bookTitle);
                    List<BookResponse> books = bookFacade.searchBooks(searchParams).getContent();

                    if (!books.isEmpty()) {
                        BookResponse book = books.get(0); // Lấy sách đầu tiên

                        // Tìm bản sao có sẵn
                        if (book.getBookCopies() != null && !book.getBookCopies().isEmpty()) {
                            BookResponse.BookCopyResponse availableCopy = book.getBookCopies().stream()
                                .filter(copy -> "AVAILABLE".equals(copy.getStatus()))
                                .findFirst()
                                .orElse(null);

                            if (availableCopy != null) {
                                // Tạo yêu cầu mượn sách
                                CreateBorrowingCommand command = CreateBorrowingCommand.builder()
                                    .bookCopyId(availableCopy.getBookCopyId())
                                    .borrowerId(userId)
                                    .borrowedDate(borrowDateStr != null ?
                                        Instant.parse(borrowDateStr + "T00:00:00Z") : Instant.now())
                                    .dueDate(Instant.now().plus(30, ChronoUnit.DAYS))
                                    .notes(notes)
                                    .build();

                                // Thực hiện mượn sách
                                borrowingCommandService.createBorrowing(command);

                                // Trả lời người dùng
                                String successMessage = "\n\n✅ Đã tạo yêu cầu mượn sách \"" + book.getTitle() + "\" thành công!\n"
                                    + "Vui lòng đến thư viện để nhận sách.";

                                return reply.replace("[BORROW_BOOK]" + borrowRequest + "[/BORROW_BOOK]", successMessage);
                            } else {
                                String errorMessage = "\n\n❌ Không có bản sao nào của sách \"" + book.getTitle() + "\" đang có sẵn để mượn.";
                                return reply.replace("[BORROW_BOOK]" + borrowRequest + "[/BORROW_BOOK]", errorMessage);
                            }
                        }
                    } else {
                        String errorMessage = "\n\n❌ Không tìm thấy sách \"" + bookTitle + "\" trong thư viện.";
                        return reply.replace("[BORROW_BOOK]" + borrowRequest + "[/BORROW_BOOK]", errorMessage);
                    }
                }
            } catch (Exception e) {
                // Nếu có lỗi, trả về thông báo lỗi
                String errorMessage = "\n\n❌ Có lỗi xảy ra khi xử lý yêu cầu mượn sách: " + e.getMessage();
                return reply.replaceFirst("\\[BORROW_BOOK\\].*?\\[/BORROW_BOOK\\]", errorMessage);
            }
        }

        // Kiểm tra xem AI có yêu cầu lấy danh sách mượn sách đang chờ không
        if (reply.contains("[GET_PENDING_BORROWINGS]")) {
            try {
                // Lấy danh sách tất cả các yêu cầu mượn sách với trạng thái PENDING_LIBRARIAN
                // Đây là các yêu cầu đang chờ thủ thư xác nhận
                com.university.library.base.PagedResponse<com.university.library.dto.BorrowingResponse> pendingBorrowings =
                    borrowingQueryService.getAllBorrowings(0, 10, "PENDING_LIBRARIAN", null);

                StringBuilder message = new StringBuilder();
                message.append("\n\n📋 Danh sách các yêu cầu mượn sách đang chờ xác nhận:\n");

                if (pendingBorrowings.getContent().isEmpty()) {
                    message.append("\nKhông có yêu cầu nào đang chờ xác nhận.");
                } else {
                    for (com.university.library.dto.BorrowingResponse borrowing : pendingBorrowings.getContent()) {
                        message.append(String.format(
                            "\n- ID: %s\n  Người mượn: %s\n  Sách: %s\n  Ngày mượn: %s\n  Hạn trả: %s\n",
                            borrowing.getBorrowingId(),
                            borrowing.getBorrower().getFullName(),
                            borrowing.getBookCopy().getBook().getTitle(),
                            borrowing.getBorrowedDate(),
                            borrowing.getDueDate()
                        ));
                    }
                    message.append("\nSử dụng lệnh sau để xác nhận mượn sách:\n");
                    message.append("[LIBRARIAN_CONFIRM_BORROWING]ID yêu cầu[/LIBRARIAN_CONFIRM_BORROWING]");
                }

                return reply.replace("[GET_PENDING_BORROWINGS][/GET_PENDING_BORROWINGS]", message.toString());
            } catch (Exception e) {
                String errorMessage = "\n\n❌ Có lỗi xảy ra khi lấy danh sách yêu cầu mượn sách: " + e.getMessage();
                return reply.replace("[GET_PENDING_BORROWINGS][/GET_PENDING_BORROWINGS]", errorMessage);
            }
        }

        // Kiểm tra xem AI có yêu cầu lấy danh sách sách đang được mượn không
        if (reply.contains("[GET_BORROWED_BOOKS]")) {
            try {
                // Lấy danh sách tất cả các sách đang được mượn với trạng thái BORROWED hoặc OVERDUE
                // Đây là các sách đang được người dùng mượn
                com.university.library.base.PagedResponse<com.university.library.dto.BorrowingResponse> borrowedBooks =
                    borrowingQueryService.getAllBorrowings(0, 10, "BORROWED", null);

                // Lấy danh sách sách quá hạn
                com.university.library.base.PagedResponse<com.university.library.dto.BorrowingResponse> overdueBooks =
                    borrowingQueryService.getAllBorrowings(0, 10, "OVERDUE", null);

                StringBuilder message = new StringBuilder();
                message.append("\n\n📚 Danh sách các sách đang được mượn:\n");

                boolean hasBorrowedBooks = !borrowedBooks.getContent().isEmpty();
                boolean hasOverdueBooks = !overdueBooks.getContent().isEmpty();

                if (!hasBorrowedBooks && !hasOverdueBooks) {
                    message.append("\nKhông có sách nào đang được mượn.");
                } else {
                    // Hiển thị sách đang mượn (BORROWED)
                    if (hasBorrowedBooks) {
                        message.append("\n🟢 Sách đang mượn:\n");
                        for (com.university.library.dto.BorrowingResponse borrowing : borrowedBooks.getContent()) {
                            message.append(String.format(
                                "\n- ID: %s\n  Người mượn: %s\n  Sách: %s\n  Ngày mượn: %s\n  Hạn trả: %s\n",
                                borrowing.getBorrowingId(),
                                borrowing.getBorrower().getFullName(),
                                borrowing.getBookCopy().getBook().getTitle(),
                                borrowing.getBorrowedDate(),
                                borrowing.getDueDate()
                            ));
                        }
                    }

                    // Hiển thị sách quá hạn (OVERDUE)
                    if (hasOverdueBooks) {
                        message.append("\n🔴 Sách quá hạn:\n");
                        for (com.university.library.dto.BorrowingResponse borrowing : overdueBooks.getContent()) {
                            message.append(String.format(
                                "\n- ID: %s\n  Người mượn: %s\n  Sách: %s\n  Ngày mượn: %s\n  Hạn trả: %s\n  Phí phạt: %.0f VND\n",
                                borrowing.getBorrowingId(),
                                borrowing.getBorrower().getFullName(),
                                borrowing.getBookCopy().getBook().getTitle(),
                                borrowing.getBorrowedDate(),
                                borrowing.getDueDate(),
                                borrowing.getFineAmount()
                            ));
                        }
                    }

                    message.append("\nSử dụng các lệnh sau để xử lý:\n");
                    message.append("- Xác nhận trả sách: [LIBRARIAN_CONFIRM_RETURN]ID yêu cầu[/LIBRARIAN_CONFIRM_RETURN]\n");
                    message.append("- Báo mất sách: [REPORT_LOST]ID yêu cầu[/REPORT_LOST]");
                }

                return reply.replace("[GET_BORROWED_BOOKS][/GET_BORROWED_BOOKS]", message.toString());
            } catch (Exception e) {
                String errorMessage = "\n\n❌ Có lỗi xảy ra khi lấy danh sách sách đang được mượn: " + e.getMessage();
                return reply.replace("[GET_BORROWED_BOOKS][/GET_BORROWED_BOOKS]", errorMessage);
            }
        }

        // Kiểm tra xem AI có yêu cầu xác nhận mượn sách cho thủ thư không
        if (reply.contains("[LIBRARIAN_CONFIRM_BORROWING]")) {
            try {
                String borrowingIdStr = reply.substring(reply.indexOf("[LIBRARIAN_CONFIRM_BORROWING]") + 29, reply.indexOf("[/LIBRARIAN_CONFIRM_BORROWING]"));
                UUID borrowingId = UUID.fromString(borrowingIdStr.trim());

                // Thực hiện xác nhận mượn sách
                com.university.library.dto.BorrowingResponse response = borrowingCommandService.confirmBorrowing(borrowingId);

                String successMessage = String.format(
                    "\n\n✅ Đã xác nhận mượn sách thành công!\n" +
                    "- ID: %s\n" +
                    "- Người mượn: %s\n" +
                    "- Sách: %s\n" +
                    "- Ngày mượn: %s\n" +
                    "- Hạn trả: %s",
                    response.getBorrowingId(),
                    response.getBorrower().getFullName(),
                    response.getBookCopy().getBook().getTitle(),
                    response.getBorrowedDate(),
                    response.getDueDate()
                );

                return reply.replace("[LIBRARIAN_CONFIRM_BORROWING]" + borrowingIdStr + "[/LIBRARIAN_CONFIRM_BORROWING]", successMessage);
            } catch (Exception e) {
                String errorMessage = "\n\n❌ Có lỗi xảy ra khi xác nhận mượn sách: " + e.getMessage();
                return reply.replaceFirst("\\[LIBRARIAN_CONFIRM_BORROWING\\].*?\\[/LIBRARIAN_CONFIRM_BORROWING\\]", errorMessage);
            }
        }

        // Kiểm tra xem AI có yêu cầu xác nhận trả sách cho thủ thư không
        if (reply.contains("[LIBRARIAN_CONFIRM_RETURN]")) {
            try {
                String borrowingIdStr = reply.substring(reply.indexOf("[LIBRARIAN_CONFIRM_RETURN]") + 26, reply.indexOf("[/LIBRARIAN_CONFIRM_RETURN]"));
                UUID borrowingId = UUID.fromString(borrowingIdStr.trim());

                // Thực hiện xác nhận trả sách
                com.university.library.dto.BorrowingResponse response = borrowingCommandService.confirmReturn(borrowingId);

                String successMessage = String.format(
                    "\n\n✅ Đã xác nhận trả sách thành công!\n" +
                    "- ID: %s\n" +
                    "- Người mượn: %s\n" +
                    "- Sách: %s\n" +
                    "- Ngày trả: %s\n" +
                    "- Phí phạt (nếu có): %.0f VND",
                    response.getBorrowingId(),
                    response.getBorrower().getFullName(),
                    response.getBookCopy().getBook().getTitle(),
                    response.getReturnedDate(),
                    response.getFineAmount()
                );

                return reply.replace("[LIBRARIAN_CONFIRM_RETURN]" + borrowingIdStr + "[/LIBRARIAN_CONFIRM_RETURN]", successMessage);
            } catch (Exception e) {
                String errorMessage = "\n\n❌ Có lỗi xảy ra khi xác nhận trả sách: " + e.getMessage();
                return reply.replaceFirst("\\[LIBRARIAN_CONFIRM_RETURN\\].*?\\[/LIBRARIAN_CONFIRM_RETURN\\]", errorMessage);
            }
        }

        // Kiểm tra xem AI có yêu cầu báo mất sách không
        if (reply.contains("[REPORT_LOST]")) {
            try {
                String borrowingIdStr = reply.substring(reply.indexOf("[REPORT_LOST]") + 13, reply.indexOf("[/REPORT_LOST]"));
                UUID borrowingId = UUID.fromString(borrowingIdStr.trim());

                // Thực hiện báo mất sách
                com.university.library.dto.BorrowingResponse response = borrowingCommandService.reportLost(borrowingId);

                String successMessage = String.format(
                    "\n\n✅ Đã báo mất sách thành công!\n" +
                    "- ID: %s\n" +
                    "- Người mượn: %s\n" +
                    "- Sách: %s\n" +
                    "- Phí phạt: %.0f VND",
                    response.getBorrowingId(),
                    response.getBorrower().getFullName(),
                    response.getBookCopy().getBook().getTitle(),
                    response.getFineAmount()
                );

                return reply.replace("[REPORT_LOST]" + borrowingIdStr + "[/REPORT_LOST]", successMessage);
            } catch (Exception e) {
                String errorMessage = "\n\n❌ Có lỗi xảy ra khi báo mất sách: " + e.getMessage();
                return reply.replaceFirst("\\[REPORT_LOST\\].*?\\[/REPORT_LOST\\]", errorMessage);
            }
        }

        return reply;
    }
}