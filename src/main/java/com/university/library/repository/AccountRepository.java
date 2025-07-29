package com.university.library.repository;

import com.university.library.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    @Query("SELECT CASE " +
            "WHEN COUNT(CASE WHEN a.username = :username THEN 1 END) > 0 THEN 'USERNAME_EXISTS' " +
            "WHEN COUNT(CASE WHEN a.email = :email THEN 1 END) > 0 THEN 'EMAIL_EXISTS' " +
            "WHEN COUNT(CASE WHEN a.phone = :phone THEN 1 END) > 0 THEN 'PHONE_EXISTS' " +
            "ELSE 'VALID' END " +
            "FROM Account a WHERE a.username = :username OR a.email = :email OR a.phone = :phone")
    String validateAccountUniqueness(@Param("username") String username,
                                     @Param("email") String email,
                                     @Param("phone") String phone);
  Optional<Account> findByEmail(String email);
  Optional<Account> findByEmployeeCode(String employeeCode);
  boolean existsByEmail(String email);
  boolean existsByEmployeeCode(String employeeCode);

    Account findByAccountId(UUID accountId);
}

