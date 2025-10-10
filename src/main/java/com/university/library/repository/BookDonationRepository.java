package com.university.library.repository;


import com.university.library.entity.BookDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookDonationRepository extends JpaRepository<BookDonation, Integer>
{

}
