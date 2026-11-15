package com.viptransfer.booking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;

@Service
public class TransferPricingService {

    private final JsonNode prices;

    public TransferPricingService(ObjectMapper objectMapper) throws IOException {
        this.prices = objectMapper.readTree(new ClassPathResource("transfer-prices.json").getInputStream());
    }

    public BigDecimal calculatePrice(String destination, String vehicleId, String tripType) {
        if (destination == null || vehicleId == null || tripType == null
                || (!"one-way".equals(tripType) && !"round-trip".equals(tripType))) {
            throw new IllegalArgumentException("Invalid transfer pricing details.");
        }

        for (JsonNode entry : prices) {
            if (destination.equals(entry.path("destination").asText())
                    && vehicleId.equals(entry.path("vehicleId").asText())) {
                String field = "round-trip".equals(tripType) ? "roundTrip" : "oneWay";
                return entry.path(field).decimalValue();
            }
        }
        throw new IllegalArgumentException("No price found for the selected destination and vehicle.");
    }
}
