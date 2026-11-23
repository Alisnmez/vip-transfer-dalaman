package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import com.viptransfer.booking.dto.BookingManagementRequestDto;
import com.viptransfer.booking.dto.BookingManagementRequestUpdateDto;
import com.viptransfer.booking.dto.BookingManagementRequestView;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BookingManagementRequestService managementRequestService;

    public BookingController(BookingService bookingService, BookingManagementRequestService managementRequestService) {
        this.bookingService = bookingService;
        this.managementRequestService = managementRequestService;
    }


    @PostMapping("/public-lookup")
    public com.viptransfer.booking.dto.PublicBookingView publicLookup(
            @Valid @RequestBody com.viptransfer.booking.dto.PublicBookingLookupDto dto) {
        return bookingService.publicLookup(dto);
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
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) java.time.LocalDate from,
            @RequestParam(required = false) java.time.LocalDate to) {
        return bookingService.getBookingPage(page, size, status, from, to, search);
    }

    @PutMapping("/{id:[0-9]+}")
    public Booking updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequestDto dto) {
        return bookingService.updateBooking(id, dto);
    }

    @PatchMapping("/{id:[0-9]+}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        return bookingService.updateStatus(id, payload.get("status"));
    }

    @PostMapping("/management-requests")
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.ACCEPTED)
    public java.util.Map<String, String> submitManagementRequest(
            @Valid @RequestBody BookingManagementRequestDto dto,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        return managementRequestService.submit(dto, idempotencyKey);
    }

    @GetMapping("/management-requests")
    public List<BookingManagementRequestView> getManagementRequests(
            @RequestParam(required = false) String status) {
        return managementRequestService.list(status);
    }

    @PatchMapping("/management-requests/{id:[0-9]+}")
    public BookingManagementRequestView updateManagementRequest(
            @PathVariable Long id, @Valid @RequestBody BookingManagementRequestUpdateDto dto) {
        return managementRequestService.update(id, dto);
    }

    @PostMapping("/management-requests/{id:[0-9]+}/cancel-booking")
    public BookingManagementRequestView cancelBookingFromRequest(
            @PathVariable Long id, @RequestBody(required = false) java.util.Map<String, String> payload) {
        return managementRequestService.cancelBookingAndResolve(id, payload == null ? null : payload.get("adminNote"));
    }

}
