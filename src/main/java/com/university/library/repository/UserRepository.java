package com.university.library.repository;

import com.university.library.entity.User;
import com.university.library.entity.User.AccountRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail( String email);

    boolean existsByCompanyAccount( String employeeCode);
    Optional<User> findByEmail(String username);


    long countByIsActive(Boolean isActive);
}

