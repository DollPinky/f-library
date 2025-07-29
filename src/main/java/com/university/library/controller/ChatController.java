package com.university.library.controller;

import com.university.library.service.ChatbotFacade;
import com.university.library.service.GeminiFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final GeminiFacade geminiFacade;
    private final ChatbotFacade chatbotFacade;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody String prompt) {
        String reply = chatbotFacade.handlePrompt(prompt);
        return ResponseEntity.ok(reply);
    }

}
