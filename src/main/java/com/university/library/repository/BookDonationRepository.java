package com.university.library.repository;


import com.university.library.entity.BookDonation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookDonationRepository extends JpaRepository<BookDonation, UUID>, JpaSpecificationExecutor<BookDonation>
{

    Page<BookDonation> findBookDonationsByDonor_UserId(UUID accountId, Pageable pageable);
}
