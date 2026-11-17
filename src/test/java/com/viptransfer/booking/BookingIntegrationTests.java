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

@SpringBootTest(properties = {"app.admin.password=test-admin-password",
        "app.frontend.origin=https://vip-transfer-dalaman-test.onrender.com"})
@AutoConfigureMockMvc
class BookingIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BookingRepository bookingRepository;


    @Test
    void bookingPageRequiresAdminAndRejectsInvalidPagination() throws Exception {
        mockMvc.perform(get("/bookings/page"))
                .andExpect(status().isUnauthorized());

        String auth = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(get("/bookings/page")
                        .header("Authorization", auth)
                        .param("page", "0")
                        .param("size", "25"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").isNumber())
                .andExpect(jsonPath("$.number").value(0));

        mockMvc.perform(get("/bookings/page").header("Authorization", auth)
                        .param("page", "-1"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/bookings/page").header("Authorization", auth)
                        .param("size", "0"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/bookings/page").header("Authorization", auth)
                        .param("size", "101"))
                .andExpect(status().isBadRequest());
    }


    @Test
    void adminCanConfirmAndCancelBookingButCannotReopenCancelledBooking() throws Exception {
        String auth = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Status Flow Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(4).toString(),
                "phoneNumber", "+905551234567",
                "email", "status-flow@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        String created = mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(created).get("id").asLong();
        org.junit.jupiter.api.Assertions.assertEquals(
                "PENDING", bookingRepository.findById(id).orElseThrow().getStatus());

        // The same persisted booking must also be visible in the admin's paginated list.
        mockMvc.perform(get("/bookings/page")
                        .header("Authorization", auth)
                        .param("search", Long.toString(id)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(id))
                .andExpect(jsonPath("$.content[0].status").value("PENDING"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/bookings/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/bookings/{id}/status", id)
                        .header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
        org.junit.jupiter.api.Assertions.assertEquals(
                "CONFIRMED", bookingRepository.findById(id).orElseThrow().getStatus());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/bookings/{id}/status", id)
                        .header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CANCELLED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/bookings/{id}/status", id)
                        .header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isConflict());

        mockMvc.perform(get("/bookings/{id}", id).header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
        // A rejected reopening must not mutate the persisted booking.
        org.junit.jupiter.api.Assertions.assertEquals(
                "CANCELLED", bookingRepository.findById(id).orElseThrow().getStatus());

        // Cancelled bookings must remain private.
        mockMvc.perform(get("/bookings/{id}", id))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void pendingBookingCanBeCancelledButNotReopened() throws Exception {
        Booking booking = new Booking();
        booking.setCustomerName("Cancellation Test");
        booking.setStatus("PENDING");
        long id = bookingRepository.saveAndFlush(booking).getId();
        String auth = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));
        String cancelled = objectMapper.writeValueAsString(Map.of("status", "CANCELLED"));
        String confirmed = objectMapper.writeValueAsString(Map.of("status", "CONFIRMED"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/bookings/{id}/status", id)
                        .header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(cancelled))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/bookings/{id}/status", id)
                        .header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(confirmed))
                .andExpect(status().isConflict());

        mockMvc.perform(get("/bookings/{id}", id).header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

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
        // Verify the booking was actually persisted, not merely returned by the API.
        Booking persisted = bookingRepository.findById(id).orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals("Integration Test", persisted.getCustomerName());
        org.junit.jupiter.api.Assertions.assertEquals("PENDING", persisted.getStatus());

        // Customer-created bookings must remain inaccessible without admin credentials.
        mockMvc.perform(get("/bookings/{id}", id))
                .andExpect(status().isUnauthorized());

        String receivedAt = objectMapper.readTree(response).get("createdAt").asText();
        org.junit.jupiter.api.Assertions.assertFalse(receivedAt.isBlank());
        java.time.Instant.parse(receivedAt);

        mockMvc.perform(get("/bookings/{id}", id)
                        .header("Authorization", "Basic " + Base64.getEncoder().encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Integration Test"))
                .andExpect(jsonPath("$.dropOffLocation").value("Fethiye City Center(Any Hotel)"))
                .andExpect(jsonPath("$.passengerCount").value(2))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty())
                .andExpect(jsonPath("$.email").value("guest@example.com"))
                .andExpect(jsonPath("$.countryOfResidence").value("Lithuania"))
                .andExpect(jsonPath("$.transferAddress").value("Fethiye City Center, Turkey"))
                .andExpect(jsonPath("$.specialRequests").value("Two child seats"));
    }

    @Test
    void persistsFlightNumberAndRejectsInvalidCharacters() throws Exception {
        java.util.Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "customerName", "Flight Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "flight@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way",
                "flightNumber", "TK 2552"
        ));
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightNumber").value("TK 2552"));

        request.put("flightNumber", "TK/2552");
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void persistsLuggageAndBabySeatCountsAndRejectsNegativeValues() throws Exception {
        java.util.Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "customerName", "Luggage Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "luggage@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way",
                "luggageCount", 6
        ));
        request.put("babySeatCount", 2);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(6))
                .andExpect(jsonPath("$.babySeatCount").value(2));

        request.put("babySeatCount", 0);
        request.put("luggageCount", 0);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(0))
                .andExpect(jsonPath("$.babySeatCount").value(0));

        request.put("luggageCount", 6);
        request.put("babySeatCount", -1);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        request.put("babySeatCount", 3);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Baby seat count cannot exceed 2."));

        request.put("babySeatCount", 1);
        request.put("luggageCount", -1);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        request.put("luggageCount", 7);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Luggage count exceeds the selected vehicle capacity."));

        request.put("vehicleId", "minibus");
        request.put("luggageCount", 8);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(8));

        request.put("luggageCount", 9);
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void savesHotelNameAndRejectsOverlongAccommodationName() throws Exception {
        java.util.Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "customerName", "Hotel Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "hotel@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way",
                "hotelName", "Marina Hotel"
        ));
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hotelName").value("Marina Hotel"));

        request.put("hotelName", "H".repeat(121));
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void browserCanPreflightAndAdminCanUpdateBookingStatus() throws Exception {
        String origin = "https://vip-transfer-dalaman-test.onrender.com";
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options("/bookings/123/status")
                        .header("Origin", origin)
                        .header("Access-Control-Request-Method", "PATCH")
                        .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Access-Control-Allow-Origin", origin))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Access-Control-Allow-Methods", org.hamcrest.Matchers.containsString("PATCH")));

        String valid = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Status Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "status@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        String response = mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/bookings/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/bookings/{id}/status", id)
                        .header("Authorization", valid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
        mockMvc.perform(get("/bookings/{id}", id).header("Authorization", valid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/bookings/{id}/status", id)
                        .header("Authorization", valid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "INVALID"))))
                .andExpect(status().isBadRequest());
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
    void adminBookingListRequiresValidCredentials() throws Exception {
        String valid = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));
        String invalid = "Basic " + Base64.getEncoder()
                .encodeToString("admin:wrong-password".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(get("/bookings")
                        .header("Authorization", invalid))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/bookings")
                        .header("Authorization", valid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/bookings/1")
                        .header("Authorization", invalid))
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
    void rejectsVehicleLuggageOverflowOnUpdateWithoutChangingSavedBooking() throws Exception {
        java.util.Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "customerName", "Capacity Update Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "capacity-update@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way",
                "luggageCount", 6
        ));
        String created = mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(6))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(created).get("id").asLong();
        String adminAuthorization = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));

        request.put("luggageCount", 7);
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/bookings/{id}", id)
                        .header("Authorization", adminAuthorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Luggage count exceeds the selected vehicle capacity."));

        mockMvc.perform(get("/bookings/{id}", id)
                        .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(6));

        request.put("luggageCount", 5);
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/bookings/{id}", id)
                        .header("Authorization", adminAuthorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(5));

        mockMvc.perform(get("/bookings/{id}", id)
                        .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.luggageCount").value(5));
    }

    @Test
    void rejectsZeroAndNegativePassengersWithoutCreatingBookings() throws Exception {
        java.util.Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "customerName", "Invalid Passenger Test",
                "passengerCount", 1,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "invalid-passenger@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        long countBefore = bookingRepository.count();

        for (int invalidCount : new int[]{0, -1}) {
            request.put("passengerCount", invalidCount);
            mockMvc.perform(post("/bookings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.message").value("Passenger count must be at least 1."));
        }

        org.junit.jupiter.api.Assertions.assertEquals(countBefore, bookingRepository.count(),
                "Invalid passenger counts must never create a booking");
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
                .andExpect(jsonPath("$.returnDateTime").value(returning.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
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
    void rejectsPastPickupTimeOnServer() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Past Date Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now(java.time.ZoneId.of("Europe/Istanbul")).minusHours(1).toString(),
                "phoneNumber", "+905551234567",
                "email", "past@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        long before = bookingRepository.count();
        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isBadRequest());
        org.junit.jupiter.api.Assertions.assertEquals(before, bookingRepository.count());
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
        long countBefore = bookingRepository.count();
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
        org.junit.jupiter.api.Assertions.assertEquals(countBefore + 1, bookingRepository.count(),
                "Retrying one request must insert exactly one row");
        Long savedId = objectMapper.readTree(first).get("id").asLong();
        String adminAuthorization = "Basic " + Base64.getEncoder()
                .encodeToString("admin:test-admin-password".getBytes(StandardCharsets.UTF_8));
        mockMvc.perform(get("/bookings/{id}", savedId)
                        .header("Authorization", adminAuthorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedId))
                .andExpect(jsonPath("$.customerName").value("Retry Test"))
                .andExpect(jsonPath("$.status").value("PENDING"));

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
        long countBefore = bookingRepository.count();
        mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        org.junit.jupiter.api.Assertions.assertEquals(countBefore + 1, bookingRepository.count(),
                "The original idempotency key must create exactly one booking");
        request.put("customerName", "Changed Test");
        mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
        org.junit.jupiter.api.Assertions.assertEquals(countBefore + 1, bookingRepository.count(),
                "A conflicting retry must not insert another booking");
    }



    @Test
    void invalidIdempotencyKeysNeverCreateBookings() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Invalid Retry Key",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now(java.time.ZoneId.of("Europe/Istanbul")).plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "invalid-key@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        long before = bookingRepository.count();
        for (String key : new String[]{"short", "bad key with spaces", "a".repeat(65)}) {
            mockMvc.perform(post("/bookings")
                            .header("Idempotency-Key", key)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(request))
                    .andExpect(status().isBadRequest());
        }
        org.junit.jupiter.api.Assertions.assertEquals(before, bookingRepository.count(),
                "Invalid retry keys must not persist a booking");
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
        long countBefore = bookingRepository.count();
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
            org.junit.jupiter.api.Assertions.assertEquals(countBefore + 1, bookingRepository.count(),
                    "Concurrent retries must insert exactly one row");
        } finally {
            executor.shutdownNow();
        }
    }


    @Test
    void independentKeysCreateIndependentBookingsWithoutExposingRetryMetadata() throws Exception {
        String request = objectMapper.writeValueAsString(Map.of(
                "customerName", "Independent Booking Test",
                "passengerCount", 2,
                "pickUpLocation", "Dalaman Airport",
                "dropOffLocation", "Fethiye City Center(Any Hotel)",
                "transferDateTime", LocalDateTime.now().plusDays(3).toString(),
                "phoneNumber", "+905551234567",
                "email", "independent@example.com",
                "vehicleId", "vip-minivan",
                "tripType", "one-way"
        ));
        long countBefore = bookingRepository.count();
        String first = mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idempotencyKey").doesNotExist())
                .andExpect(jsonPath("$.requestFingerprint").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        String second = mockMvc.perform(post("/bookings")
                        .header("Idempotency-Key", java.util.UUID.randomUUID().toString())
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        org.junit.jupiter.api.Assertions.assertNotEquals(
                objectMapper.readTree(first).get("id").asLong(),
                objectMapper.readTree(second).get("id").asLong(),
                "Independent booking keys must create separate records");
        org.junit.jupiter.api.Assertions.assertEquals(countBefore + 2, bookingRepository.count(),
                "Two deliberate booking attempts must insert two separate rows");
    }


    @Test
    void allowsStagingFrontendBookingPreflightWithIdempotencyHeader() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options("/bookings")
                        .header("Origin", "https://vip-transfer-dalaman-test.onrender.com")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "content-type,idempotency-key"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Access-Control-Allow-Origin", "https://vip-transfer-dalaman-test.onrender.com"));
    }

}
