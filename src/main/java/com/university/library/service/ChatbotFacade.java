package com.university.library.service;

import com.university.library.dto.BookResponse;
import com.university.library.entity.ChatHistory;
import com.university.library.repository.BookRepository;
import com.university.library.repository.ChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotFacade {
    private final GeminiFacade geminiFacade;
    private final ChatHistoryRepository chatHistoryRepository;
    private final BookRepository bookRepository;
    private final RestTemplate restTemplate;

    public String handlePrompt(String prompt) {
        try {
            // 1. Lấy 5 câu prompt gần nhất
            List<String> recentPrompts = chatHistoryRepository.findTop5Prompts(PageRequest.of(0, 5));

            // 2. Tạo context ban đầu từ các prompt trước
            StringBuilder context = new StringBuilder();
            for (String p : recentPrompts) {
                context.append("Người dùng: ").append(p).append("\n");
            }

            // 3. Gộp thêm danh sách sách
//            String bookList = bookRepository.findAll().stream()
//                    .map(book -> "- " + book.getTitle() + " của " + book.getAuthor())
//                    .collect(Collectors.joining("\n"));

            List<BookResponse> books = getAllBooksFromApi(); // gọi từ REST API

            String bookList = books.stream()
                    .map(book -> "- " + book.getTitle() + " của " + book.getAuthor())
                    .collect(Collectors.joining("\n"));

            context.append("Danh sách sách hiện có:\n").append(bookList).append("\n");

            // 4. Thêm prompt hiện tại
            context.append("Người dùng: ").append(prompt).append("\n");
            context.append("Trợ lý: ");

            // 5. Gửi vào Gemini AI
            String reply = geminiFacade.generateReply(context.toString());

            // 6. Tạo embedding + lưu lại
            float[] embedding = geminiFacade.generateEmbeddingWithCohere(prompt);

            ChatHistory chat = ChatHistory.builder()
                    .prompt(prompt)
                    .response(reply)
                    .embedding(embedding)
                    .createdAt(LocalDateTime.now())
                    .build();

            chatHistoryRepository.save(chat);

            return reply;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<BookResponse> getAllBooksFromApi() {
        String apiUrl = "http://localhost:8080/books/all";
        ResponseEntity<BookResponse[]> response = restTemplate.getForEntity(apiUrl, BookResponse[].class);
        return Arrays.asList(response.getBody());
    }


//    public String handlePrompt(String prompt) {
//        try {
//            List<String> recentPrompts = chatHistoryRepository.findTop5Prompts(PageRequest.of(0, 5));
//
//
//            StringBuilder context = new StringBuilder();
//            for (String p : recentPrompts) {
//                context.append("Người dùng: ").append(p).append("\n");
//            }
//
//            context.append("Người dùng: ").append(prompt).append("\n");
//            context.append("Trợ lý: ");
//
//
//            String reply = geminiFacade.generateReply(context.toString());
//            float[] embedding = geminiFacade.generateEmbeddingWithCohere(prompt);
//
//            ChatHistory chat = ChatHistory.builder()
//                    .prompt(prompt)
//                    .response(reply)
//                    .embedding(embedding)
//                    .createdAt(java.time.LocalDateTime.now())
//                    .build();
//
//            chatHistoryRepository.save(chat);
//
//            return reply;
//        } catch (Exception e) {
//            e.printStackTrace(); // log full lỗi gốc
//            throw e; // hoặc return "Lỗi: " + e.getMessage();
//        }
//    }





}