package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viptransfer.booking.dto.BookingRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookingAdminUpdateTest {

    private BookingRepository repository;
    private TransferPricingService pricing;
    private BookingService service;
    private Booking booking;
    private BookingRequestDto request;

    @BeforeEach
    void setUp() {
        repository = mock(BookingRepository.class);
        pricing = mock(TransferPricingService.class);
        service = new BookingService(repository, pricing, new ObjectMapper(),
                mock(PlatformTransactionManager.class), mock(com.viptransfer.email.BookingEmails.class));
        booking = new Booking();
        booking.setId(10L);
        booking.setStatus("CONFIRMED");
        booking.setPrice(new BigDecimal("67.50"));
        booking.setCustomerName("Customer");
        booking.setPassengerCount(2);
        booking.setPickUpLocation("Dalaman Airport");
        booking.setDropOffLocation("Turunc");
        booking.setVehicleId("vip-minivan");
        booking.setTripType("one-way");
        booking.setTransferDateTime(LocalDateTime.of(2025, 1, 1, 12, 0));

        request = new BookingRequestDto();
        request.setCustomerName("Updated customer");
        request.setPassengerCount(2);
        request.setPickUpLocation("Dalaman Airport");
        request.setDropOffLocation("Turunc");
        request.setVehicleId("vip-minivan");
        request.setTripType("one-way");
        request.setTransferDateTime(booking.getTransferDateTime());
        request.setPhoneNumber("+905551234567");
        request.setEmail("test@example.com");
        when(repository.findById(10L)).thenReturn(Optional.of(booking));
        when(repository.findByIdForUpdate(10L)).thenReturn(Optional.of(booking));
        when(repository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void changingPickupToPastDoesNotMutateBooking() {
        var original = booking.getTransferDateTime();
        request.setTransferDateTime(LocalDateTime.now(java.time.ZoneId.of("Europe/Istanbul")).minusDays(1));
        assertThrows(IllegalArgumentException.class, () -> service.updateBooking(10L, request));
        assertEquals(original, booking.getTransferDateTime());
        assertEquals("Customer", booking.getCustomerName());
        verify(repository, never()).save(any());
    }

    @Test
    void changingReturnBeforePickupDoesNotMutateBooking() {
        request.setTransferDateTime(LocalDateTime.now(java.time.ZoneId.of("Europe/Istanbul")).plusDays(2));
        request.setTripType("round-trip");
        request.setReturnDateTime(request.getTransferDateTime().minusMinutes(1));
        assertThrows(IllegalArgumentException.class, () -> service.updateBooking(10L, request));
        assertEquals("one-way", booking.getTripType());
        verify(repository, never()).save(any());
    }

    @Test
    void contactEditOnHistoricalBookingKeepsOriginalPrice() {
        Booking updated = service.updateBooking(10L, request);
        assertEquals(new BigDecimal("67.50"), updated.getPrice());
        assertEquals("Updated customer", updated.getCustomerName());
        verify(pricing, never()).calculatePrice(any(), any(), any(), any(), anyInt());
    }

    @Test
    void confirmedBookingCanChangeDestinationAndRecalculateFare() {
        request.setDropOffLocation("Marmaris(Any Hotel)");
        when(pricing.calculatePrice(any(), any(), any(), any(), anyInt()))
                .thenReturn(new BigDecimal("47.50"));
        Booking updated = service.updateBooking(10L, request);
        assertEquals("CONFIRMED", updated.getStatus());
        assertEquals("Marmaris(Any Hotel)", updated.getDropOffLocation());
        assertEquals(new BigDecimal("47.50"), updated.getPrice());
        verify(pricing).calculatePrice("Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan", "one-way", 2);
    }

    @Test
    void confirmedBookingCanReverseAirportRouteAndRecalculateFare() {
        request.setPickUpLocation("Turunc");
        request.setDropOffLocation("Dalaman Airport");
        when(pricing.calculatePrice(any(), any(), any(), any(), anyInt()))
                .thenReturn(new BigDecimal("67.50"));

        Booking updated = service.updateBooking(10L, request);

        assertEquals("Turunc", updated.getPickUpLocation());
        assertEquals("Dalaman Airport", updated.getDropOffLocation());
        assertEquals(new BigDecimal("67.50"), updated.getPrice());
        verify(pricing).calculatePrice("Turunc", "Dalaman Airport", "vip-minivan", "one-way", 2);
    }

    @Test
    void confirmedBookingCanChangeContactWithoutRepricing() {
        request.setPhoneNumber("+905551112233");
        Booking updated = service.updateBooking(10L, request);
        assertEquals("CONFIRMED", updated.getStatus());
        assertEquals("+905551112233", updated.getPhoneNumber());
        assertEquals(new BigDecimal("67.50"), updated.getPrice());
        verify(pricing, never()).calculatePrice(any(), any(), any(), any(), anyInt());
    }

    @Test
    void completedBookingCanCorrectDestinationAndRecalculateHistoricalFare() {
        booking.setStatus("COMPLETED");
        request.setDropOffLocation("Marmaris(Any Hotel)");
        when(pricing.calculatePrice(any(), any(), any(), any(), anyInt()))
                .thenReturn(new BigDecimal("47.50"));

        Booking updated = service.updateBooking(10L, request);

        assertEquals("COMPLETED", updated.getStatus());
        assertEquals("Marmaris(Any Hotel)", updated.getDropOffLocation());
        assertEquals(new BigDecimal("47.50"), updated.getPrice());
        verify(repository).save(booking);
    }

    @Test
    void cancelledBookingCannotChangeFareInputs() {
        booking.setStatus("CANCELLED");
        request.setPassengerCount(3);
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.updateBooking(10L, request));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        assertEquals(new BigDecimal("67.50"), booking.getPrice());
        verify(repository, never()).save(any());
    }

    @Test
    void pendingBookingRecalculatesOnlyWhenFareInputsChange() {
        booking.setStatus("PENDING");
        request.setPassengerCount(3);
        when(pricing.calculatePrice(any(), any(), any(), any(), anyInt()))
                .thenReturn(new BigDecimal("75.50"));
        Booking updated = service.updateBooking(10L, request);
        assertEquals(new BigDecimal("75.50"), updated.getPrice());
        verify(pricing, times(1)).calculatePrice(any(), any(), any(), any(), anyInt());
    }

    @Test
    void invalidLuggageDoesNotMutateBooking() {
        doThrow(new IllegalArgumentException("Luggage count exceeds capacity."))
                .when(pricing).validateLuggageCapacity("vip-minivan", 8);
        request.setLuggageCount(8);
        assertThrows(IllegalArgumentException.class, () -> service.updateBooking(10L, request));
        assertEquals("Customer", booking.getCustomerName());
        assertEquals(new BigDecimal("67.50"), booking.getPrice());
        verify(repository, never()).save(any());
    }

    @Test
    void missingTariffDoesNotMutateBooking() {
        booking.setStatus("PENDING");
        request.setPassengerCount(3);
        when(pricing.calculatePrice(any(), any(), any(), any(), anyInt()))
                .thenThrow(new IllegalArgumentException("No price found."));
        assertThrows(IllegalArgumentException.class, () -> service.updateBooking(10L, request));
        assertEquals("Customer", booking.getCustomerName());
        verify(repository, never()).save(any());
    }

    @Test
    void pendingBookingCanBeConfirmed() {
        booking.setStatus("PENDING");
        Booking updated = service.updateStatus(10L, "CONFIRMED");
        assertEquals("CONFIRMED", updated.getStatus());
        verify(repository).save(booking);
    }

    @Test
    void confirmedBookingCanBeReturnedToPending() {
        booking.setStatus("CONFIRMED");
        Booking updated = service.updateStatus(10L, "PENDING");
        assertEquals("PENDING", updated.getStatus());
        verify(repository).save(booking);
        verify(bookingEmails).queue(booking, "PENDING");
    }

    @Test
    void completedBookingCanBeReopenedAsPending() {
        booking.setStatus("COMPLETED");
        Booking updated = service.updateStatus(10L, "PENDING");
        assertEquals("PENDING", updated.getStatus());
        verify(repository).save(booking);
    }

    @Test
    void completedBookingCanBeReopenedAsConfirmed() {
        booking.setStatus("COMPLETED");
        Booking updated = service.updateStatus(10L, "CONFIRMED");
        assertEquals("CONFIRMED", updated.getStatus());
        verify(repository).save(booking);
    }

    @Test
    void completedBookingCannotBeCancelledDirectly() {
        booking.setStatus("COMPLETED");
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.updateStatus(10L, "CANCELLED"));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        assertEquals("COMPLETED", booking.getStatus());
        verify(repository, never()).save(any());
    }

    @Test
    void cancelledBookingCannotBeConfirmed() {
        booking.setStatus("CANCELLED");
        assertThrows(ResponseStatusException.class,
                () -> service.updateStatus(10L, "CONFIRMED"));
        verify(repository, never()).save(any());
    }

    @Test
    void sameStatusIsIdempotent() {
        Booking updated = service.updateStatus(10L, "CONFIRMED");
        assertEquals("CONFIRMED", updated.getStatus());
        verify(repository, never()).save(any());
    }

    @Test
    void paginationRejectsUnboundedRequests() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.getBookingPage(0, 101));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        verify(repository, never()).findAll(any(PageRequest.class));
    }

    @Test
    void paginationUsesNewestFirstSort() {
        service.getBookingPage(1, 25);
        verify(repository).findAll(PageRequest.of(1, 25, Sort.by(Sort.Direction.DESC, "id")));
    }

    @Test
    void listRequestsNewestFirst() {
        when(repository.findAll(any(Sort.class))).thenReturn(List.of(booking));
        assertEquals(1, service.getAllBookings().size());
        verify(repository).findAll(Sort.by(Sort.Direction.DESC, "id"));
    }
}
