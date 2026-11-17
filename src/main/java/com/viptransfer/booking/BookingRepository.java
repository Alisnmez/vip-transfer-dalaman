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

    @org.springframework.data.jpa.repository.Query("""
            select b from Booking b
            where (b.status = 'CONFIRMED' and b.transferDateTime <= :now)
               or (b.status in ('PENDING', 'CONFIRMED') and b.transferDateTime > :now)
            order by case when b.status = 'CONFIRMED' and b.transferDateTime <= :now then 0 else 1 end,
                     b.transferDateTime asc, b.id asc
            """)
    java.util.List<Booking> findDashboardBookings(
            @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now,
            org.springframework.data.domain.Pageable pageable);
}
