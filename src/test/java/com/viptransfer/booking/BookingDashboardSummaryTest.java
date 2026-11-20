package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookingDashboardSummaryTest {

    @Test
    void summaryUsesDatabaseCountsAndLimitsUpcomingResults() {
        BookingRepository repository = mock(BookingRepository.class);
        BookingService service = new BookingService(repository, mock(TransferPricingService.class),
                new ObjectMapper(), mock(PlatformTransactionManager.class), mock(com.viptransfer.email.BookingEmails.class));
        Booking upcoming = new Booking();
        upcoming.setId(42L);
        upcoming.setStatus("CONFIRMED");
        Booking started = new Booking();
        started.setId(18L);
        started.setStatus("CONFIRMED");
        when(repository.count()).thenReturn(120L);
        when(repository.countByStatus("PENDING")).thenReturn(7L);
        when(repository.countByStatusInAndTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThan(
                anyCollection(), any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(3L);
        when(repository.findUpcomingDashboardBookings(any(LocalDateTime.class), any(Pageable.class))).thenReturn(List.of(upcoming));
        when(repository.findStartedDashboardBookings(any(LocalDateTime.class), any(Pageable.class))).thenReturn(List.of(started));

        Map<String, Object> result = service.getDashboardSummary();

        assertEquals(120L, result.get("total"));
        assertEquals(7L, result.get("pending"));
        assertEquals(3L, result.get("today"));
        assertEquals(List.of(upcoming), result.get("upcoming"));
        assertEquals(List.of(started), result.get("started"));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> statuses = ArgumentCaptor.forClass(Collection.class);
        ArgumentCaptor<LocalDateTime> start = ArgumentCaptor.forClass(LocalDateTime.class);
        ArgumentCaptor<LocalDateTime> end = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(repository).countByStatusInAndTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThan(
                statuses.capture(), start.capture(), end.capture());
        assertTrue(statuses.getValue().containsAll(List.of("PENDING", "CONFIRMED")));
        assertEquals(2, statuses.getValue().size());
        assertEquals(start.getValue().plusDays(1), end.getValue());
        assertEquals(0, start.getValue().getHour());
        assertEquals(0, start.getValue().getMinute());
        ArgumentCaptor<LocalDateTime> cutoff = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(repository).findUpcomingDashboardBookings(cutoff.capture(), argThat(page -> page.getPageSize() == 12));
        verify(repository).findStartedDashboardBookings(eq(cutoff.getValue()), argThat(page -> page.getPageSize() == 8));
        verify(repository, never()).findAll();
    }
}
