package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.constants.CampusConstants;
import com.university.library.dto.CampusResponse;
import com.university.library.entity.Campus;
import com.university.library.service.CampusFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping(CampusConstants.API_BASE_PATH)
@RequiredArgsConstructor
@Tag(name = "Campus Management", description = "APIs for managing campuses in the library system")
public class CampusController {

    private final CampusFacade campusFacade;

    @GetMapping("/all")
    @Operation(summary = "Get all campuses", description = "Retrieve all campuses")
    public ResponseEntity<StandardResponse<List<CampusResponse>>> getAllCampuses() {
        log.info(CampusConstants.API_GET_ALL);
        try {
            List<Campus> campuses = campusFacade.getAllCampuses();
            List<CampusResponse> response = campuses.stream().map(CampusResponse::fromEntity).collect(Collectors.toList());
            return ResponseEntity.ok(StandardResponse.success(CampusConstants.SUCCESS_GET_ALL, response));
        } catch (Exception e) {
            log.error(CampusConstants.ERROR_GET_ALL, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(CampusConstants.ERROR_GET_ALL));
        }
    }

    @GetMapping("/{campusId}")
    @Operation(summary = "Get campus by ID", description = "Retrieve a specific campus by its ID")
    public ResponseEntity<StandardResponse<CampusResponse>> getCampusById(
            @Parameter(description = "Campus ID") @PathVariable UUID campusId) {
        log.info(CampusConstants.API_GET_CAMPUS, campusId);
        try {
            Campus campus = campusFacade.getCampusById(campusId);
            if (campus == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(StandardResponse.error(CampusConstants.ERROR_CAMPUS_NOT_FOUND + campusId));
            }
            CampusResponse response = CampusResponse.fromEntity(campus);
            return ResponseEntity.ok(StandardResponse.success(CampusConstants.SUCCESS_GET_CAMPUS, response));
        } catch (Exception e) {
            log.error(CampusConstants.ERROR_GET_CAMPUS, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error(CampusConstants.ERROR_GET_CAMPUS));
        }
    }
} 