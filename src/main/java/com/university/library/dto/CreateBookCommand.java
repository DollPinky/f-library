package com.university.library.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.university.library.config.UUIDDeserializer;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookCommand {
    
    @NotBlank(message = "Tên sách không được để trống")
    private String title;
    
    @NotBlank(message = "Tác giả không được để trống")
    private String author;
    
    private String isbn;
    
    private String publisher;
    
    @Positive(message = "Năm xuất bản phải là số dương")
    private Integer publishYear;
    
    @NotNull(message = "Danh mục không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID categoryId;
    
    private String description;
    
    private List<BookCopyInfo> copies;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookCopyInfo {
        @JsonDeserialize(using = UUIDDeserializer.class)
        private UUID libraryId;
        
        @Positive(message = "Số lượng phải là số dương")
        private Integer quantity;
        
        private String location;
        
        public boolean isValid() {
            if (libraryId != null && quantity != null) {
                return quantity > 0;
            }
            return true; 
        }
    }
} 

