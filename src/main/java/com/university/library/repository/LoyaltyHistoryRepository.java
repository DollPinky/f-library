package com.university.library.repository;


import com.university.library.entity.LoyaltyHistory;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface LoyaltyHistoryRepository extends JpaRepository<LoyaltyHistory, UUID>, JpaSpecificationExecutor<LoyaltyHistory> {
    @Modifying
    @Transactional
    @Query("DELETE FROM LoyaltyHistory lh WHERE lh.createdAt < :time")
    int deleteByCreatedAtBefore(@Param("time") LocalDateTime time);

    @Query(value = """
                SELECT 
                    lh.user_id,
                    u.email,
                    u.full_name,
                    SUM(lh.loyalty_point) AS total_points,
                    SUM(CASE WHEN lh.action = 'BORROWED' THEN 1 ELSE 0 END) AS borrow_count,
                    SUM(CASE WHEN lh.action = 'RETURNED' THEN 1 ELSE 0 END) AS return_count,
                    SUM(CASE WHEN lh.action = 'DONATE_BOOK' THEN 1 ELSE 0 END) AS donation_count
                FROM loyalty_history lh
                JOIN accounts u ON lh.user_id = u.user_id
                WHERE lh.loyalty_point >= 0
                  AND EXTRACT(MONTH FROM lh.created_at) = :month
                  AND EXTRACT(YEAR FROM lh.created_at) = :year
                GROUP BY lh.user_id, u.email, u.full_name
                ORDER BY total_points DESC
                LIMIT 5
            """, nativeQuery = true)
    List<Object[]> findTopUsersByMonth(@Param("month") int month,
                                       @Param("year") int year);


}
