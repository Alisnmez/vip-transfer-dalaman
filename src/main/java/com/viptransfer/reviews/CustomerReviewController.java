package com.viptransfer.reviews;

import com.viptransfer.validation.InputFormats;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/reviews")
public class CustomerReviewController {
    private final CustomerReviewRepository repository;

    public CustomerReviewController(CustomerReviewRepository repository) {
        this.repository = repository;
    }

    public record ReviewSubmission(
        @NotBlank @Size(max = 80) @Pattern(regexp = InputFormats.PERSON_NAME) String name,
        @Min(1) @Max(5) int rating,
        @NotBlank @Size(min = 10, max = 1500) String comment,
        @AssertTrue boolean publicationConsent
    ) {}

    public record PublicReview(Long id, String name, int rating, String comment, java.time.Instant createdAt) {
        static PublicReview from(CustomerReview review) {
            return new PublicReview(review.id, review.customerName, review.rating, review.comment, review.createdAt);
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

    // Keep already-open clients working during backend/frontend rolling deploys.
    @GetMapping(params = "!page")
    public List<PublicReview> legacyPublished(@RequestParam(defaultValue = "10") int size) {
        return published(0, size).getContent();
    }

    @GetMapping(params = "page")
    public Page<PublicReview> published(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return repository.findByStatus("APPROVED", pagination(page, size)).map(PublicReview::from);
    }

    @GetMapping(value = "/moderation", params = "!page")
    public List<CustomerReview> legacyPending(@RequestParam(defaultValue = "PENDING") String status,
                                             @RequestParam(defaultValue = "10") int size) {
        return pending(status, 0, size).getContent();
    }

    @GetMapping(value = "/moderation", params = "page")
    public Page<CustomerReview> pending(@RequestParam(defaultValue = "PENDING") String status,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        if (!List.of("PENDING", "APPROVED", "REJECTED", "ARCHIVED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid review status.");
        }
        return repository.findByStatus(status, pagination(page, size));
    }

    @PatchMapping("/{id}/moderation")
    public Map<String, String> moderate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (!List.of("APPROVED", "REJECTED", "ARCHIVED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid moderation status.");
        }
        CustomerReview review = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found."));
        if (!isAllowedTransition(review.status, status)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invalid review status transition.");
        }
        review.status = status;
        repository.save(review);
        return Map.of("status", status);
    }
    private PageRequest pagination(int page, int size) {
        if (page < 0 || size < 1 || size > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination parameters.");
        }
        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id")));
    }

    private boolean isAllowedTransition(String current, String next) {
        return switch (current) {
            case "PENDING" -> "APPROVED".equals(next) || "REJECTED".equals(next) || "ARCHIVED".equals(next);
            case "APPROVED", "REJECTED" -> "ARCHIVED".equals(next);
            case "ARCHIVED" -> "APPROVED".equals(next);
            default -> false;
        };
    }
}
