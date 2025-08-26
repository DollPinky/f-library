package com.university.library.entity;

import io.hypersistence.utils.hibernate.type.array.FloatArrayType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;


import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_history")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "chat_history_id")
    private UUID chatHistoryId;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String response;

    @Type(FloatArrayType.class)
    @Column(columnDefinition = "vector(1024)")
    private float[] embedding;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User account;

    private LocalDateTime createdAt;
}
