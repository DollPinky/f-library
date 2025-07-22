package com.university.library.aspect;

import com.university.library.annotation.MultiLayerCache;
import com.university.library.annotation.MultiLayerCacheEvict;
import com.university.library.annotation.MultiLayerCachePut;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
@Slf4j
public class MultiLayerCacheAspect {

    private final CacheManager caffeineCacheManager;
    private final CacheManager redisCacheManager;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ExpressionParser expressionParser = new SpelExpressionParser();

    public MultiLayerCacheAspect(
            @Qualifier("caffeineCacheManager") CacheManager caffeineCacheManager,
            @Qualifier("redisCacheManager") CacheManager redisCacheManager,
            RedisTemplate<String, Object> redisTemplate) {
        this.caffeineCacheManager = caffeineCacheManager;
        this.redisCacheManager = redisCacheManager;
        this.redisTemplate = redisTemplate;
    }

    /**
     * Xử lý @MultiLayerCache
     */
    @Around("@annotation(multiLayerCache)")
    public Object handleMultiLayerCache(ProceedingJoinPoint joinPoint, MultiLayerCache multiLayerCache) throws Throwable {
        String cacheName = multiLayerCache.value();
        String key = generateKey(joinPoint, multiLayerCache.key());
        
        log.debug("MultiLayerCache: Checking cache for key: {}", key);
        
        // Kiểm tra Caffeine cache trước
        if (multiLayerCache.useCaffeine()) {
            Cache caffeineCache = caffeineCacheManager.getCache(cacheName);
            if (caffeineCache != null) {
                Cache.ValueWrapper cachedValue = caffeineCache.get(key);
                if (cachedValue != null) {
                    log.debug("MultiLayerCache: Found in Caffeine cache for key: {}", key);
                    return cachedValue.get();
                }
            }
        }
        
        // Kiểm tra Redis cache
        if (multiLayerCache.useRedis()) {
            Object cachedValue = redisTemplate.opsForValue().get(key);
            if (cachedValue != null) {
                log.debug("MultiLayerCache: Found in Redis cache for key: {}", key);
                
                // Cập nhật Caffeine cache
                if (multiLayerCache.useCaffeine()) {
                    Cache caffeineCache = caffeineCacheManager.getCache(cacheName);
                    if (caffeineCache != null) {
                        caffeineCache.put(key, cachedValue);
                    }
                }
                
                return cachedValue;
            }
        }
        
        // Thực thi method nếu không tìm thấy trong cache
        Object result = joinPoint.proceed();
        
        // Lưu kết quả vào cache
        if (result != null) {
            // Lưu vào Caffeine
            if (multiLayerCache.useCaffeine()) {
                Cache caffeineCache = caffeineCacheManager.getCache(cacheName);
                if (caffeineCache != null) {
                    caffeineCache.put(key, result);
                }
            }
            
            // Lưu vào Redis
            if (multiLayerCache.useRedis()) {
                Duration ttl = Duration.of(multiLayerCache.distributedTtl(), multiLayerCache.distributedTimeUnit().toChronoUnit());
                redisTemplate.opsForValue().set(key, result, ttl);
                log.debug("MultiLayerCache: Stored in Redis cache for key: {} with TTL: {}", key, ttl);
            }
        }
        
        return result;
    }

    /**
     * Xử lý @MultiLayerCacheEvict
     */
    @Around("@annotation(multiLayerCacheEvict)")
    public Object handleMultiLayerCacheEvict(ProceedingJoinPoint joinPoint, MultiLayerCacheEvict multiLayerCacheEvict) throws Throwable {
        Object result;
        
        // Xóa cache trước khi thực thi nếu cần
        if (multiLayerCacheEvict.beforeInvocation()) {
            evictCaches(joinPoint, multiLayerCacheEvict);
        }
        
        // Thực thi method
        result = joinPoint.proceed();
        
        // Xóa cache sau khi thực thi
        if (!multiLayerCacheEvict.beforeInvocation()) {
            evictCaches(joinPoint, multiLayerCacheEvict);
        }
        
        return result;
    }

