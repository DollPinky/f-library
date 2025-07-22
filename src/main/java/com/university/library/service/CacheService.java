package com.university.library.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Service helper để dễ sử dụng cache
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CacheService {

    private final CacheManager caffeineCacheManager;
    private final CacheManager redisCacheManager;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Lấy giá trị từ Caffeine cache
     */
    public Object getFromCaffeine(String cacheName, String key) {
        Cache cache = caffeineCacheManager.getCache(cacheName);
        if (cache != null) {
            Cache.ValueWrapper wrapper = cache.get(key);
            return wrapper != null ? wrapper.get() : null;
        }
        return null;
    }

    /**
     * Lưu giá trị vào Caffeine cache
     */
    public void putToCaffeine(String cacheName, String key, Object value) {
        Cache cache = caffeineCacheManager.getCache(cacheName);
        if (cache != null) {
            cache.put(key, value);
            log.debug("Stored in Caffeine cache: {} - {}", cacheName, key);
        }
    }

    /**
     * Lấy giá trị từ Redis cache
     */
    public Object getFromRedis(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * Lưu giá trị vào Redis cache với TTL
     */
    public void putToRedis(String key, Object value, Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
        log.debug("Stored in Redis cache: {} with TTL: {}", key, ttl);
    }

    /**
     * Lưu giá trị vào Redis cache với TTL (minutes)
     */
    public void putToRedis(String key, Object value, long minutes) {
        putToRedis(key, value, Duration.ofMinutes(minutes));
    }

    /**
     * Xóa key khỏi Caffeine cache
     */
    public void evictFromCaffeine(String cacheName, String key) {
        Cache cache = caffeineCacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
            log.debug("Evicted from Caffeine cache: {} - {}", cacheName, key);
        }
    }

    /**
     * Xóa tất cả entries trong Caffeine cache
     */
    public void clearCaffeine(String cacheName) {
        Cache cache = caffeineCacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            log.debug("Cleared Caffeine cache: {}", cacheName);
        }
    }

    /**
     * Xóa key khỏi Redis cache
     */
    public void evictFromRedis(String key) {
        redisTemplate.delete(key);
        log.debug("Evicted from Redis cache: {}", key);
    }

    /**
     * Xóa tất cả keys có pattern
     */
    public void clearRedisByPattern(String pattern) {
        redisTemplate.delete(redisTemplate.keys(pattern));
        log.debug("Cleared Redis cache by pattern: {}", pattern);
    }

    /**
     * Xóa tất cả cache (Caffeine + Redis)
     */
    public void clearAllCaches(String cacheName) {
        clearCaffeine(cacheName);
        clearRedisByPattern(cacheName + ":*");
        log.info("Cleared all caches: {}", cacheName);
    }

    /**
     * Kiểm tra key có tồn tại trong Redis không
     */
    public boolean existsInRedis(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * Lấy TTL của key trong Redis
     */
    public Long getTtlFromRedis(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    /**
     * Set TTL cho key trong Redis
     */
    public void setTtlForRedis(String key, Duration ttl) {
        redisTemplate.expire(key, ttl);
        log.debug("Set TTL for Redis key: {} - {}", key, ttl);
    }
} 