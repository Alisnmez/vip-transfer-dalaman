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


    @GetMapping("/{id:[0-9]+}")
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

    @GetMapping("/calendar")
    public List<Booking> getCalendarBookings(@RequestParam String month) {
        if (!month.matches("[0-9]{4}-(0[1-9]|1[0-2])")) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Invalid calendar month.");
        }
        return bookingService.getCalendarBookings(java.time.YearMonth.parse(month));
    }

    @GetMapping("/dashboard")
    public java.util.Map<String, Object> getDashboardSummary() {
        return bookingService.getDashboardSummary();
    }

    @GetMapping("/page")
    public Page<Booking> getBookingPage(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "25") int size) {
        return bookingService.getBookingPage(page, size);
    }

    @PutMapping("/{id:[0-9]+}")
    public Booking updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequestDto dto) {
        return bookingService.updateBooking(id, dto);
    }

    @PatchMapping("/{id:[0-9]+}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        return bookingService.updateStatus(id, payload.get("status"));
    }

}