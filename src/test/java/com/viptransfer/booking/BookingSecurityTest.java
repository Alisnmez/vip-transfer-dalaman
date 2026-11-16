package com.viptransfer.booking;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {"app.admin.password=test-admin-password",
        "app.frontend.origin=https://vip-transfer-dalaman-test.onrender.com"})
@AutoConfigureMockMvc
class BookingSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    private String adminAuthorization() {
        String credentials = "admin:test-admin-password";
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void privateBookingEndpointsRejectAnonymousRequests() throws Exception {
        mockMvc.perform(get("/bookings")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/bookings/page")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/bookings/calendar").param("month", "2035-01")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/bookings/dashboard")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/bookings/1")).andExpect(status().isUnauthorized());
        mockMvc.perform(patch("/bookings/1/status").contentType("application/json")
                .content("{\"status\":\"CONFIRMED\"}")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/admin/auth-check")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminAuthenticationAndForbiddenActionsAreEnforced() throws Exception {
        mockMvc.perform(get("/admin/auth-check").header("Authorization", adminAuthorization()))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/admin/auth-check")
                .header("Authorization", "Basic " + Base64.getEncoder()
                        .encodeToString("admin:incorrect".getBytes(StandardCharsets.UTF_8))))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/bookings/1").header("Authorization", adminAuthorization()))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/bookings/support/lookup").header("Authorization", adminAuthorization()))
                .andExpect(status().isForbidden());
    }

    @Test
    void invalidCalendarMonthIsRejectedBeforeDatabaseLookup() throws Exception {
        mockMvc.perform(get("/bookings/calendar").param("month", "2035-99")
                .header("Authorization", adminAuthorization())).andExpect(status().isBadRequest());
    }
}
