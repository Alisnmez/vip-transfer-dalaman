package com.viptransfer.pricing;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "route_prices", uniqueConstraints = @UniqueConstraint(columnNames = {"origin", "destination", "vehicle_type"}))
public class RoutePrice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String origin;
    @Column(nullable = false) private String destination;
    @Column(name = "vehicle_type", nullable = false) private String vehicleType;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal price;
    @Column(nullable = false, length = 3) private String currency = "EUR";

    public Long getId() { return id; }
    public String getOrigin() { return origin; }
    public void setOrigin(String value) { origin = value; }
    public String getDestination() { return destination; }
    public void setDestination(String value) { destination = value; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String value) { vehicleType = value; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal value) { price = value; }
    public String getCurrency() { return currency; }
    public void setCurrency(String value) { currency = value; }
}
