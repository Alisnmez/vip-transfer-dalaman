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
        assertEquals(0, new BigDecimal("42.5").compareTo(price));
    }

    @Test
    void cruisePortUsesVerifiedTaxiPricesAndMarmarisZoneMinivanFare() {
        assertEquals(0, new BigDecimal("42.50").compareTo(pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris Cruise Port", "taxi", "one-way", 2)));
        assertEquals(0, new BigDecimal("85").compareTo(pricingService.calculatePrice(
                "Marmaris Cruise Port", "Dalaman Airport", "taxi", "round-trip", 2)));
        assertEquals(0, new BigDecimal("42.50").compareTo(pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris Cruise Port", "vip-minivan", "one-way", 2)));
    }

    @Test
    void separateBozburunAndSogutNamesRetainTheVerifiedCombinedFare() {
        for (String destination : java.util.List.of("Bozburun", "Sogut")) {
            for (String vehicle : java.util.List.of("taxi", "vip-minivan", "premium-vip-minivan", "maybach", "maybach-plus", "minibus", "vip-minibus", "vip-minibus-long", "minibus-long")) {
                for (String trip : java.util.List.of("one-way", "round-trip")) {
                    assertEquals(pricingService.calculatePrice("Dalaman Airport", "Bozburun / Sogut", vehicle, trip, 1),
                            pricingService.calculatePrice(destination, "Dalaman Airport", vehicle, trip, 1));
                }
            }
        }
    }

    @Test
    void everyExpandedResortCanBePricedInBothDirections() {
        var catalogue = pricingService.publishedPrices();
        assertEquals(531, catalogue.size());
        assertEquals(59, catalogue.stream().map(TransferPricingService.PublishedPrice::destination).distinct().count());
        for (var row : catalogue) {
            assertEquals(row.oneWay(), pricingService.calculatePrice("Dalaman Airport", row.destination(), row.vehicleId(), "one-way", 1));
            assertEquals(row.roundTrip(), pricingService.calculatePrice(row.destination(), "Dalaman Airport", row.vehicleId(), "round-trip", 1));
        }
    }

    @Test
    void calculatesReverseJourneyUsingSameCatalogPrice() {
        BigDecimal price = pricingService.calculatePrice(
                "Marmaris(Any Hotel)", "Dalaman Airport", "vip-minivan", "one-way", 2);
        assertEquals(0, new BigDecimal("42.5").compareTo(price));
    }

    @Test
    void calculatesRoundTripPriceFromCatalog() {
        BigDecimal price = pricingService.calculatePrice(
                "Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan", "round-trip", 2);
        assertEquals(0, new BigDecimal("85.5").compareTo(price));
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
