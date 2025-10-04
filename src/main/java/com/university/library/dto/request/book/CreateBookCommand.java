package com.university.library.dto.request.book;

import java.util.UUID;

import com.university.library.config.UUIDDeserializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookCommand {
    
    @NotBlank(message = "Tên sách không được để trống")
    private String title;
    
    @NotBlank(message = "Tác giả không được để trống")
    private String author;
    

    private String publisher;
    
    @Positive(message = "Năm xuất bản phải là số dương")
    private Integer publishYear;
    
    @NotNull(message = "Danh mục không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID categoryId;
    
    private String description;

    private  String bookCover;

} 

