package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.service.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller để quản lý cache
 */
@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
@Slf4j
public class CacheController {

    private final CacheService cacheService;

    /**
     * Xóa tất cả cache theo tên
     */
    @DeleteMapping("/{cacheName}")
    public ResponseEntity<StandardResponse<String>> clearCache(@PathVariable String cacheName) {
        log.info("Clearing cache: {}", cacheName);
        
        try {
            cacheService.clearAllCaches(cacheName);
            StandardResponse<String> response = StandardResponse.success(
                "Xóa cache thành công: " + cacheName, null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error clearing cache: ", e);
            StandardResponse<String> response = StandardResponse.error(
                "Không thể xóa cache: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Xóa key cụ thể khỏi cache
     */
    @DeleteMapping("/{cacheName}/key")
    public ResponseEntity<StandardResponse<String>> evictKey(
            @PathVariable String cacheName,
            @RequestParam String key) {
        log.info("Evicting key from cache: {} - {}", cacheName, key);
        
        try {
            cacheService.evictFromCaffeine(cacheName, key);
            cacheService.evictFromRedis(key);
            
            StandardResponse<String> response = StandardResponse.success(
                "Xóa key thành công: " + key, null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error evicting key: ", e);
            StandardResponse<String> response = StandardResponse.error(
                "Không thể xóa key: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Lấy thông tin cache
     */
    @GetMapping("/{cacheName}/info")
    public ResponseEntity<StandardResponse<Map<String, Object>>> getCacheInfo(
            @PathVariable String cacheName,
            @RequestParam(required = false) String key) {
        log.info("Getting cache info: {} - {}", cacheName, key);
        
        try {
            Map<String, Object> info = new HashMap<>();
            
            if (key != null) {
                Object caffeineValue = cacheService.getFromCaffeine(cacheName, key);
                Object redisValue = cacheService.getFromRedis(key);
                boolean existsInRedis = cacheService.existsInRedis(key);
                Long ttl = cacheService.getTtlFromRedis(key);
                
                info.put("key", key);
                info.put("existsInCaffeine", caffeineValue != null);
                info.put("existsInRedis", existsInRedis);
                info.put("ttlInRedis", ttl);
                info.put("caffeineValue", caffeineValue);
                info.put("redisValue", redisValue);
            } else {
                info.put("cacheName", cacheName);
                info.put("description", "Cache information for: " + cacheName);
            }
            
            StandardResponse<Map<String, Object>> response = StandardResponse.success(
                "Lấy thông tin cache thành công", info);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting cache info: ", e);
            StandardResponse<Map<String, Object>> response = StandardResponse.error(
                "Không thể lấy thông tin cache: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Xóa tất cả cache
     */
    @DeleteMapping("/all")
    public ResponseEntity<StandardResponse<String>> clearAllCaches() {
        log.info("Clearing all caches");
        
        try {
            String[] cacheNames = {"books", "categories", "libraries", "staff"};
            for (String cacheName : cacheNames) {
                cacheService.clearAllCaches(cacheName);
            }
            
            StandardResponse<String> response = StandardResponse.success(
                "Xóa tất cả cache thành công", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error clearing all caches: ", e);
            StandardResponse<String> response = StandardResponse.error(
                "Không thể xóa tất cả cache: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
} 

