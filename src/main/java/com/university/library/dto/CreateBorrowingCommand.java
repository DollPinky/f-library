package com.university.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.university.library.config.UUIDDeserializer;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBorrowingCommand {
    
    @NotNull(message = "ID bản sách không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID bookCopyId;
    
    @NotNull(message = "ID người mượn không được để trống")
    @JsonDeserialize(using = UUIDDeserializer.class)
    private UUID borrowerId;
    
    @NotNull(message = "Ngày mượn không được để trống")
    private Instant borrowedDate;
    
    @NotNull(message = "Ngày hẹn trả không được để trống")
    private Instant dueDate;
    
    private String notes;
    
    // For reservation
    private boolean isReservation = false;
    
    // For bulk operations
    private Integer quantity = 1;
} 