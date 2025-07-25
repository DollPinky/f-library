package com.university.library.mapper;

import com.university.library.dto.StaffResponse;
import com.university.library.entity.Staff;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    StaffResponse toStaffResponse(Staff staff);
}
