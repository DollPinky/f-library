package com.university.library.dto.request.borrowing;

import com.university.library.config.UUIDDeserializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.time.LocalDateTime;
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
    private LocalDateTime borrowedDate;
    
    @NotNull(message = "Ngày hẹn trả không được để trống")
    private LocalDateTime dueDate;
    
    private String notes;
    
    // For reservation
    private boolean isReservation = false;

    public boolean isReservation() {
        return isReservation;
    }

    public void setIsReservation(boolean isReservation) {
        this.isReservation = isReservation;
    }
    
    // For bulk operations
    private Integer quantity = 1;
} 