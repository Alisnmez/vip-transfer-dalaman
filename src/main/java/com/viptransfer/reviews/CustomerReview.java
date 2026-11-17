package com.viptransfer.reviews;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "customer_reviews")
public class CustomerReview {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false, length = 80)
    public String customerName;
    @Column(nullable = false)
    public int rating;
    @Column(nullable = false, length = 1500)
    public String comment;
    @Column(nullable = false, length = 16)
    public String status = "PENDING";
    @Column(nullable = false)
    public Instant createdAt = Instant.now();
}
