package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookingCalendarTest {

    @Test
    void calendarQueriesOnlyTheSelectedMonth() {
        BookingRepository repository = mock(BookingRepository.class);
        BookingService service = new BookingService(repository, mock(TransferPricingService.class),
                new ObjectMapper(), mock(PlatformTransactionManager.class));
        YearMonth month = YearMonth.of(2027, 1);
        when(repository.findByTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThanOrderByTransferDateTimeAsc(
                LocalDateTime.of(2027, 1, 1, 0, 0),
                LocalDateTime.of(2027, 2, 1, 0, 0))).thenReturn(List.of(new Booking()));

        assertEquals(1, service.getCalendarBookings(month).size());
        verify(repository).findByTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThanOrderByTransferDateTimeAsc(
                LocalDateTime.of(2027, 1, 1, 0, 0), LocalDateTime.of(2027, 2, 1, 0, 0));
        verify(repository, never()).findAll();
    }

    @Test
    void calendarRejectsMonthOutsideAllowedRange() {
        BookingRepository repository = mock(BookingRepository.class);
        BookingService service = new BookingService(repository, mock(TransferPricingService.class),
                new ObjectMapper(), mock(PlatformTransactionManager.class));
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.getCalendarBookings(YearMonth.of(2035, 1)));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        verifyNoInteractions(repository);
    }
}
