package com.university.library.dto.response.campus;

import com.university.library.entity.Campus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampusResponse {
    private UUID campusId;
    private String name;
    private String code;
    private String address;

    public static CampusResponse fromEntity(Campus campus) {
        if (campus == null) return null;
        return CampusResponse.builder()
                .campusId(campus.getCampusId())
                .name(campus.getName())
                .code(campus.getCode())
                .address(campus.getAddress())
                .build();
    }
} 

