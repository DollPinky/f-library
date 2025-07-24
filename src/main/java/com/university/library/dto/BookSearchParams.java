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
@Schema(description = "Tham số tìm kiếm sách")
public class BookSearchParams {
    
    @Schema(description = "Từ khóa tìm kiếm (title, author, isbn, publisher)", example = "Novak and Sons")
    private String query;
    
    @Schema(description = "ID danh mục (optional)", example = "2249b745-ebf4-400f-a63f-6a1752c15e39")
    private UUID categoryId;
    
    @Schema(description = "ID thư viện (optional - nếu không có sẽ search tất cả thư viện)", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID libraryId;
    
    @Schema(description = "Trạng thái sách (optional)", example = "AVAILABLE", allowableValues = {"AVAILABLE", "BORROWED", "RESERVED", "LOST", "DAMAGED"})
    @Pattern(regexp = "^(AVAILABLE|BORROWED|RESERVED|LOST|DAMAGED)?$", 
             message = "Status phải là một trong các giá trị: AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED")
    private String status;
    
    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0", defaultValue = "0")
    @Min(value = 0, message = "Page phải >= 0")
    private Integer page = 0;
    
    @Schema(description = "Kích thước trang", example = "10", defaultValue = "10")
    @Min(value = 1, message = "Size phải >= 1")
    private Integer size = 10;
    
    @Schema(description = "Sắp xếp theo trường", example = "title", defaultValue = "title", allowableValues = {"title", "author", "publisher", "year", "isbn", "createdAt", "updatedAt"})
    @Pattern(regexp = "^(title|author|publisher|year|isbn|createdAt|updatedAt)?$", 
             message = "SortBy phải là một trong các giá trị: title, author, publisher, year, isbn, createdAt, updatedAt")
    private String sortBy = "title";
    
    @Schema(description = "Thứ tự sắp xếp", example = "ASC", defaultValue = "ASC", allowableValues = {"ASC", "DESC"})
    @Pattern(regexp = "^(ASC|DESC)$", message = "SortDirection phải là ASC hoặc DESC")
    private String sortDirection = "ASC";

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

