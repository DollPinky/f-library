package com.university.library.repository;

import com.university.library.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampusRepository extends JpaRepository<Campus, UUID> {
    @Query("SELECT c FROM Campus c WHERE c.campusId = :campusId")
    Optional<Campus> findByCampusId(@Param("campusId") UUID campusId);
}

