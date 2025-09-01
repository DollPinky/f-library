package com.university.library.dto.response.library;

import com.university.library.entity.Library;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryResponse {
    private UUID libraryId;
    private String name;
    private String code;
    private String address;
    private CampusResponse campus;
    private Long bookCopyCount;
    private Long staffCount;
    private Instant createdAt;
    private Instant updatedAt;

    public static LibraryResponse fromEntity(Library library) {
        if (library == null) {
            return null;
        }

        return LibraryResponse.builder()
                .libraryId(library.getLibraryId())
                .name(library.getName())
                .code(library.getCode())
                .address(library.getAddress())
                .campus(CampusResponse.fromEntity(library.getCampus()))
                .bookCopyCount(library.getBookCopies() != null ? (long) library.getBookCopies().size() : 0L)
                .staffCount(library.getStaff() != null ? (long) library.getStaff().size() : 0L)
                .createdAt(library.getCreatedAt())
                .updatedAt(library.getUpdatedAt())
                .build();
    }

    public static LibraryResponse fromEntitySimple(Library library) {
        if (library == null) {
            return null;
        }

        return LibraryResponse.builder()
                .libraryId(library.getLibraryId())
                .name(library.getName())
                .code(library.getCode())
                .address(library.getAddress())
                .campus(CampusResponse.fromEntitySimple(library.getCampus()))
                .createdAt(library.getCreatedAt())
                .updatedAt(library.getUpdatedAt())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CampusResponse {
        private UUID campusId;
        private String name;
        private String code;
        private String address;

        public static CampusResponse fromEntity(com.university.library.entity.Campus campus) {
            if (campus == null) {
                return null;
            }

            return CampusResponse.builder()
                    .campusId(campus.getCampusId())
                    .name(campus.getName())
                    .code(campus.getCode())
                    .address(campus.getAddress())
                    .build();
        }

        public static CampusResponse fromEntitySimple(com.university.library.entity.Campus campus) {
            if (campus == null) {
                return null;
            }

            return CampusResponse.builder()
                    .campusId(campus.getCampusId())
                    .name(campus.getName())
                    .code(campus.getCode())
                    .build();
        }
    }
} 

