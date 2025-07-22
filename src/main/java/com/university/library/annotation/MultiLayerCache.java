package com.university.library.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

/**
 * Annotation để sử dụng multi-layer caching (Caffeine + Redis)
 * Caffeine: Cache local với thời gian ngắn
 * Redis: Cache distributed với thời gian dài hơn
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MultiLayerCache {
    
    /**
     * Tên cache
     */
    String value();
    
    /**
     * Key cho cache (SpEL expression)
     */
    String key() default "";
    
    /**
     * Thời gian cache trong Caffeine (local cache)
     */
    long localTtl() default 5;
    
    /**
     * Đơn vị thời gian cho local cache
     */
    TimeUnit localTimeUnit() default TimeUnit.MINUTES;
    
    /**
     * Thời gian cache trong Redis (distributed cache)
     */
    long distributedTtl() default 30;
    
    /**
     * Đơn vị thời gian cho distributed cache
     */
    TimeUnit distributedTimeUnit() default TimeUnit.MINUTES;
    
    /**
     * Có sử dụng Redis hay không
     */
    boolean useRedis() default true;
    
    /**
     * Có sử dụng Caffeine hay không
     */
    boolean useCaffeine() default true;
} 