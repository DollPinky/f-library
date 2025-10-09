package com.university.library.entity;

import com.university.library.base.BaseEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.Builder;

@Entity
@Table(name = "books")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Book extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "book_id")
    private UUID bookId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "language")
    @Builder.Default
    private String language = "Vietnamese";

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "year")
    private Integer year;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String bookCover;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookCopy> bookCopies = new ArrayList<>();
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();
}