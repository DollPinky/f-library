package com.university.library.dto.request.bookCopy;

import java.util.UUID;

import com.university.library.config.UUIDDeserializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

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

    
    @Size(max = 100, message = "Vị trí kệ không được vượt quá 100 ký tự")
    private String shelfLocation;
    
    private BookStatus status = BookStatus.AVAILABLE;
    
    public enum BookStatus {
        AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED
    }
} 

