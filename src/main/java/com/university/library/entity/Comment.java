package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    @Column(name = "commentId")
    private UUID commentId;
    @Column(name = "content")
    private String content;
    @Column(name = "star")
    private int star;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_Id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    private Book book;
}
