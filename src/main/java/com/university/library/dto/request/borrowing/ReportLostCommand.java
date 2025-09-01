package com.university.library.dto.request.borrowing;

import lombok.Data;

import java.util.UUID;

@Data
public class ReportLostCommand {
    private UUID qrCode;
}
