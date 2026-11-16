package com.viptransfer.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByIdempotencyKey(String key);

    java.util.List<Booking> findByTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThanOrderByTransferDateTimeAsc(
            java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByStatus(String status);

    long countByStatusInAndTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThan(
            java.util.Collection<String> statuses, java.time.LocalDateTime start, java.time.LocalDateTime end);

    java.util.List<Booking> findTop8ByStatusInAndTransferDateTimeGreaterThanEqualOrderByTransferDateTimeAsc(
            java.util.Collection<String> statuses, java.time.LocalDateTime now);
}
