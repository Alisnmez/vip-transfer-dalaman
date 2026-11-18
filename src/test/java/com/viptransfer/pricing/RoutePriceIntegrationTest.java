package com.viptransfer.pricing;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viptransfer.booking.TransferPricingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;
import org.springframework.transaction.annotation.Propagation;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;

@SpringBootTest(properties = {"app.admin.username=testadmin", "app.admin.password=testpassword"})
@AutoConfigureMockMvc
@Transactional
class RoutePriceIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired TransferPricingService pricing;
    @Autowired RoutePriceRepository repository;

    private String edit(Object oneWay, Object roundTrip, long version) throws Exception {
        return mapper.writeValueAsString(Map.of("destination", "Marmaris(Any Hotel)", "vehicleId", "vip-minivan",
            "oneWay", oneWay, "roundTrip", roundTrip, "version", version));
    }

    @Test void publicCatalogueIsAvailableButAnonymousWritesAreBlocked() throws Exception {
        mvc.perform(get("/route-prices")).andExpect(status().isOk()).andExpect(jsonPath("$[0].oneWay").isNumber());
        mvc.perform(put("/route-prices").contentType(MediaType.APPLICATION_JSON).content(edit(60, 120, -1)))
            .andExpect(status().isUnauthorized());
        assertEquals(0, repository.count());
    }

    @Test void persistsPriceAndRejectsStaleVersionWithoutOverwriting() throws Exception {
        mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
            .contentType(MediaType.APPLICATION_JSON).content(edit("60.25", "115.50", -1)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.version").value(0));
        mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
            .contentType(MediaType.APPLICATION_JSON).content(edit(1, 2, -1))).andExpect(status().isConflict());
        assertEquals(0, new BigDecimal("60.25").compareTo(pricing.calculatePrice("Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan", "one-way", 2)));
    }

    @Test void rejectsInvalidMoneyUnknownRoutesAndMissingVersion() throws Exception {
        for (String payload : new String[] {edit(0, 120, -1), edit(-10, 120, -1), edit("12.345", 120, -1),
            edit("1000000000", 120, -1), edit(60, 120, -1).replace("Marmaris(Any Hotel)", "Unknown place"),
            "{\"destination\":\"Marmaris(Any Hotel)\",\"vehicleId\":\"vip-minivan\",\"oneWay\":60,\"roundTrip\":120}"}) {
            mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isBadRequest());
        }
        assertEquals(0, repository.count());
    }

    @Test void updatesExistingOverrideWithVersionCheck() throws Exception {
        mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
            .contentType(MediaType.APPLICATION_JSON).content(edit(60, 120, -1))).andExpect(status().isOk());
        mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
            .contentType(MediaType.APPLICATION_JSON).content(edit(65, 130, 0)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.version").value(1));
        assertEquals(1, repository.count());
        assertEquals(0, new BigDecimal("130").compareTo(pricing.calculatePrice("Marmaris(Any Hotel)", "Dalaman Airport", "vip-minivan", "round-trip", 2)));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void concurrentAdminsCannotSilentlyOverwriteTheSameVersion() throws Exception {
        ExecutorService workers = Executors.newFixedThreadPool(2);
        try {
            mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content(edit(60, 120, -1))).andExpect(status().isOk());
            String first = edit(65, 130, 0), second = edit(70, 140, 0);
            CountDownLatch start = new CountDownLatch(1);
            Callable<Integer> one = () -> { start.await(); return mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword")).contentType(MediaType.APPLICATION_JSON).content(first)).andReturn().getResponse().getStatus(); };
            Callable<Integer> two = () -> { start.await(); return mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword")).contentType(MediaType.APPLICATION_JSON).content(second)).andReturn().getResponse().getStatus(); };
            Future<Integer> a = workers.submit(one), b = workers.submit(two);
            start.countDown();
            assertEquals(java.util.List.of(200, 409), java.util.stream.Stream.of(a.get(15, TimeUnit.SECONDS), b.get(15, TimeUnit.SECONDS)).sorted().toList());
        } finally {
            workers.shutdownNow();
            workers.awaitTermination(5, TimeUnit.SECONDS);
            repository.findByOriginAndDestinationAndVehicleType("Dalaman Airport", "Marmaris(Any Hotel)", "vip-minivan").ifPresent(repository::delete);
        }
    }

    @Test void newBookingsUseEditedPricesAndOldBookingsKeepTheirFare() throws Exception {
        Map<String, Object> request = new HashMap<>(Map.of("customerName", "Price test passenger", "passengerCount", 2,
            "pickUpLocation", "Dalaman Airport", "dropOffLocation", "Marmaris(Any Hotel)",
            "transferDateTime", LocalDateTime.now().plusDays(4).withNano(0).toString(),
            "phoneNumber", "+905551234567", "email", "price-test@example.invalid", "vehicleId", "vip-minivan", "tripType", "one-way"));
        String before = mvc.perform(post("/bookings").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(request)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.price").value(47.5)).andReturn().getResponse().getContentAsString();
        long originalId = mapper.readTree(before).get("id").asLong();
        mvc.perform(put("/route-prices").with(httpBasic("testadmin", "testpassword"))
            .contentType(MediaType.APPLICATION_JSON).content(edit(60, 115, -1))).andExpect(status().isOk());
        mvc.perform(post("/bookings").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(request)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.price").value(60));
        request.put("pickUpLocation", "Marmaris(Any Hotel)"); request.put("dropOffLocation", "Dalaman Airport");
        mvc.perform(post("/bookings").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(request)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.price").value(60));
        request.put("tripType", "round-trip"); request.put("returnDateTime", LocalDateTime.now().plusDays(7).withNano(0).toString());
        mvc.perform(post("/bookings").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(request)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.price").value(115));
        mvc.perform(get("/bookings/" + originalId).with(httpBasic("testadmin", "testpassword")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.price").value(47.5));
    }
}
