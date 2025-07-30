package com.university.library.repository;

import com.university.library.entity.Account;
import com.university.library.entity.Account.AccountRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
    
    @Query("SELECT a FROM Account a WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR LOWER(a.department) LIKE LOWER(CONCAT('%', :department, '%'))) AND " +
           "(:position IS NULL OR :position = '' OR LOWER(a.position) LIKE LOWER(CONCAT('%', :position, '%'))) AND " +
           "(:role IS NULL OR a.role = :role) AND " +
           "(:isActive IS NULL OR a.isActive = :isActive) AND " +
           "(:campusId IS NULL OR a.campus.campusId = :campusId)")
    Page<Account> searchAccounts(
        @Param("search") String search,
        @Param("department") String department,
        @Param("position") String position,
        @Param("role") AccountRole role,
        @Param("isActive") Boolean isActive,
        @Param("campusId") UUID campusId,
        Pageable pageable
    );
}

