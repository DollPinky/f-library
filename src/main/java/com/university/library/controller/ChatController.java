package com.university.library.controller;

import com.university.library.entity.Account;
import com.university.library.service.ChatbotFacade;
import com.university.library.service.GeminiFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {
    private final GeminiFacade geminiFacade;
    private final ChatbotFacade chatbotFacade;

    @PostMapping(consumes = "text/plain")
    public ResponseEntity<String> chat(@RequestBody String prompt, Authentication authentication) {
        Account currentUser = authentication != null ? (Account) authentication.getPrincipal() : null;
        String reply = chatbotFacade.handlePrompt(prompt, currentUser);
        return ResponseEntity.ok(reply);
    }

}
