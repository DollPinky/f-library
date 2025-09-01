package com.university.library.dto.request.category;

import java.util.UUID;

import com.university.library.config.UUIDDeserializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryCommand {
    
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 1, max = 255, message = "Tên danh mục phải từ 1 đến 255 ký tự")
    private String name;
    
    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;
    
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Màu sắc phải là mã hex hợp lệ (ví dụ: #5a735a)")
    private String color = "#5a735a";
    
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID parentCategoryId;
} 

