package com.viptransfer.pricing;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "route_prices", uniqueConstraints = @UniqueConstraint(columnNames = {"origin", "destination", "vehicle_type"}))
public class RoutePrice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(nullable = false) public String origin = "Dalaman Airport";
    @Column(nullable = false) public String destination;
    @Column(name = "vehicle_type", nullable = false, length = 100) public String vehicleType;
    @Column(nullable = false, precision = 12, scale = 2) public BigDecimal price;
    @Column(name = "round_trip_price", precision = 12, scale = 2) public BigDecimal roundTripPrice;
    @Column(nullable = false, length = 3) public String currency = "GBP";
    @Version public Long version;
}
