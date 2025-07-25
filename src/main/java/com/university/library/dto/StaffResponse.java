package com.university.library.dto;

import com.university.library.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponse {
    private UUID staffId;
    private String fullName;
    private String employeeId;
    private Staff.StaffRole role;


    public static StaffResponse fromEntity(Staff staff) {
        if (staff == null) {
            return null;
        }

        return StaffResponse.builder()
                .staffId(staff.getStaffId())
                .fullName(staff.getAccount().getFullName())
                .employeeId(staff.getEmployeeId())
                .role(staff.getStaffRole())
                .build();
    }


}
