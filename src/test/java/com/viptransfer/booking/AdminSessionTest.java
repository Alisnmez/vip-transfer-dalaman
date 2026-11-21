package com.viptransfer.booking;

import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {"app.admin.password=test-admin-password"})
@AutoConfigureMockMvc
class AdminSessionTest {
    @Autowired MockMvc mvc;

    private String basic() {
        return "Basic " + Base64.getEncoder().encodeToString(
                "admin:test-admin-password".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void sessionSurvivesNewRequestAndLogoutRevokesIt() throws Exception {
        var login = mvc.perform(post("/admin/session/login").header("Authorization", basic()))
                .andExpect(status().isNoContent()).andReturn();
        HttpSession session = login.getRequest().getSession(false);
        org.junit.jupiter.api.Assertions.assertNotNull(session);
        MockHttpSession saved = (MockHttpSession) session;

        mvc.perform(get("/admin/auth-check").session(saved)).andExpect(status().isNoContent());
        var csrf = mvc.perform(get("/admin/session/csrf").session(saved))
                .andExpect(status().isOk()).andReturn();
        String token = new com.fasterxml.jackson.databind.ObjectMapper()
                .readTree(csrf.getResponse().getContentAsString()).get("token").asText();
        mvc.perform(post("/admin/session/logout").session(saved).header("X-CSRF-TOKEN", token))
                .andExpect(status().isNoContent());
        mvc.perform(get("/admin/auth-check")).andExpect(status().isUnauthorized());
    }

    @Test
    void loginRejectsInvalidPassword() throws Exception {
        mvc.perform(post("/admin/session/login").header("Authorization", "Basic " +
                Base64.getEncoder().encodeToString("admin:wrong".getBytes(StandardCharsets.UTF_8))))
                .andExpect(status().isUnauthorized());
    }
}
