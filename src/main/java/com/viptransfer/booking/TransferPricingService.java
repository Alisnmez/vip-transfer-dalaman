package com.viptransfer.booking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;

@Service
public class TransferPricingService {

    private final JsonNode prices;

    public TransferPricingService(ObjectMapper objectMapper) throws IOException {
        try (InputStream input = new ClassPathResource("transfer-prices.json").getInputStream()) {
            this.prices = objectMapper.readTree(input);
        }
    }

    public void validateLuggageCapacity(String vehicleId, Integer luggageCount) {
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
            if (pricedDestination.equals(entry.path("destination").asText())
                    && vehicleId.equals(entry.path("vehicleId").asText())) {
                String field = "round-trip".equals(tripType) ? "roundTrip" : "oneWay";
                return entry.path(field).decimalValue();
            }
        }
        throw new IllegalArgumentException("No price found for the selected destination and vehicle.");
    }
}
