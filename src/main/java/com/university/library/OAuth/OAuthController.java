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
    public ResponseEntity<?> oauth2Redirect() {
        return ResponseEntity.ok(Map.of(
                "message", "OAuth2 login successful",
                "redirectUrl", "/dashboard"
        ));
    }
}
