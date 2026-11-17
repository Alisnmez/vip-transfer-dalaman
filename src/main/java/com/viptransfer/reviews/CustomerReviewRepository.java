package com.viptransfer.reviews;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Long> {
    List<CustomerReview> findByStatusOrderByCreatedAtDesc(String status);
}
