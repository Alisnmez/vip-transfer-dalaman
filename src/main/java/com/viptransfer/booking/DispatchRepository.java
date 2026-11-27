package com.viptransfer.booking;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

interface DispatchRepository extends JpaRepository<DispatchLeg, Long> {
  Optional<DispatchLeg> findByBookingIdAndLeg(Long bookingId, String leg);

}
