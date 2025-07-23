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
@Schema(description = "Tham số tìm kiếm danh mục")
public class CategorySearchParams {
    
    @Schema(description = "Từ khóa tìm kiếm (name, description)", example = "Technology")
    private String query;
    
    @Schema(description = "ID danh mục cha (optional)", example = "2249b745-ebf4-400f-a63f-6a1752c15e39")
    private UUID parentCategoryId;
    
    @Schema(description = "Chỉ lấy danh mục gốc (không có parent)", example = "true")
    private Boolean rootOnly;
    
    @Schema(description = "Chỉ lấy danh mục có sách", example = "true")
    private Boolean hasBooks;
    
    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0", defaultValue = "0")
    @Min(value = 0, message = "Page phải >= 0")
    private Integer page = 0;
    
    @Schema(description = "Kích thước trang", example = "20", defaultValue = "20")
    @Min(value = 1, message = "Size phải >= 1")
    private Integer size = 20;
    
    @Schema(description = "Sắp xếp theo trường", example = "name", defaultValue = "name", allowableValues = {"name", "description", "bookCount", "createdAt", "updatedAt"})
    @Pattern(regexp = "^(name|description|bookCount|createdAt|updatedAt)?$", 
             message = "SortBy phải là một trong các giá trị: name, description, bookCount, createdAt, updatedAt")
    private String sortBy = "name";
    
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