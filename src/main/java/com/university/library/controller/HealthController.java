package com.university.library.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "Health check endpoints for monitoring")
public class HealthController {

    @GetMapping
    @Operation(
        summary = "Health Check",
        description = "Returns the health status of the application"
    )
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Library Management System");
        response.put("version", "1.0.0");
        response.put("environment", "Development");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping")
    @Operation(
        summary = "Ping",
        description = "Simple ping endpoint for basic connectivity test"
    )
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    @GetMapping("/info")
    @Operation(
        summary = "Application Info",
        description = "Returns detailed information about the application"
    )
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Library Management System");
        info.put("version", "1.0.0");
        info.put("description", "Hệ thống quản lý thư viện đại học multi-campus");
        info.put("technology", "Spring Boot 3.2.0 + Java 21");
        info.put("database", "PostgreSQL");
        info.put("cache", "Redis");
        info.put("messageQueue", "Apache Kafka");
        info.put("frontend", "ReactJS");
        info.put("deployment", "Docker + Heroku");
        info.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(info);
    }
} 