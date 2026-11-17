package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookingSearchFiltersTest {
    private BookingService service(BookingRepository repository) {
        return new BookingService(repository, mock(TransferPricingService.class),
                new ObjectMapper(), mock(PlatformTransactionManager.class));
    }

    @Test
    void acceptsCombinedFiltersAndPreservesDatabasePagination() {
        BookingRepository repository = mock(BookingRepository.class);
        when(repository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        service(repository).getBookingPage(2, 25, "CONFIRMED",
                LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30), "Ali");
        verify(repository).findAll(any(Specification.class),
                org.mockito.ArgumentMatchers.<Pageable>argThat(page -> page.getPageNumber() == 2 && page.getPageSize() == 25
                        && page.getSort().getOrderFor("id").isDescending()));
    }

    @Test
    void rejectsInvalidStatusDateRangeAndOversizedSearch() {
        BookingService service = service(mock(BookingRepository.class));
        assertThrows(ResponseStatusException.class,
                () -> service.getBookingPage(0, 25, "UNKNOWN", null, null, null));
        assertThrows(ResponseStatusException.class,
                () -> service.getBookingPage(0, 25, null,
                        LocalDate.of(2026, 12, 2), LocalDate.of(2026, 12, 1), null));
        assertThrows(ResponseStatusException.class,
                () -> service.getBookingPage(0, 25, null, null, null, "x".repeat(101)));
        assertThrows(ResponseStatusException.class,
                () -> service.getBookingPage(-1, 25, null, null, null, null));
    }
}
