package com.university.library.service;

import com.university.library.base.PagedResponse;
import com.university.library.dto.AccountResponse;
import com.university.library.dto.RegisterStaffRequest;
import com.university.library.dto.StaffResponse;
import com.university.library.service.command.StaffCommandService;
import com.university.library.service.query.StaffQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffFacade {
    private final StaffCommandService staffCommandService;
    private final StaffQueryService staffQueryService;

    /**
     * Tạo nhân viên mới
     * @param request
     * @return
     */
    public StaffResponse createStaff(RegisterStaffRequest request) {
        return staffCommandService.createStaff(request);
    }

    /**
     * xóa nhân viên
     */
    public void deleteStaff(String employeeId) {
        staffCommandService.deleteStaff(employeeId);
    }


    /**
     * lấy tat ca nhân viên trong hệ thống
     */
    public PagedResponse<StaffResponse> getAllStaffs(int page, int size){
        return staffQueryService.getAllStaffs(page, size);
    }
}
