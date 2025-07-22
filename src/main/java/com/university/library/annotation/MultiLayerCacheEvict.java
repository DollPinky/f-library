package com.university.library.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation để xóa multi-layer cache (Caffeine + Redis)
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MultiLayerCacheEvict {
    
    /**
     * Tên cache cần xóa
     */
    String[] value() default {};
    
    /**
     * Key cụ thể cần xóa (SpEL expression)
     */
    String key() default "";
    
    /**
     * Có xóa tất cả entries trong cache hay không
     */
    boolean allEntries() default false;
    
    /**
     * Có xóa cache trước khi method được thực thi hay không
     */
    boolean beforeInvocation() default false;
    
    /**
     * Có xóa Redis cache hay không
     */
    boolean evictRedis() default true;
    
    /**
     * Có xóa Caffeine cache hay không
     */
    boolean evictCaffeine() default true;
} 