    /**
     * Xử lý @MultiLayerCachePut
     */
    @Around("@annotation(multiLayerCachePut)")
    public Object handleMultiLayerCachePut(ProceedingJoinPoint joinPoint, MultiLayerCachePut multiLayerCachePut) throws Throwable {
        // Thực thi method trước
        Object result = joinPoint.proceed();
        
        // Lưu kết quả vào cache
        if (result != null) {
            String cacheName = multiLayerCachePut.value();
            String key = generateKey(joinPoint, multiLayerCachePut.key());
            
            // Lưu vào Caffeine
            if (multiLayerCachePut.useCaffeine()) {
                Cache caffeineCache = caffeineCacheManager.getCache(cacheName);
                if (caffeineCache != null) {
                    caffeineCache.put(key, result);
                }
            }
            
            // Lưu vào Redis
            if (multiLayerCachePut.useRedis()) {
                Duration ttl = Duration.of(multiLayerCachePut.distributedTtl(), multiLayerCachePut.distributedTimeUnit().toChronoUnit());
                redisTemplate.opsForValue().set(key, result, ttl);
                log.debug("MultiLayerCachePut: Stored in Redis cache for key: {} with TTL: {}", key, ttl);
            }
        }
        
        return result;
    }

    /**
     * Xóa cache
     */
    private void evictCaches(ProceedingJoinPoint joinPoint, MultiLayerCacheEvict multiLayerCacheEvict) {
        String[] cacheNames = multiLayerCacheEvict.value();
        String key = generateKey(joinPoint, multiLayerCacheEvict.key());
        
        for (String cacheName : cacheNames) {
            // Xóa Caffeine cache
            if (multiLayerCacheEvict.evictCaffeine()) {
                Cache caffeineCache = caffeineCacheManager.getCache(cacheName);
                if (caffeineCache != null) {
                    if (multiLayerCacheEvict.allEntries()) {
                        caffeineCache.clear();
                        log.debug("MultiLayerCacheEvict: Cleared all entries in Caffeine cache: {}", cacheName);
                    } else {
                        caffeineCache.evict(key);
                        log.debug("MultiLayerCacheEvict: Evicted key from Caffeine cache: {} - {}", cacheName, key);
                    }
                }
            }
            
            // Xóa Redis cache
            if (multiLayerCacheEvict.evictRedis()) {
                if (multiLayerCacheEvict.allEntries()) {
                    // Xóa tất cả keys có pattern cacheName:*
                    redisTemplate.delete(redisTemplate.keys(cacheName + ":*"));
                    log.debug("MultiLayerCacheEvict: Cleared all entries in Redis cache: {}", cacheName);
                } else {
                    redisTemplate.delete(key);
                    log.debug("MultiLayerCacheEvict: Evicted key from Redis cache: {} - {}", cacheName, key);
                }
            }
        }
    }

    /**
     * Tạo key cho cache
     */
    private String generateKey(ProceedingJoinPoint joinPoint, String keyExpression) {
        if (keyExpression.isEmpty()) {
            // Tạo key mặc định từ method signature và arguments
            return joinPoint.getSignature().toShortString() + ":" + Arrays.toString(joinPoint.getArgs());
        }
        
        // Sử dụng SpEL expression
        try {
            EvaluationContext context = new StandardEvaluationContext();
            String[] paramNames = getParameterNames(joinPoint);
            Object[] args = joinPoint.getArgs();
            
            for (int i = 0; i < paramNames.length && i < args.length; i++) {
                context.setVariable(paramNames[i], args[i]);
            }
            
            Expression expression = expressionParser.parseExpression(keyExpression);
            return expression.getValue(context, String.class);
        } catch (Exception e) {
            log.warn("Failed to parse key expression: {}, using default key", keyExpression, e);
            return joinPoint.getSignature().toShortString() + ":" + Arrays.toString(joinPoint.getArgs());
        }
    }

    /**
     * Lấy tên parameters (đơn giản hóa)
     */
    private String[] getParameterNames(ProceedingJoinPoint joinPoint) {
        String[] paramNames = new String[joinPoint.getArgs().length];
        for (int i = 0; i < paramNames.length; i++) {
            paramNames[i] = "arg" + i;
        }
        return paramNames;
    }
} 