package com.university.library.dto.request.borrowing;

import lombok.Data;

import java.util.UUID;


@Data
public class BorrowRequest {
    private UUID bookCopyId;
    private String companyAccount;
}