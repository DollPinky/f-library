package com.university.library.OAuth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/oauth2")
public class OAuthController {
    @GetMapping("/redirect")
    public ResponseEntity<?> oauth2Redirect(@RequestParam String token) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "OAuth2 login successful");
        response.put("token", token);
        response.put("redirectUrl", "/dashboard");

        return ResponseEntity.ok(response);
    }
}
