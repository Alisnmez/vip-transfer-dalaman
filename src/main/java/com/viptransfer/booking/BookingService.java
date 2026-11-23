package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import com.viptransfer.exception.BookingNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.HexFormat;
import java.security.MessageDigest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {

    private final com.viptransfer.email.BookingEmails bookingEmails;
    private final BookingRepository bookingRepository;
    private final TransferPricingService transferPricingService;
    private final ObjectMapper objectMapper;
    private final TransactionTemplate transactionTemplate;

    public BookingService(BookingRepository bookingRepository, TransferPricingService transferPricingService,
                          ObjectMapper objectMapper, PlatformTransactionManager transactionManager,
                          com.viptransfer.email.BookingEmails bookingEmails) {
        this.bookingEmails = bookingEmails;
        this.bookingRepository = bookingRepository;
        this.transferPricingService = transferPricingService;
        this.objectMapper = objectMapper;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    public Booking createBooking(BookingRequestDto dto) {
        return createBooking(dto, null);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public com.viptransfer.booking.dto.PublicBookingView publicLookup(
            com.viptransfer.booking.dto.PublicBookingLookupDto dto) {
        String reference = dto.bookingReference().strip().toUpperCase(java.util.Locale.ROOT);
        Booking matched = bookingRepository.findByReference(reference).orElse(null);
        if (matched == null) {
            Long legacyId = BookingReference.toId(reference);
            if (legacyId != null) {
                Booking legacy = bookingRepository.findById(legacyId).orElse(null);
                if (legacy != null && reference.equals(legacy.getReference())) matched = legacy;
            }
        }
        if (matched == null || matched.getEmail() == null ||
                !matched.getEmail().strip().equalsIgnoreCase(dto.email().strip())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND,
                    "No booking matches this reference and email address.");
        }
        return com.viptransfer.booking.dto.PublicBookingView.from(matched);
    }

    private static final int MAX_REFERENCE_INSERT_ATTEMPTS = 10;

    public Booking createBooking(BookingRequestDto dto, String key) {
        if (key != null && !key.matches("[A-Za-z0-9_-]{16,64}")) {
            throw new IllegalArgumentException("Invalid Idempotency-Key.");
        }
        String fingerprint = key == null ? null : fingerprint(dto);
        if (key != null) {
            var existing = bookingRepository.findByIdempotencyKey(key);
            if (existing.isPresent()) return verifySameRequest(existing.get(), fingerprint);
        }

        // Each retry runs in a fresh transaction. A PostgreSQL unique violation aborts
        // the current transaction, so retrying saveAndFlush inside it would never work.
        for (int attempt = 0; attempt < MAX_REFERENCE_INSERT_ATTEMPTS; attempt++) {
            try {
                return transactionTemplate.execute(status -> createNewBooking(dto, key, fingerprint));
            } catch (DataIntegrityViolationException collision) {
                // A concurrent request with the same idempotency key must return its
                // existing booking, not create a second one with a new reference.
                if (key != null) {
                    var existing = bookingRepository.findByIdempotencyKey(key);
                    if (existing.isPresent()) return verifySameRequest(existing.get(), fingerprint);
                }
                if (!isReferenceUniqueViolation(collision)) throw collision;
                // Another request won the reference race: generate a fresh code in
                // a new transaction and retry the entire booking + email outbox write.
            }
        }
        throw new IllegalStateException("Could not allocate a unique booking reference after retries.");
    }

    private static boolean isReferenceUniqueViolation(Throwable error) {
        for (Throwable cause = error; cause != null; cause = cause.getCause()) {
            if (cause instanceof java.sql.SQLException sql && "23505".equals(sql.getSQLState())) {
                String message = sql.getMessage() == null ? "" : sql.getMessage().toLowerCase(java.util.Locale.ROOT);
                return message.contains("reference") || message.contains("uq_booking_public_reference");
            }
        }
        return false;
    }

    private Booking verifySameRequest(Booking booking, String fingerprint) {
        if (!fingerprint.equals(booking.getRequestFingerprint())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Idempotency-Key already belongs to another booking request.");
        }
        return booking;
    }

    private String fingerprint(BookingRequestDto dto) {
        try {
            byte[] bytes = objectMapper.writeValueAsBytes(dto);
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (Exception error) {
            throw new IllegalStateException("Could not fingerprint booking request.", error);
        }
    }

    private Booking createNewBooking(BookingRequestDto dto, String key, String fingerprint) {
        Booking booking = new Booking();
        booking.setIdempotencyKey(key);
        booking.setRequestFingerprint(fingerprint);
        booking.setCustomerName(dto.getCustomerName());
        booking.setPassengerCount(dto.getPassengerCount());
        booking.setPickUpLocation(dto.getPickUpLocation());
        booking.setDropOffLocation(dto.getDropOffLocation());
        validateSchedule(dto);
        booking.setTransferDateTime(dto.getTransferDateTime());
        booking.setReturnDateTime(dto.getReturnDateTime());
        booking.setPhoneNumber(dto.getPhoneNumber());
        booking.setEmail(dto.getEmail());
        booking.setCountryOfResidence(dto.getCountryOfResidence());
        booking.setTransferAddress(dto.getTransferAddress());
        booking.setHotelName(dto.getHotelName());
        booking.setSpecialRequests(dto.getSpecialRequests());
        booking.setFlightNumber(dto.getFlightNumber());
        transferPricingService.validateLuggageCapacity(dto.getVehicleId(), dto.getLuggageCount());
        booking.setLuggageCount(dto.getLuggageCount());
        booking.setBabySeatCount(dto.getBabySeatCount());
        booking.setVehicleId(dto.getVehicleId());
        booking.setTripType(dto.getTripType());
        booking.setPrice(transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(), dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount()));

        for (int attempt = 0; attempt < 30; attempt++) {
            String candidate = BookingReference.generate();
            if (!bookingRepository.existsByReference(candidate)) {
                booking.setReference(candidate);
                break;
            }
        }
        if (booking.getReference() == null) throw new IllegalStateException("Could not allocate a unique booking reference.");
        Booking saved = bookingRepository.saveAndFlush(booking);
        bookingEmails.queue(saved, "RECEIVED");
        return saved;
    }

    private void validateSchedule(BookingRequestDto dto) {
        if (dto.getTransferDateTime() == null || !dto.getTransferDateTime().isAfter(java.time.LocalDateTime.now(java.time.ZoneId.of("Europe/Istanbul")))) {
            throw new IllegalArgumentException("Pickup date and time must be in the future in Turkey local time.");
        }
        if (!"one-way".equals(dto.getTripType()) && !"round-trip".equals(dto.getTripType())) {
            throw new IllegalArgumentException("Invalid trip type.");
        }
        if ("round-trip".equals(dto.getTripType())) {
            if (dto.getReturnDateTime() == null || !dto.getReturnDateTime().isAfter(dto.getTransferDateTime())) {
                throw new IllegalArgumentException("Return date and time must be after outbound pickup.");
            }
        } else if (dto.getReturnDateTime() != null) {
            throw new IllegalArgumentException("One-way transfers cannot have a return date.");
        }
    }

    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    public List<Booking> getCalendarBookings(java.time.YearMonth month) {
        java.time.YearMonth earliest = java.time.YearMonth.now(java.time.ZoneId.of("Europe/Istanbul")).minusYears(2);
        java.time.YearMonth latest = java.time.YearMonth.now(java.time.ZoneId.of("Europe/Istanbul")).plusYears(2);
        if (month.isBefore(earliest) || month.isAfter(latest)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Calendar month is out of range.");
        }
        return bookingRepository.findByTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThanOrderByTransferDateTimeAsc(
                month.atDay(1).atStartOfDay(), month.plusMonths(1).atDay(1).atStartOfDay());
    }

    public java.util.Map<String, Object> getDashboardSummary() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now(java.time.ZoneId.of("Europe/Istanbul"));
        java.time.LocalDate today = now.toLocalDate();
        java.util.List<String> activeStatuses = java.util.List.of("PENDING", "CONFIRMED");
        return java.util.Map.of(
                "total", bookingRepository.count(),
                "pending", bookingRepository.countByStatus("PENDING"),
                "today", bookingRepository.countByStatusInAndTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThan(
                        activeStatuses, today.atStartOfDay(), today.plusDays(1).atStartOfDay()),
                "upcoming", bookingRepository.findUpcomingDashboardBookings(now, PageRequest.of(0, 12)),
                "started", bookingRepository.findStartedDashboardBookings(now, PageRequest.of(0, 8)));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Page<Booking> getBookingPage(int page, int size, String status, java.time.LocalDate from, java.time.LocalDate to, String search) {
        if (status != null && !java.util.Set.of("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid booking status filter.");
        }
        if (from != null && to != null && from.isAfter(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid transfer date range.");
        }
        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination parameters.");
        }
        String term = search == null ? "" : search.strip().toLowerCase(java.util.Locale.ROOT);
        if (term.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Search is too long.");
        }
        org.springframework.data.jpa.domain.Specification<Booking> filters = (root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            if (!term.isEmpty()) {
                String pattern = "%" + term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
                java.util.List<jakarta.persistence.criteria.Predicate> matches = new java.util.ArrayList<>();
                matches.add(cb.like(cb.lower(root.get("customerName")), pattern, '\\'));
                matches.add(cb.like(cb.lower(root.get("pickUpLocation")), pattern, '\\'));
                matches.add(cb.like(cb.lower(root.get("dropOffLocation")), pattern, '\\'));
                if (term.matches("[0-9]{1,18}")) {
                    try { matches.add(cb.equal(root.get("id"), Long.parseLong(term))); }
                    catch (NumberFormatException ignored) { /* Text fields remain searchable. */ }
                }
                predicates.add(cb.or(matches.toArray(new jakarta.persistence.criteria.Predicate[0])));
            }
            if (from != null) predicates.add(cb.greaterThanOrEqualTo(root.get("transferDateTime"), from.atStartOfDay()));
            if (to != null) predicates.add(cb.lessThan(root.get("transferDateTime"), to.plusDays(1).atStartOfDay()));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
        return bookingRepository.findAll(filters, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }

    public Page<Booking> getBookingPage(int page, int size) {
        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination parameters.");
        }
        return bookingRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }

    @Transactional
    public Booking updateBooking(Long id, BookingRequestDto dto) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));

        boolean fareChanged = !Objects.equals(existingBooking.getPickUpLocation(), dto.getPickUpLocation())
                || !Objects.equals(existingBooking.getDropOffLocation(), dto.getDropOffLocation())
                || !Objects.equals(existingBooking.getVehicleId(), dto.getVehicleId())
                || !Objects.equals(existingBooking.getTripType(), dto.getTripType())
                || !Objects.equals(existingBooking.getPassengerCount(), dto.getPassengerCount());
        boolean scheduleChanged = !Objects.equals(existingBooking.getTransferDateTime(), dto.getTransferDateTime())
                || !Objects.equals(existingBooking.getReturnDateTime(), dto.getReturnDateTime())
                || !Objects.equals(existingBooking.getTripType(), dto.getTripType());
        if (scheduleChanged) {
            validateSchedule(dto);
        }
        if (fareChanged && !java.util.Set.of("PENDING", "CONFIRMED", "COMPLETED").contains(existingBooking.getStatus() == null ? "PENDING" : existingBooking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Fare-changing edits are not allowed for cancelled bookings.");
        }
        // Validate before mutating the managed entity. A failed request must not leave partial changes.
        transferPricingService.validateLuggageCapacity(dto.getVehicleId(), dto.getLuggageCount());
        BigDecimal updatedFare = null;
        if (fareChanged) {
            updatedFare = transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(),
                    dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount());
        }
        StringBuilder changes = new StringBuilder();
        appendChange(changes, "Pick-up", existingBooking.getPickUpLocation(), dto.getPickUpLocation());
        appendChange(changes, "Destination", existingBooking.getDropOffLocation(), dto.getDropOffLocation());
        appendChange(changes, "Pick-up time (Türkiye)", existingBooking.getTransferDateTime(), dto.getTransferDateTime());
        appendChange(changes, "Return time (Türkiye)", existingBooking.getReturnDateTime(), dto.getReturnDateTime());
        appendChange(changes, "Vehicle", existingBooking.getVehicleId(), dto.getVehicleId());
        appendChange(changes, "Passengers", existingBooking.getPassengerCount(), dto.getPassengerCount());
        appendChange(changes, "Trip type", existingBooking.getTripType(), dto.getTripType());
        if (fareChanged) appendChange(changes, "Quoted fare (GBP)", existingBooking.getPrice(), updatedFare);
        existingBooking.setCustomerName(dto.getCustomerName());
        existingBooking.setPassengerCount(dto.getPassengerCount());
        existingBooking.setPickUpLocation(dto.getPickUpLocation());
        existingBooking.setDropOffLocation(dto.getDropOffLocation());
        existingBooking.setTransferDateTime(dto.getTransferDateTime());
        existingBooking.setReturnDateTime(dto.getReturnDateTime());
        existingBooking.setPhoneNumber(dto.getPhoneNumber());
        existingBooking.setEmail(dto.getEmail());
        existingBooking.setCountryOfResidence(dto.getCountryOfResidence());
        existingBooking.setTransferAddress(dto.getTransferAddress());
        existingBooking.setHotelName(dto.getHotelName());
        existingBooking.setSpecialRequests(dto.getSpecialRequests());
        existingBooking.setFlightNumber(dto.getFlightNumber());
        existingBooking.setLuggageCount(dto.getLuggageCount());
        existingBooking.setBabySeatCount(dto.getBabySeatCount());
        existingBooking.setVehicleId(dto.getVehicleId());
        existingBooking.setTripType(dto.getTripType());
        if (fareChanged) {
            existingBooking.setPrice(updatedFare);
        }

        Booking saved = bookingRepository.save(existingBooking);
        if (!changes.isEmpty() && !"CANCELLED".equals(saved.getStatus())) {
            bookingEmails.queueUpdated(saved, changes.toString().stripTrailing());
        }
        return saved;
    }

    private static void appendChange(StringBuilder changes, String label, Object before, Object after) {
        if (!Objects.equals(before, after)) {
            changes.append(label).append(": ")
                    .append(before == null ? "Not set" : before)
                    .append(" → ").append(after == null ? "Not set" : after).append("\\n");
        }
    }

    @Transactional
    public Booking updateStatus(Long id, String status) {
        if (status == null || !java.util.Set.of("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid booking status.");
        }
        Booking booking = bookingRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
        String current = booking.getStatus() == null ? "PENDING" : booking.getStatus();
        if (current.equals(status)) {
            return booking;
        }
        boolean allowed = switch (current) {
            case "PENDING" -> "CONFIRMED".equals(status) || "CANCELLED".equals(status);
            case "CONFIRMED" -> "PENDING".equals(status) || "COMPLETED".equals(status) || "CANCELLED".equals(status);
            case "COMPLETED" -> "CONFIRMED".equals(status) || "PENDING".equals(status);
            default -> false;
        };
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Invalid booking status transition from " + current + " to " + status + ".");
        }
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);
        // Driver assignment is an internal operation; notify only for completion or cancellation.
        if ("COMPLETED".equals(status) || "CANCELLED".equals(status)) {
            bookingEmails.queue(saved, status);
        }
        return saved;
    }

}
