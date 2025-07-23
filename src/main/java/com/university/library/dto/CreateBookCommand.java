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
    
    @NotBlank(message = "ISBN không được để trống")
    private String isbn;
    
    @NotBlank(message = "Nhà xuất bản không được để trống")
    private String publisher;
    
    @NotNull(message = "Năm xuất bản không được để trống")
    @Positive(message = "Năm xuất bản phải là số dương")
    private Integer publishYear;
    
    @NotNull(message = "Danh mục không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID categoryId;
    
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
        
        @NotBlank(message = "Vị trí không được để trống")
        private String location;
    }
} 