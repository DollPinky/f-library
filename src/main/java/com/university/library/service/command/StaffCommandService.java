package com.university.library.service.command;

import com.university.library.constants.LibraryConstants;
import com.university.library.constants.MessageConstants;
import com.university.library.dto.RegisterRequest;
import com.university.library.dto.RegisterStaffRequest;
import com.university.library.dto.StaffResponse;
import com.university.library.entity.Account;
import com.university.library.entity.Campus;
import com.university.library.entity.Library;
import com.university.library.entity.Staff;
import com.university.library.repository.AccountRepository;
import com.university.library.repository.CampusRepository;
import com.university.library.repository.LibraryRepository;
import com.university.library.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffCommandService {

    private final CampusRepository campusRepository;
    private final LibraryRepository libraryRepository;
    private final AccountRepository accountRepository;
    private final StaffRepository staffRepository;

    public StaffResponse createStaff(RegisterStaffRequest request) {
        Campus campus = campusRepository.findById(request.getCampusId())
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_CAMPUS_NOT_FOUND + request.getCampusId()));
        log.info("Registering staff with username: {}", request.getUsername());

        Library library = libraryRepository.findById(request.getLibraryId())
                .orElseThrow(() -> new RuntimeException(LibraryConstants.ERROR_LIBRARY_NOT_FOUND + request.getLibraryId()));
        log.info("Registering staff with library: {}", library.getName());

        Account account = Account.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(request.getPassword())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .userType(Account.UserType.STAFF)
                .status(Account.AccountStatus.ACTIVE)
                .createdAt(Instant.now())
                .campus(campus)
                .library(library)
                .emailVerified(false)
                .phoneVerified(false)
                .build();
        log.info("Account created successfully with id: {}", account.getAccountId());
        accountRepository.save(account);

        Staff.StaffRole role = Staff.StaffRole.valueOf(request.getStaffRole());

        Staff staff = Staff.builder()
                .staffId(UUID.randomUUID())
                .employeeId(generateEmployeeId())
                .account(account)
                .staffRole(role)
                .createdAt(Instant.now())
                .library(library)
                .isActive(true)
                .build();

        log.info("Staff created successfully with id: {}", staff.getStaffId());
        assignPermissionsByRole(staff,role);
        log.info("Permissions assigned successfully for staff with id: {}", staff.getStaffId());
        staffRepository.save(staff);

        return StaffResponse.fromEntity(staff);
    }

    private void assignPermissionsByRole(Staff staff, Staff.StaffRole role) {
        switch (role) {
            case ADMIN -> {
                staff.setCanManageBooks(true);
                staff.setCanManageUsers(true);
                staff.setCanManageStaff(true);
                staff.setCanViewReports(true);
                staff.setCanProcessBorrowings(true);
            }
            case LIBRARIAN -> {
                staff.setCanManageBooks(true);
                staff.setCanProcessBorrowings(true);
            }
            case MANAGER -> {
                staff.setCanManageStaff(true);
                staff.setCanViewReports(true);
            }
            case ASSISTANT -> {
                staff.setCanProcessBorrowings(true);
            }
        }
    }

    private String generateEmployeeId() {
        return "EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public void deleteStaff(String employeeId) {
        Staff staff = staffRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException(MessageConstants.ERROR_STAFF_NOT_FOUND + employeeId));
        staff.setIsDeleted(false);
        staff.setIsActive(false);
        staff.setCanManageBooks(false);
        staff.setCanManageUsers(false);
        staff.setCanManageStaff(false);
        staff.setCanViewReports(false);
        staff.setCanProcessBorrowings(false);
        staff.setUpdatedAt(Instant.now());
        Account account =  accountRepository.findByAccountId(staff.getAccount().getAccountId());

        if(account == null) {
          throw new RuntimeException(MessageConstants.ERROR_ACCOUNT_NOT_FOUND + staff.getAccount().getAccountId());
        }
        staffRepository.save(staff);
        account.setStatus(Account.AccountStatus.INACTIVE);
        account.setUpdatedAt(Instant.now());
        accountRepository.save(account);

    }
}
