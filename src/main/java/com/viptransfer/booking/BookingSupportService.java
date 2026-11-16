package com.viptransfer.booking;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BookingSupportService {
    private static final Duration CODE_LIFETIME = Duration.ofMinutes(10);
    private static final Duration REQUEST_COOLDOWN = Duration.ofMinutes(2);
    private static final int MAX_ATTEMPTS = 5;
    private final BookingRepository repository;
    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Challenge> challenges = new ConcurrentHashMap<>();

    private static class Challenge {
        final String codeHash;
        final Instant expiresAt;
        final Instant nextRequestAt;
        int attempts;

        Challenge(String codeHash, Instant now) {
            this.codeHash = codeHash;
            this.expiresAt = now.plus(CODE_LIFETIME);
            this.nextRequestAt = now.plus(REQUEST_COOLDOWN);
        }
    }

    public BookingSupportService(BookingRepository repository, JavaMailSender mailSender,
                                 @Value("${app.support.email.enabled:false}") boolean enabled,
                                 @Value("${app.support.email.from:}") String from) {
        this.repository = repository;
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    public synchronized void requestCode(String reference, String email) {
        requireEnabled();
        String key = normalizedKey(reference, email);
        Instant now = Instant.now();
        Challenge old = challenges.get(key);
        if (old != null && now.isBefore(old.nextRequestAt)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Please wait before requesting another code.");
        }
        // Apply the cooldown even if the reference or email is incorrect.
        if (challenges.size() >= 10000) {
            challenges.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiresAt));
            if (challenges.size() >= 10000) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Please try again later.");
            }
        }
        challenges.put(key, new Challenge("", now));
        if (!matchesBooking(reference, email)) return;

        String code = String.format("%06d", random.nextInt(1_000_000));
        challenges.put(key, new Challenge(hash(code), now));
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(email.trim());
        message.setSubject("VIP Transfer Dalaman - Booking verification");
        message.setText("Your booking support verification code is: " + code +
                "\nThis code expires in 10 minutes. Do not share it with anyone.");
        try {
            mailSender.send(message);
        } catch (RuntimeException error) {
            challenges.put(key, new Challenge("", now));
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Verification email could not be sent.");
        }
    }

    public synchronized boolean verifyCode(String reference, String email, String code) {
        requireEnabled();
        String key = normalizedKey(reference, email);
        Challenge challenge = challenges.get(key);
        if (challenge == null || Instant.now().isAfter(challenge.expiresAt) ||
                challenge.attempts >= MAX_ATTEMPTS || code == null || !code.matches("[0-9]{6}")) {
            return false;
        }
        challenge.attempts++;
        if (!MessageDigest.isEqual(hash(code).getBytes(java.nio.charset.StandardCharsets.UTF_8),
                challenge.codeHash.getBytes(java.nio.charset.StandardCharsets.UTF_8))) return false;
        challenges.remove(key);
        return true;
    }

    private boolean matchesBooking(String reference, String email) {
        try {
            return repository.findById(Long.parseLong(reference))
                    .map(booking -> booking.getEmail() != null &&
                            booking.getEmail().trim().equalsIgnoreCase(email.trim()))
                    .orElse(false);
        } catch (NumberFormatException error) {
            return false;
        }
    }

    private String normalizedKey(String reference, String email) {
        if (reference == null || !reference.matches("[1-9][0-9]{0,15}") ||
                email == null || email.length() > 254 || !email.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verification details.");
        }
        return reference + ":" + email.trim().toLowerCase(java.util.Locale.ROOT);
    }

    private String hash(String code) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(code.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (java.security.NoSuchAlgorithmException error) {
            throw new IllegalStateException(error);
        }
    }

    private void requireEnabled() {
        if (!enabled || from.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Email verification is not configured yet.");
        }
    }
}
