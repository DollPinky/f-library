package com.university.library.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.university.library.config.UUIDDeserializer;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookCopyFromBookCommand {
    
    @NotNull(message = "ID sách không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID bookId;
    
    private List<BookCopyInfo> copies;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookCopyInfo {
        @NotNull(message = "Thư viện không được để trống")
        @JsonDeserialize(using = UUIDDeserializer.class)
        private UUID libraryId;
        
        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải là số dương")
        private Integer quantity;
        
        private String location;
    }
} 

