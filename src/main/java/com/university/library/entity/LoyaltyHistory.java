package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.util.UUID;

@Entity
@Table(name = "loyalty_history")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyHistory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "loyalty_history_id")
    private UUID loyaltyId;

    @Column(name = "loyalty_point")
    private int loyaltyPoint;

    @Column(name = "action", length = 20)
    @Enumerated(EnumType.STRING)
    private LoyaltyAction action;

    @Column(name = "note", length = 100)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;


    public enum LoyaltyAction {
        BORROWED,
        RETURNED,
        OVERDUE,
        LOST,
        COMMENT_REVIEW,
        DONATE_BOOK,
    }
}
