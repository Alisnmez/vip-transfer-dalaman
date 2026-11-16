package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TransferPricingServiceTests {

    private TransferPricingService pricingService;

    @BeforeEach
    void setUp() throws Exception {
        pricingService = new TransferPricingService(new ObjectMapper());
    }

    @Test
    void calculatesAirportToMarmarisPriceFromCatalog() {
        BigDecimal price = pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan", "one-way", 2);
        assertEquals(0, new BigDecimal("47.5").compareTo(price));
    }

    @Test
    void calculatesReverseJourneyUsingSameCatalogPrice() {
        BigDecimal price = pricingService.calculatePrice(
                "Marmaris(Any Hotel)", "Dalaman Airport", "vip-minivan", "one-way", 2);
        assertEquals(0, new BigDecimal("47.5").compareTo(price));
    }

    @Test
    void calculatesRoundTripPriceFromCatalog() {
        BigDecimal price = pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan", "round-trip", 2);
        assertEquals(0, new BigDecimal("95").compareTo(price));
    }

    @Test
    void rejectsTooManyPassengers() {
        assertThrows(IllegalArgumentException.class, () -> pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan", "one-way", 6));
    }

    @Test
    void rejectsUnsupportedRoute() {
        assertThrows(IllegalArgumentException.class, () -> pricingService.calculatePrice(
                "Marmaris(Any Hotel)", "Fethiye City Center(Any Hotel)", "vip-minivan", "one-way", 2));
    }

    @Test
    void rejectsUnknownVehicle() {
        assertThrows(IllegalArgumentException.class, () -> pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris(Any Hotel)", "unknown", "one-way", 2));
    }
}
