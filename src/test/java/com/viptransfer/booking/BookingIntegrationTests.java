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
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Integration Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "guest@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
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
                .andExpect(jsonPath("$.email").value("guest@example.com"));
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
}
