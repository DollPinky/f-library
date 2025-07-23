package com.university.library.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManualCacheService {
    
    private final CacheManager cacheManager;
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * Lấy giá trị từ cache (local trước, sau đó distributed)
     */
    public <T> Optional<T> get(String cacheName, String key, Class<T> type) {
        try {
            // Thử lấy từ local cache trước
            Cache localCache = cacheManager.getCache(cacheName);
            if (localCache != null) {
                Cache.ValueWrapper localValue = localCache.get(key);
                if (localValue != null) {
                    log.debug("Cache hit - Local cache: {}:{}", cacheName, key);
                    return Optional.of((T) localValue.get());
                }
            }
            
            // Nếu không có trong local cache, thử lấy từ Redis
            String redisKey = cacheName + ":" + key;
            T redisValue = (T) redisTemplate.opsForValue().get(redisKey);
            if (redisValue != null) {
                log.debug("Cache hit - Redis cache: {}:{}", cacheName, key);
                // Đưa vào local cache
                if (localCache != null) {
                    localCache.put(key, redisValue);
                }
                return Optional.of(redisValue);
            }
            
            log.debug("Cache miss: {}:{}", cacheName, key);
            return Optional.empty();
            
        } catch (Exception e) {
            log.warn("Error getting from cache {}:{} - {}", cacheName, key, e.getMessage());
            return Optional.empty();
        }
    }
    
    /**
     * Lưu giá trị vào cả local và distributed cache
     */
    public <T> void put(String cacheName, String key, T value, Duration localTtl, Duration distributedTtl) {
        try {
            // Lưu vào local cache
            Cache localCache = cacheManager.getCache(cacheName);
            if (localCache != null) {
                localCache.put(key, value);
                log.debug("Saved to local cache: {}:{}", cacheName, key);
            }
            
            // Lưu vào Redis với TTL
            String redisKey = cacheName + ":" + key;
            if (distributedTtl != null) {
                redisTemplate.opsForValue().set(redisKey, value, distributedTtl);
            } else {
                redisTemplate.opsForValue().set(redisKey, value);
            }
            log.debug("Saved to Redis cache: {}:{} with TTL: {}", cacheName, key, distributedTtl);
            
        } catch (Exception e) {
            log.warn("Error putting to cache {}:{} - {}", cacheName, key, e.getMessage());
        }
    }
    
    /**
     * Lưu giá trị vào cache với TTL mặc định
     */
    public <T> void put(String cacheName, String key, T value) {
        put(cacheName, key, value, Duration.ofMinutes(5), Duration.ofMinutes(15));
    }
    
    /**
     * Xóa giá trị khỏi cả local và distributed cache
     */
    public void evict(String cacheName, String key) {
        try {
            // Xóa khỏi local cache
            Cache localCache = cacheManager.getCache(cacheName);
            if (localCache != null) {
                localCache.evict(key);
                log.debug("Evicted from local cache: {}:{}", cacheName, key);
            }
            
            // Xóa khỏi Redis
            String redisKey = cacheName + ":" + key;
            redisTemplate.delete(redisKey);
            log.debug("Evicted from Redis cache: {}:{}", cacheName, key);
            
        } catch (Exception e) {
            log.warn("Error evicting from cache {}:{} - {}", cacheName, key, e.getMessage());
        }
    }
    
    /**
     * Xóa toàn bộ cache theo tên
     */
    public void evictAll(String cacheName) {
        try {
            // Xóa local cache
            Cache localCache = cacheManager.getCache(cacheName);
            if (localCache != null) {
                localCache.clear();
                log.debug("Cleared local cache: {}", cacheName);
            }
            
            // Xóa Redis cache theo pattern
            String pattern = cacheName + ":*";
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.debug("Cleared Redis cache: {} ({} keys)", cacheName, keys.size());
            }
            
        } catch (Exception e) {
            log.warn("Error clearing cache {} - {}", cacheName, e.getMessage());
        }
    }
    
    /**
     * Kiểm tra xem key có tồn tại trong cache không
     */
    public boolean exists(String cacheName, String key) {
        try {
            // Kiểm tra local cache
            Cache localCache = cacheManager.getCache(cacheName);
            if (localCache != null && localCache.get(key) != null) {
                return true;
            }
            
            // Kiểm tra Redis
            String redisKey = cacheName + ":" + key;
            return Boolean.TRUE.equals(redisTemplate.hasKey(redisKey));
            
        } catch (Exception e) {
            log.warn("Error checking cache existence {}:{} - {}", cacheName, key, e.getMessage());
            return false;
        }
    }
    
    /**
     * Lấy TTL của key trong Redis
     */
    public Long getTtl(String cacheName, String key) {
        try {
            String redisKey = cacheName + ":" + key;
            return redisTemplate.getExpire(redisKey, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Error getting TTL for {}:{} - {}", cacheName, key, e.getMessage());
            return null;
        }
    }
} 