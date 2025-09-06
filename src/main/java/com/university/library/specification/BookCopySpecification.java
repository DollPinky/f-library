package com.university.library.specification;

import com.university.library.dto.request.bookCopy.BookCopySearchParams;
import com.university.library.entity.BookCopy;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class BookCopySpecification {

    public static Specification<BookCopy> withSearchParams(BookCopySearchParams params) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by query (shelf location, book title, library name)
            if (StringUtils.hasText(params.getQuery())) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";

                Predicate shelfPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("shelfLocation")), searchTerm);

                Predicate titlePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.join("book", JoinType.LEFT).get("title")), searchTerm);

                Predicate libraryPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.join("campus", JoinType.LEFT).get("name")), searchTerm);

                predicates.add(criteriaBuilder.or(
                        shelfPredicate, titlePredicate, libraryPredicate));
            }

            // Filter by book
            if (params.getBookId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("book").get("bookId"), params.getBookId()));
            }

            // Filter by campus
            if (params.getCampusId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("campus").get("campusId"), params.getCampusId()));
            }

            // Filter by status
            if (StringUtils.hasText(params.getStatus())) {
                predicates.add(criteriaBuilder.equal(
                        root.get("status").as(String.class), params.getStatus()));
            }

            // Filter available only
            if (Boolean.TRUE.equals(params.getAvailableOnly())) {
                predicates.add(criteriaBuilder.equal(
                        root.get("status").as(String.class), "AVAILABLE"));
            }

            // Filter borrowed only
            if (Boolean.TRUE.equals(params.getBorrowedOnly())) {
                predicates.add(criteriaBuilder.equal(
                        root.get("status").as(String.class), "BORROWED"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}