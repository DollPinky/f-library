package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;


@Table(name = "book_donation")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BookDonation{
    @Id
    @Column(name = "book_donation_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bookDonation;

    @Column(name = "title")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_Id")
    private User donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="book_copy_id")
    private BookCopy bookCopy;

    @Column(name = "donation_at")
    private LocalDateTime donationAt;

}
