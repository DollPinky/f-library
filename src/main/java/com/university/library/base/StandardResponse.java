package com.university.library.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StandardResponse<T> {
    
    @Builder.Default
    private boolean success = true;
    
    @Builder.Default
    private String message = "Thành công";
    
    private T data;
    
    @Builder.Default
    private Instant timestamp = Instant.now();
    
    private String errorCode;

    
    public static <T> StandardResponse<T> success(String message, T data) {
        return StandardResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }
    
    public static <T> StandardResponse<T> error(String message) {
        return StandardResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(Instant.now())
                .build();
    }
    
    public static <T> StandardResponse<T> error(String message, String errorCode) {
        return StandardResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .timestamp(Instant.now())
                .build();
    }
    
    public static <T> StandardResponse<T> error(String message, T data) {
        return StandardResponse.<T>builder()
                .success(false)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }
} 

