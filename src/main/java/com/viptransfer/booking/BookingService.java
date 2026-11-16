package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import com.viptransfer.exception.BookingNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.HexFormat;
import java.nio.charset.StandardCharsets;
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
        booking.setSpecialRequests(dto.getSpecialRequests());
        booking.setVehicleId(dto.getVehicleId());
        booking.setTripType(dto.getTripType());
        booking.setPrice(transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(), dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount()));

        return bookingRepository.saveAndFlush(booking);
    }

    private void validateSchedule(BookingRequestDto dto) {
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

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBooking(Long id, BookingRequestDto dto) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));

        existingBooking.setCustomerName(dto.getCustomerName());
        existingBooking.setPassengerCount(dto.getPassengerCount());
        existingBooking.setPickUpLocation(dto.getPickUpLocation());
        existingBooking.setDropOffLocation(dto.getDropOffLocation());
        validateSchedule(dto);
        existingBooking.setTransferDateTime(dto.getTransferDateTime());
        existingBooking.setReturnDateTime(dto.getReturnDateTime());
        existingBooking.setPhoneNumber(dto.getPhoneNumber());
        existingBooking.setEmail(dto.getEmail());
        existingBooking.setCountryOfResidence(dto.getCountryOfResidence());
        existingBooking.setTransferAddress(dto.getTransferAddress());
        existingBooking.setSpecialRequests(dto.getSpecialRequests());
        existingBooking.setVehicleId(dto.getVehicleId());
        existingBooking.setTripType(dto.getTripType());
        existingBooking.setPrice(transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(), dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount()));

        return bookingRepository.save(existingBooking);
    }

    public String deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new BookingNotFoundException(id);
        }
        bookingRepository.deleteById(id);
        return "Booking with ID " + id + " has been successfully deleted.";
    }
}