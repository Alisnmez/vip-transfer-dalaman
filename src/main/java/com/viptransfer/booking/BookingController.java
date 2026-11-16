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

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
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