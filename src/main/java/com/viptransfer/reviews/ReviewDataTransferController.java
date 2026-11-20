package com.viptransfer.reviews;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@Component
@RestController
@RequestMapping("/internal/review-transfer")
public class ReviewDataTransferController implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(ReviewDataTransferController.class);
    private static final int BATCH_SIZE = 100;

    private final CustomerReviewRepository repository;
    private final JdbcTemplate jdbc;
    private final RestClient.Builder restClientBuilder;
    private final org.springframework.core.env.Environment environment;

    public ReviewDataTransferController(
            CustomerReviewRepository repository,
            JdbcTemplate jdbc,
            RestClient.Builder restClientBuilder,
            org.springframework.core.env.Environment environment) {
        this.repository = repository;
        this.jdbc = jdbc;
        this.restClientBuilder = restClientBuilder;
        this.environment = environment;
    }

    public record ReviewTransfer(
            String customerName,
            int rating,
            String comment,
            String status,
            Instant createdAt,
            int duplicateOrdinal) {}

    public record TransferSummary(int inserted, int alreadyPresent) {}

    @PostMapping("/import")
    @Transactional
    public TransferSummary importBatch(
            @RequestHeader(value = "X-Review-Transfer-Token", required = false) String suppliedToken,
            @RequestBody List<ReviewTransfer> reviews) {
        authorize(suppliedToken);
        if (reviews == null || reviews.size() > BATCH_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid review transfer batch.");
        }

        int inserted = 0;
        int alreadyPresent = 0;
        for (ReviewTransfer review : reviews) {
            validate(review);
            OffsetDateTime createdAt = OffsetDateTime.ofInstant(review.createdAt(), ZoneOffset.UTC);
            Integer matchingRows = jdbc.queryForObject(
                    "SELECT count(*) FROM customer_reviews WHERE customer_name = ? AND rating = ? AND comment = ? AND status = ? AND created_at = ?",
                    Integer.class,
                    review.customerName(), review.rating(), review.comment(), review.status(), createdAt);
            if (matchingRows != null && matchingRows >= review.duplicateOrdinal()) {
                alreadyPresent++;
                continue;
            }
            jdbc.update(
                    "INSERT INTO customer_reviews (customer_name, rating, comment, status, created_at) VALUES (?, ?, ?, ?, ?)",
                    review.customerName(), review.rating(), review.comment(), review.status(), createdAt);
            inserted++;
        }
        return new TransferSummary(inserted, alreadyPresent);
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean enabled = Boolean.parseBoolean(environment.getProperty("REVIEW_TRANSFER_ENABLED", "false"));
        String target = environment.getProperty("REVIEW_TRANSFER_TARGET_URL", "").trim();
        if (!enabled || target.isBlank()) return;

        String token = environment.getProperty("REVIEW_TRANSFER_TOKEN", "");
        if (token.isBlank()) {
            log.error("Review transfer is enabled but its temporary token is missing.");
            return;
        }

        try {
            transferTo(target.replaceAll("/+$", ""), token);
        } catch (Exception exception) {
            log.error("Review transfer failed ({})", exception.getClass().getSimpleName());
        }
    }

    private void transferTo(String target, String token) throws NoSuchAlgorithmException {
        int pageNumber = 0;
        int insertedTotal = 0;
        int existingTotal = 0;
        Map<String, Integer> duplicateOrdinals = new HashMap<>();
        RestClient client = restClientBuilder.build();

        while (true) {
            Page<CustomerReview> page = repository.findAll(
                    PageRequest.of(pageNumber, BATCH_SIZE, Sort.by(Sort.Direction.ASC, "id")));
            if (page.isEmpty()) break;

            List<ReviewTransfer> batch = new ArrayList<>(page.getNumberOfElements());
            for (CustomerReview review : page.getContent()) {
                String fingerprint = fingerprint(review);
                int ordinal = duplicateOrdinals.merge(fingerprint, 1, Integer::sum);
                batch.add(new ReviewTransfer(
                        review.customerName, review.rating, review.comment, review.status, review.createdAt, ordinal));
            }

            TransferSummary summary = client.post()
                    .uri(target + "/internal/review-transfer/import")
                    .header("X-Review-Transfer-Token", token)
                    .body(batch)
                    .retrieve()
                    .body(TransferSummary.class);
            if (summary == null) throw new IllegalStateException("Empty transfer response.");
            insertedTotal += summary.inserted();
            existingTotal += summary.alreadyPresent();
            pageNumber++;
        }

        log.info("Review transfer finished. Inserted: {}, already present: {}.", insertedTotal, existingTotal);
    }

    private String fingerprint(CustomerReview review) throws NoSuchAlgorithmException {
        String value = review.customerName + "\u0000" + review.rating + "\u0000" + review.comment
                + "\u0000" + review.status + "\u0000" + review.createdAt;
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(digest);
    }

    private void validate(ReviewTransfer review) {
        if (review == null || review.customerName() == null || review.customerName().isBlank()
                || review.customerName().length() > 80 || review.rating() < 1 || review.rating() > 5
                || review.comment() == null || review.comment().isBlank() || review.comment().length() > 1500
                || review.status() == null
                || !List.of("PENDING", "APPROVED", "REJECTED", "ARCHIVED").contains(review.status())
                || review.createdAt() == null || review.duplicateOrdinal() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid review transfer record.");
        }
    }

    private void authorize(String suppliedToken) {
        String expectedToken = environment.getProperty("REVIEW_TRANSFER_TOKEN", "");
        if (expectedToken.isBlank() || suppliedToken == null
                || !MessageDigest.isEqual(
                        expectedToken.getBytes(StandardCharsets.UTF_8),
                        suppliedToken.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Review transfer is not authorized.");
        }
    }
}