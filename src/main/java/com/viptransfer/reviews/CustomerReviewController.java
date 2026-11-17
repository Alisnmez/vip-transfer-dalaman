package com.viptransfer.reviews;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
public class CustomerReviewController {
    private final CustomerReviewRepository repository;

    public CustomerReviewController(CustomerReviewRepository repository) {
        this.repository = repository;
    }

    public record ReviewSubmission(
        @NotBlank @Size(max = 80) String name,
        @Min(1) @Max(5) int rating,
        @NotBlank @Size(min = 10, max = 1500) String comment,
        @AssertTrue boolean publicationConsent
    ) {}

    public record PublicReview(Long id, String name, int rating, String comment) {
        static PublicReview from(CustomerReview review) {
            return new PublicReview(review.id, review.customerName, review.rating, review.comment);
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, String> submit(@Valid @RequestBody ReviewSubmission request) {
        CustomerReview review = new CustomerReview();
        review.customerName = request.name().trim();
        review.rating = request.rating();
        review.comment = request.comment().trim();
        repository.save(review);
        return Map.of("message", "Your review was submitted for approval.");
    }

    @GetMapping
    public List<PublicReview> published() {
        return repository.findByStatusOrderByCreatedAtDesc("APPROVED").stream().map(PublicReview::from).toList();
    }

    @GetMapping("/moderation")
    public List<CustomerReview> pending() {
        return repository.findByStatusOrderByCreatedAtDesc("PENDING");
    }

    @PatchMapping("/{id}/moderation")
    public Map<String, String> moderate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (!"APPROVED".equals(status) && !"REJECTED".equals(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid moderation status.");
        }
        CustomerReview review = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found."));
        if (!"PENDING".equals(review.status)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Review already moderated.");
        }
        review.status = status;
        repository.save(review);
        return Map.of("status", status);
    }
}
