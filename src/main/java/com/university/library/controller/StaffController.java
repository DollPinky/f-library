package com.university.library.controller;

import com.university.library.base.PagedResponse;
import com.university.library.base.StandardResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.RegisterStaffRequest;
import com.university.library.dto.StaffResponse;
import com.university.library.service.StaffFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.university.library.constants.EndpointConstants.STAFF_ENDPOINT;

@RestController
@RequestMapping(STAFF_ENDPOINT)
@RequiredArgsConstructor
@Slf4j
public class StaffController {

    private final StaffFacade staffFacade;

    @GetMapping
    public ResponseEntity<StandardResponse<PagedResponse<StaffResponse>>>
    getAllStaffs(@RequestParam(defaultValue = "0") int page,
                   @RequestParam(defaultValue = "10") int size) {
        log.info("GET /api/v1/staffs");

        try {
            PagedResponse<StaffResponse> staffs = staffFacade.getAllStaffs(page, size);
            StandardResponse<PagedResponse<StaffResponse>> response = StandardResponse.success(
                    "Lấy danh sách tài khoản thành công", staffs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting accounts: ", e);
            StandardResponse<PagedResponse<StaffResponse>> response = StandardResponse.error(
                    "Không thể lấy danh sách tài khoản: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * API tạo nhân viên thư viện mới (kèm Account)
     */
    @Operation(
            summary = "Tạo nhân viên thư viện",
            description = "API này tạo mới một nhân viên thư viện và tài khoản tương ứng"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tạo nhân viên thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "500", description = "Lỗi máy chủ")
    })
    @PostMapping("/register")
    public ResponseEntity<StandardResponse<StaffResponse>> registerStaff(
            @Valid @RequestBody RegisterStaffRequest request) {
        log.info("POST /api/v1/staffs/register");

        try {
            StaffResponse created = staffFacade.createStaff(request);
            return ResponseEntity.ok(StandardResponse.success("Tạo nhân viên thành công", created));
        } catch (Exception e) {
            log.error("Lỗi tạo nhân viên: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể tạo nhân viên: " + e.getMessage()));
        }
    }

    @Operation(
            summary = "Xóa nhân viên",
            description = "Xóa nhân viên theo mã employeeId"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xóa nhân viên thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy nhân viên"),
            @ApiResponse(responseCode = "500", description = "Lỗi máy chủ")
    })
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<StandardResponse<Void>> deleteStaff(@PathVariable String employeeId) {
        log.info("DELETE /api/v1/staffs/{}", employeeId);

        try {
            staffFacade.deleteStaff(employeeId);
            return ResponseEntity.ok(StandardResponse.success("Xóa nhân viên thành công"));
        } catch (IllegalArgumentException e) {
            log.warn("Không tìm thấy nhân viên: {}", employeeId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(StandardResponse.error("Không tìm thấy nhân viên với mã: " + employeeId));
        } catch (Exception e) {
            log.error("Lỗi khi xóa nhân viên: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(StandardResponse.error("Không thể xóa nhân viên: " + e.getMessage()));
        }
    }

}
