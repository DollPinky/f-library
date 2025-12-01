package com.university.library.dto.request.borrowing;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;


@Data
public class BorrowRequest {
    private UUID bookCopyId;
    @JsonProperty("companyAccount")
    private String companyAccount;
    public UUID getBookCopyId() { return bookCopyId; }
    public void setBookCopyId(UUID bookCopyId) { this.bookCopyId = bookCopyId; }

    public String getCompanyAccount() { return companyAccount; }
    public void setCompanyAccount(String companyAccount) { this.companyAccount = companyAccount; }
}