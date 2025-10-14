package com.university.library.specification;

import com.university.library.dto.request.category.CategorySearchParams;
import com.university.library.entity.Category;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CategorySpecification {

    public static Specification<Category> withSearchParams(CategorySearchParams params) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by query (name or description)
            if (StringUtils.hasText(params.getQuery())) {
                String searchTerm = "%" + params.getQuery().toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")), searchTerm);
                Predicate descPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")), searchTerm);
                predicates.add(criteriaBuilder.or(namePredicate, descPredicate));
            }

            // Filter by parent category
            if (params.getParentCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("parentCategory").get("categoryId"), params.getParentCategoryId()));
            }

            // Filter root categories only
            if (Boolean.TRUE.equals(params.getRootOnly())) {
                predicates.add(criteriaBuilder.isNull(root.get("parentCategory")));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}