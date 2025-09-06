package com.university.library.specification;

import com.university.library.dto.request.book.BookSearchParams;
import com.university.library.entity.Book;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BookSpecification {

    public static Specification<Book> withSearchParams(BookSearchParams params) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by query (title, author, publisher)
            if (StringUtils.hasText(params.getQuery())) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")), searchTerm);
                Predicate authorPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("author")), searchTerm);
                Predicate publisherPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("publisher")), searchTerm);
                predicates.add(criteriaBuilder.or(
                        titlePredicate, authorPredicate, publisherPredicate));
            }

            // Filter by category
            if (params.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("category").get("categoryId"), params.getCategoryId()));
            }

            // Filter by status (through book copies)
            if (StringUtils.hasText(params.getStatus())) {
                var bookCopyJoin = root.join("bookCopies", JoinType.LEFT);
                predicates.add(criteriaBuilder.equal(
                        bookCopyJoin.get("status").as(String.class), params.getStatus()));

                // Ensure distinct results when joining
                query.distinct(true);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}