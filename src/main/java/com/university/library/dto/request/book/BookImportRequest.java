package com.university.library.dto.request.book;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BookImportRequest {
    private MultipartFile file;
}