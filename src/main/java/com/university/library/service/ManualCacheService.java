package com.university.library.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ManualCacheService {

    // DISABLE ALL CACHE OPERATIONS
    public <T> Optional<T> get(String cacheName, String key, Class<T> type) {
        return Optional.empty();
    }

    public <T> void put(String cacheName, String key, T value, Duration localTtl, Duration distributedTtl) {
        // NO ACTION - CACHE DISABLED
    }

    public void clear(String cacheName, String key) {
        // NO ACTION - CACHE DISABLED
    }

    public void clearByPattern(String cacheName, String pattern) {
        // NO ACTION - CACHE DISABLED
    }

    public void evict(String cacheName, String key) {
        // NO ACTION - CACHE DISABLED
    }

    public void evictAll(String cacheName) {
        // NO ACTION - CACHE DISABLED
    }

    public boolean exists(String cacheName, String key) {
        return false;
    }

    public Long getTtl(String cacheName, String key) {
        return null;
    }

    public void clearBooksCache(List<String> bookIds) {
        // NO ACTION - CACHE DISABLED
    }
} 
