package com.university.library.repository;

import com.university.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {
    @Query("SELECT b FROM Book b WHERE b.title = :title AND b.author = :author AND b.publisher = :publisher AND (:year is null AND b.year is null OR b.year = :year)")
    Optional<Book> findByTitleAndAuthorAndPublisherAndYear(@Param("title") String title, @Param("author") String author, @Param("publisher") String publisher, @Param("year") Integer year);
} 

