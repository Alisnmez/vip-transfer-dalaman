package com.viptransfer.pricing;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoutePriceRepository extends JpaRepository<RoutePrice, Long> {
    Optional<RoutePrice> findByOriginIgnoreCaseAndDestinationIgnoreCaseAndVehicleTypeIgnoreCase(
        String origin, String destination, String vehicleType);
}
