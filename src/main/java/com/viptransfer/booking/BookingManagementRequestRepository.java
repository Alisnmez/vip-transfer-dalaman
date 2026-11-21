package com.viptransfer.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.Collection;

public interface BookingManagementRequestRepository extends JpaRepository<BookingManagementRequest, Long> {
    Optional<BookingManagementRequest> findByIdempotencyKey(String idempotencyKey);

    List<BookingManagementRequest> findAllByOrderByCreatedAtDesc();

    List<BookingManagementRequest> findByStatusOrderByCreatedAtDesc(String status);

    boolean existsByBookingIdAndStatusIn(Long bookingId, Collection<String> statuses);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from BookingManagementRequest r where r.id = :id")
    Optional<BookingManagementRequest> findByIdForUpdate(@Param("id") Long id);
}
