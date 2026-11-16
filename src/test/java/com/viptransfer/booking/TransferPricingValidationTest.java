package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;

class TransferPricingValidationTest {
    private final TransferPricingService pricing;

    TransferPricingValidationTest() throws java.io.IOException {
        pricing = new TransferPricingService(new ObjectMapper());
    }

    @Test
    void missingVehicleIsRejectedEvenWithoutLuggage() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> pricing.validateLuggageCapacity(null, null));
        assertEquals("Invalid vehicle.", error.getMessage());
    }

    @Test
    void missingVehicleIsRejectedWhenCalculatingPrice() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> pricing.calculatePrice("Dalaman Airport", "Turunc", null, "one-way", 2));
        assertEquals("Invalid vehicle.", error.getMessage());
    }

    @Test
    void unknownVehicleIsRejectedEvenWithoutLuggage() {
        assertThrows(IllegalArgumentException.class,
                () -> pricing.validateLuggageCapacity("unknown-vehicle", null));
    }

    @Test
    void unknownRouteCannotReceiveAnInventedPrice() {
        assertThrows(IllegalArgumentException.class,
                () -> pricing.calculatePrice("Dalaman Airport", "Unknown Destination", "taxi", "one-way", 2));
    }
}
