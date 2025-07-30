package com.university.library.repository;

import com.university.library.entity.ChatHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, UUID> {
    @Query("SELECT ch.prompt FROM ChatHistory ch WHERE ch.account.accountId = :accountId AND ch.response IS NOT NULL ORDER BY ch.createdAt DESC LIMIT 10")
    List<String> findTop5Prompts(@Param("accountId") UUID accountId);

}
