package com.university.library.dto.request.library;

import java.util.UUID;

import com.university.library.config.UUIDDeserializer;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLibraryCommand {
    
    @NotBlank(message = "Tên thư viện không được để trống")
    @Size(min = 1, max = 255, message = "Tên thư viện phải từ 1 đến 255 ký tự")
    private String name;
    
    @NotBlank(message = "Mã thư viện không được để trống")
    @Size(min = 1, max = 50, message = "Mã thư viện phải từ 1 đến 50 ký tự")
    private String code;
    
    @NotBlank(message = "Địa chỉ thư viện không được để trống")
    @Size(max = 1000, message = "Địa chỉ thư viện không được vượt quá 1000 ký tự")
    private String address;
    
    @NotNull(message = "Cơ sở không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID campusId;
} 

