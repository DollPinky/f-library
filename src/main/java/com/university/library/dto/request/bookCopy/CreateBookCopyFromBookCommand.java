package com.university.library.dto.request.bookCopy;

import java.util.UUID;

import com.university.library.config.UUIDDeserializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

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

        private UUID BookCopyId;

        @NotNull(message = "Thư viện không được để trống")
        @JsonDeserialize(using = UUIDDeserializer.class)
        private UUID campusId;
        private String location;
    }
} 

