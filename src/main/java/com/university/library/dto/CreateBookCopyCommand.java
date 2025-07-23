package com.university.library.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.university.library.config.UUIDDeserializer;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookCopyCommand {
    
    @NotNull(message = "ID sách không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID bookId;
    
    @NotNull(message = "ID thư viện không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID libraryId;
    
    @NotBlank(message = "QR code không được để trống")
    @Size(max = 255, message = "QR code không được vượt quá 255 ký tự")
    private String qrCode;
    
    @Size(max = 100, message = "Vị trí kệ không được vượt quá 100 ký tự")
    private String shelfLocation;
    
    private BookStatus status = BookStatus.AVAILABLE;
    
    public enum BookStatus {
        AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED
    }
} 