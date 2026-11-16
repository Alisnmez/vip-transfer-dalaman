package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService, BookingSupportService bookingSupportService) {
        this.bookingService = bookingService;
        this.bookingSupportService = bookingSupportService;
    }

    private final BookingSupportService bookingSupportService;

    @PostMapping("/support/request-code")
    public java.util.Map<String, String> requestSupportCode(@RequestBody java.util.Map<String, String> payload) {
        bookingSupportService.requestCode(payload.get("reference"), payload.get("email"));
        return java.util.Map.of("message", "If the details match a booking, a verification code has been sent.");
    }

    @PostMapping("/support/verify-code")
    public java.util.Map<String, Boolean> verifySupportCode(@RequestBody java.util.Map<String, String> payload) {
        String token = bookingSupportService.verifyCode(
                payload.get("reference"), payload.get("email"), payload.get("code"));
        return token == null ? java.util.Map.of("verified", false) :
                java.util.Map.of("verified", true, "token", token);
    }

    @PostMapping("/support/request")
    public java.util.Map<String, String> submitSupportRequest(@RequestBody java.util.Map<String, String> payload) {
        bookingSupportService.submitRequest(payload.get("token"), payload.get("type"));
        return java.util.Map.of("message", "Your verified request has been sent to our team.");
    }

    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable Long id) {
        return bookingService.getBooking(id);
    }

    @PostMapping
    public Booking createBooking(@Valid @RequestBody BookingRequestDto dto,
                                 @RequestHeader(value = "Idempotency-Key", required = false) String key) {
        return bookingService.createBooking(dto, key);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/page")
    public Page<Booking> getBookingPage(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "25") int size) {
        return bookingService.getBookingPage(page, size);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequestDto dto) {
        return bookingService.updateBooking(id, dto);
    }

    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        return bookingService.updateStatus(id, payload.get("status"));
    }

}