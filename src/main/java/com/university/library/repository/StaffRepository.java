package com.university.library.repository;

import com.university.library.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {


    /**
     * Tìm nhân viên theo employee ID
     */
    Optional<Staff> findByEmployeeId(String employeeId);
}
