package com.viptransfer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Security regression tests independent of the booking database.
 * No booking controller is loaded, so authorized requests reach MVC and return 404.
 */
@WebMvcTest(controllers = AdminAuthController.class, properties = {
        "app.admin.username=testadmin",
        "app.admin.password=test-password",
        "app.frontend.origin=https://dalamanway.com"
})
@Import(SecurityConfig.class)
class AdminMutationCsrfTest {
    @Autowired MockMvc mvc;

    @Test
    void explicitlyAuthenticatedPatchPassesCsrfFilter() throws Exception {
        mvc.perform(patch("/bookings/16/status")
                .with(httpBasic("testadmin", "test-password"))
                .header("X-Admin-Request", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void basicAuthenticationAloneDoesNotBypassCsrf() throws Exception {
        mvc.perform(patch("/bookings/16/status")
                .with(httpBasic("testadmin", "test-password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void customHeaderAloneDoesNotBypassCsrf() throws Exception {
        mvc.perform(patch("/bookings/16/status")
                .header("X-Admin-Request", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void otherOriginsCannotSendAdminCustomHeader() throws Exception {
        mvc.perform(patch("/bookings/16/status")
                .with(httpBasic("testadmin", "test-password"))
                .header("Origin", "https://attacker.example")
                .header("X-Admin-Request", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isForbidden());
    }
}
