package com.viptransfer.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
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
                "dropOffLocation", "Fethiye",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "price", new BigDecimal("75.00")
        ));

        String response = mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.customerName").value("Integration Test"))
                .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/bookings/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Integration Test"))
                .andExpect(jsonPath("$.dropOffLocation").value("Fethiye"))
                .andExpect(jsonPath("$.passengerCount").value(2));
    }

    @Test
    void rejectsBookingWithoutRequiredCustomerName() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "price", new BigDecimal("75.00")
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest());
    }
    @Test
    void rejectsNegativeBookingPrice() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Price Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "price", new BigDecimal("-1.00")
        ));

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest());
    }

}
