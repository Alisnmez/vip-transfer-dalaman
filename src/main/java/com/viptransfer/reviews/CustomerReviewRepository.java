package com.viptransfer.reviews;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Long> {
    Page<CustomerReview> findByStatus(String status, Pageable pageable);
}
