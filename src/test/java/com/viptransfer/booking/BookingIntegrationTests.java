package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "app.admin.password=test-admin-password")
@AutoConfigureMockMvc
class BookingIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createsBookingAndReadsItBackFromPostgres() throws Exception {
        String request = objectMapper.writeValueAsString(Map.ofEntries(
                Map.entry("customerName", "Integration Test"),
                Map.entry("passengerCount", 2),
                Map.entry("pickUpLocation", "Dalaman Airport"),
                Map.entry("dropOffLocation", "Fethiye City Center(Any Hotel)"),
                Map.entry("transferDateTime", LocalDateTime.now().plusDays(3).toString()),
                Map.entry("phoneNumber", "+905551234567"),
                Map.entry("email", "guest@example.com"),
                Map.entry("transferAddress", "Fethiye City Center, Turkey"),
                Map.entry("countryOfResidence", "Lithuania"),
                Map.entry("specialRequests", "Two child seats"),
                Map.entry("vehicleId", "vip-minivan"),
                Map.entry("tripType", "one-way")
        ));

        String response = mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.customerName").value("Integration Test"))
                .andExpect(jsonPath("$.price").value(45.5))
                .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/bookings/{id}", id)
                        .header("Authorization", "Basic " + Base64.getEncoder().encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Integration Test"))
                .andExpect(jsonPath("$.dropOffLocation").value("Fethiye City Center(Any Hotel)"))
                .andExpect(jsonPath("$.passengerCount").value(2))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.email").value("guest@example.com"))
                .andExpect(jsonPath("$.countryOfResidence").value("Lithuania"))
                .andExpect(jsonPath("$.transferAddress").value("Fethiye City Center, Turkey"))
                .andExpect(jsonPath("$.specialRequests").value("Two child seats"));
    }

    @Test
    void blocksAnonymousBookingReadsAndChanges() throws Exception {
        mockMvc.perform(get("/bookings"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/bookings/1"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/bookings/1"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/bookings/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsBookingWithoutRequiredCustomerName() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "guest@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest());
    }
    @Test
    void rejectsBookingWithTooManyPassengers() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Capacity Test",
                "passengerCount", 6,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "guest@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createsReverseAirportTransferAtCatalogPrice() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Return Passenger",
                "passengerCount", 2,
                "pickUpLocation", "Fethiye City Center(Any Hotel)",
                "dropOffLocation", "Dalaman Airport",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "guest@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(45.5));
    }
    @Test
    void savesIndependentReturnDateAndTime() throws Exception {
        LocalDateTime outbound = LocalDateTime.now().plusDays(3).withNano(0);
        LocalDateTime returning = outbound.plusDays(7).plusHours(2);
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Round Trip Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Marmaris(Any Hotel)",
                "transferDateTime", outbound.toString(),
                "returnDateTime", returning.toString(),
                "phoneNumber", "+905551234567",
                "email", "guest@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "round-trip"
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.returnDateTime").value(returning.toString()))
                .andExpect(jsonPath("$.tripType").value("round-trip"));
    }

    @Test
    void rejectsRoundTripWithoutReturnDate() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Missing Return Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Marmaris(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "guest@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "round-trip"
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest());
    }


    @Test
    void repeatedBookingRequestWithSameKeyReturnsSameBooking() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Retry Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "retry@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        String key = java.util.UUID.randomUUID().toString();
        String first = mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String second = mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        org.junit.jupiter.api.Assertions.assertEquals(
                objectMapper.readTree(first).get("id").asLong(),
                objectMapper.readTree(second).get("id").asLong(),
                "A retry must not create a second booking");
    }

    @Test
    void reusedKeyWithDifferentBookingDataReturnsConflict() throws Exception {
        String key = java.util.UUID.randomUUID().toString();
        java.util.Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "customerName", "Original Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "retry@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        request.put("customerName", "Changed Test");
        mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }



    @Test
    void concurrentRetriesWithSameKeyCreateOnlyOneBooking() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Concurrent Retry Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "concurrent@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        String key = java.util.UUID.randomUUID().toString();
        java.util.concurrent.ExecutorService executor = java.util.concurrent.Executors.newFixedThreadPool(2);
        java.util.concurrent.CountDownLatch start = new java.util.concurrent.CountDownLatch(1);
        try {
            java.util.concurrent.Callable<Long> submit = () -> {
                start.await();
                String body = mockMvc.perform(post("/bookings")
                                .header("Idempotency-Key", key)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                        .andExpect(status().isOk())
                        .andReturn().getResponse().getContentAsString();
                return objectMapper.readTree(body).get("id").asLong();
            };
            var first = executor.submit(submit);
            var second = executor.submit(submit);
            start.countDown();
            org.junit.jupiter.api.Assertions.assertEquals(
                    first.get(20, java.util.concurrent.TimeUnit.SECONDS),
                    second.get(20, java.util.concurrent.TimeUnit.SECONDS),
                    "Concurrent retries must resolve to the same booking");
        } finally {
            executor.shutdownNow();
        }
    }

}
