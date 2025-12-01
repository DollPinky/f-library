package com.university.library.dto.response.book;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookImportResponse {
    private int totalRecords;
    private int successCount;
    private int errorCount;
    private List<ImportError> errors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportError {
        private int rowNumber;
        private String errorMessage;
    }
}