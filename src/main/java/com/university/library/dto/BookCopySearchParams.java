package com.university.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tham số tìm kiếm bản sao sách")
public class BookCopySearchParams {
    
    @Schema(description = "Từ khóa tìm kiếm (QR code, shelf location, book title, library name)", example = "QR-123")
    private String query;
    
    @Schema(description = "ID sách (optional)", example = "2249b745-ebf4-400f-a63f-6a1752c15e39")
    private UUID bookId;
    
    @Schema(description = "ID thư viện (optional)", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID libraryId;
    
    @Schema(description = "Trạng thái bản sao sách (optional)", example = "AVAILABLE", allowableValues = {"AVAILABLE", "BORROWED", "RESERVED", "LOST", "DAMAGED"})
    @Pattern(regexp = "^(AVAILABLE|BORROWED|RESERVED|LOST|DAMAGED)?$", 
             message = "Status phải là một trong các giá trị: AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED")
    private String status;
    
    @Schema(description = "Chỉ lấy bản sao có thể mượn", example = "true")
    private Boolean availableOnly;
    
    @Schema(description = "Chỉ lấy bản sao đã mượn", example = "true")
    private Boolean borrowedOnly;
    
    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0", defaultValue = "0")
    @Min(value = 0, message = "Page phải >= 0")
    private Integer page = 0;
    
    @Schema(description = "Kích thước trang", example = "20", defaultValue = "20")
    @Min(value = 1, message = "Size phải >= 1")
    private Integer size = 20;
    
    @Schema(description = "Sắp xếp theo trường", example = "createdAt", defaultValue = "createdAt", allowableValues = {"qrCode", "status", "shelfLocation", "createdAt", "updatedAt"})
    @Pattern(regexp = "^(qrCode|status|shelfLocation|createdAt|updatedAt)?$", 
             message = "SortBy phải là một trong các giá trị: qrCode, status, shelfLocation, createdAt, updatedAt")
    private String sortBy = "createdAt";
    
    @Schema(description = "Thứ tự sắp xếp", example = "DESC", defaultValue = "DESC", allowableValues = {"ASC", "DESC"})
    @Pattern(regexp = "^(ASC|DESC)$", message = "SortDirection phải là ASC hoặc DESC")
    private String sortDirection = "DESC";

    public enum SortDirection {
        ASC("ASC"), DESC("DESC");

        private final String value;

        SortDirection(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
} 