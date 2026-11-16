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

    private final BookingRepository bookingRepository;
    private final TransferPricingService transferPricingService;
    private final ObjectMapper objectMapper;
    private final TransactionTemplate transactionTemplate;

    public BookingService(BookingRepository bookingRepository, TransferPricingService transferPricingService,
                          ObjectMapper objectMapper, PlatformTransactionManager transactionManager) {
        this.bookingRepository = bookingRepository;
        this.transferPricingService = transferPricingService;
        this.objectMapper = objectMapper;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    public Booking createBooking(BookingRequestDto dto) {
        return createBooking(dto, null);
    }

    public Booking createBooking(BookingRequestDto dto, String key) {
        if (key == null) {
            return createNewBooking(dto, null, null);
        }
        if (!key.matches("[A-Za-z0-9_-]{16,64}")) {
            throw new IllegalArgumentException("Invalid Idempotency-Key.");
        }
        String fingerprint = fingerprint(dto);
        var existing = bookingRepository.findByIdempotencyKey(key);
        if (existing.isPresent()) {
            return verifySameRequest(existing.get(), fingerprint);
        }
        try {
            // Commit before returning; a competing request can safely read the winner.
            return transactionTemplate.execute(status -> createNewBooking(dto, key, fingerprint));
        } catch (DataIntegrityViolationException collision) {
            // PostgreSQL unique constraint arbitrates concurrent requests across instances.
            return bookingRepository.findByIdempotencyKey(key)
                    .map(booking -> verifySameRequest(booking, fingerprint))
                    .orElseThrow(() -> collision);
        }
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

        return bookingRepository.saveAndFlush(booking);
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
                "upcoming", bookingRepository.findTop8ByStatusInAndTransferDateTimeGreaterThanEqualOrderByTransferDateTimeAsc(
                        activeStatuses, now));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
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

        return bookingRepository.save(existingBooking);
    }

    @Transactional
    public Booking updateStatus(Long id, String status) {
        if (status == null || !java.util.Set.of("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid booking status.");
        }
        Booking booking = getBooking(id);
        String current = booking.getStatus() == null ? "PENDING" : booking.getStatus();
        if (current.equals(status)) {
            return booking;
        }
        boolean allowed = switch (current) {
            case "PENDING" -> "CONFIRMED".equals(status) || "CANCELLED".equals(status);
            case "CONFIRMED" -> "COMPLETED".equals(status) || "CANCELLED".equals(status);
            default -> false;
        };
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Invalid booking status transition from " + current + " to " + status + ".");
        }
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

}