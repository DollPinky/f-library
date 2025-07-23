package com.university.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tham số tìm kiếm thư viện")
public class LibrarySearchParams {
    
    private String query;
    private UUID campusId;
    private Boolean hasBookCopies;
    private Boolean hasStaff;
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "name";
    private String sortDirection = "ASC";
    
    public enum SortDirection {
        ASC, DESC;
        
        public static SortDirection fromString(String value) {
            try {
                return valueOf(value.toUpperCase());
            } catch (Exception e) {
                return ASC;
            }
        }
    }
    
    public SortDirection getSortDirectionEnum() {
        return SortDirection.fromString(sortDirection);
    }
} 