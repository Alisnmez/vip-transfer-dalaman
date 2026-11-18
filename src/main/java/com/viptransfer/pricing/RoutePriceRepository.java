package com.viptransfer.pricing;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoutePriceRepository extends JpaRepository<RoutePrice, Long> {
    List<RoutePrice> findByOrigin(String origin);
    Optional<RoutePrice> findByOriginAndDestinationAndVehicleType(String origin, String destination, String vehicleType);
}
