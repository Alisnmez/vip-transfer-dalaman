package com.viptransfer.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    Optional<Booking> findByIdempotencyKey(String key);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select b from Booking b where b.id = :id")
    Optional<Booking> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Long id);


    java.util.List<Booking> findByTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThanOrderByTransferDateTimeAsc(
            java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByStatus(String status);

    long countByStatusInAndTransferDateTimeGreaterThanEqualAndTransferDateTimeLessThan(
            java.util.Collection<String> statuses, java.time.LocalDateTime start, java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("""
            select b from Booking b
            where b.status in ('PENDING', 'CONFIRMED') and b.transferDateTime > :now
            order by b.transferDateTime asc, b.id asc
            """)
    java.util.List<Booking> findUpcomingDashboardBookings(
            @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now,
            org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("""
            select b from Booking b
            where b.status = 'CONFIRMED' and b.transferDateTime <= :now
            order by b.transferDateTime desc, b.id asc
            """)
    java.util.List<Booking> findStartedDashboardBookings(
            @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now,
            org.springframework.data.domain.Pageable pageable);
}
