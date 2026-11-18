package com.viptransfer.booking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.viptransfer.pricing.RoutePriceRepository;
import com.viptransfer.pricing.RoutePrice;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;

@Service
public class TransferPricingService {

    private final JsonNode prices;
    private final RoutePriceRepository repository;

    public record PublishedPrice(String destination, String vehicleId, BigDecimal oneWay, BigDecimal roundTrip, long version) {}

    public TransferPricingService(ObjectMapper objectMapper) throws IOException {
        this(objectMapper, null);
    }

    @Autowired
    public TransferPricingService(ObjectMapper objectMapper, RoutePriceRepository repository) throws IOException {
        this.repository = repository;
        try (InputStream input = new ClassPathResource("transfer-prices.json").getInputStream()) {
            this.prices = objectMapper.readTree(input);
        }
    }

    public boolean isPublishedRoute(String destination, String vehicleId) {
        for (JsonNode entry : prices) {
            if (entry.path("destination").asText().equals(destination) && entry.path("vehicleId").asText().equals(vehicleId)) return true;
        }
        return false;
    }

    public List<PublishedPrice> publishedPrices() {
        Map<String, RoutePrice> overrides = repository == null ? Map.of() : repository.findByOrigin("Dalaman Airport").stream()
            .collect(Collectors.toMap(row -> row.destination + "\u0000" + row.vehicleType, row -> row));
        List<PublishedPrice> result = new ArrayList<>();
        for (JsonNode entry : prices) {
            String destination = entry.path("destination").asText();
            String vehicleId = entry.path("vehicleId").asText();
            RoutePrice row = overrides.get(destination + "\u0000" + vehicleId);
            boolean completeOverride = isUsableOverride(row);
            result.add(new PublishedPrice(destination, vehicleId, completeOverride ? row.price : entry.path("oneWay").decimalValue(),
                completeOverride ? row.roundTripPrice : entry.path("roundTrip").decimalValue(), row == null ? -1 : row.version));
        }
        return result;
    }

    private boolean isUsableOverride(RoutePrice row) {
        return row != null && "GBP".equals(row.currency) && row.roundTripPrice != null;
    }

    public void validateLuggageCapacity(String vehicleId, Integer luggageCount) {
        if (vehicleId == null) {
            throw new IllegalArgumentException("Invalid vehicle.");
        }
        int maximum = switch (vehicleId) {
            case "taxi" -> 3;
            case "vip-minivan", "premium-vip-minivan" -> 6;
            case "maybach", "maybach-plus" -> 4;
            case "minibus", "vip-minibus", "vip-minibus-long", "minibus-long" -> 8;
            default -> throw new IllegalArgumentException("Invalid vehicle.");
        };

        if (luggageCount != null && (luggageCount < 0 || luggageCount > maximum)) {
            throw new IllegalArgumentException("Luggage count exceeds the selected vehicle capacity.");
        }
    }

    public BigDecimal calculatePrice(String pickup, String destination, String vehicleId, String tripType, int passengerCount) {
        if (vehicleId == null) {
            throw new IllegalArgumentException("Invalid vehicle.");
        }
        int capacity = switch (vehicleId) {
            case "taxi" -> 3;
            case "vip-minivan", "premium-vip-minivan", "maybach", "maybach-plus" -> 5;
            case "minibus" -> 12;
            case "vip-minibus" -> 9;
            case "vip-minibus-long", "minibus-long" -> 16;
            default -> 0;
        };
        if (passengerCount < 1 || passengerCount > capacity) {
            throw new IllegalArgumentException("Passenger count exceeds the vehicle capacity.");
        }

        if (destination == null || vehicleId == null || tripType == null
                || (!"one-way".equals(tripType) && !"round-trip".equals(tripType))) {
            throw new IllegalArgumentException("Invalid transfer pricing details.");
        }

        if (pickup == null || pickup.equals(destination)) {
            throw new IllegalArgumentException("Pickup and destination must be different.");
        }
        String pricedDestination;
        if ("Dalaman Airport".equals(pickup)) {
            pricedDestination = destination;
        } else if ("Dalaman Airport".equals(destination)) {
            pricedDestination = pickup;
        } else {
            throw new IllegalArgumentException("Only airport routes are currently priced.");
        }
        for (JsonNode entry : prices) {
            if (pricedDestination.equals(entry.path("destination").asText()) && vehicleId.equals(entry.path("vehicleId").asText())) {
                RoutePrice row = repository == null ? null : repository.findByOriginAndDestinationAndVehicleType("Dalaman Airport", pricedDestination, vehicleId).orElse(null);
                if (isUsableOverride(row)) return "round-trip".equals(tripType) ? row.roundTripPrice : row.price;
                return entry.path("round-trip".equals(tripType) ? "roundTrip" : "oneWay").decimalValue();
            }
        }
        throw new IllegalArgumentException("No price found for the selected destination and vehicle.");
    }
}
