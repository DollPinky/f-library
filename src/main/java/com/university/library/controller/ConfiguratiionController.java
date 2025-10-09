package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.response.configuration.ConfigurationResponse;
import com.university.library.service.ConfigurationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/configuration")
public class ConfiguratiionController {
    @Autowired
    private ConfigurationService configurationService;
    @GetMapping
    public ResponseEntity<StandardResponse<ConfigurationResponse>> configuration() {
        return ResponseEntity.ok(StandardResponse.success(configurationService.getConfiguration()));
    }
}
