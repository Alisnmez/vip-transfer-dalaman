package com.viptransfer.reviews;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"app.admin.username=testadmin", "app.admin.password=testpassword"})
@AutoConfigureMockMvc
@Transactional
class CustomerReviewControllerTest {
    @Autowired MockMvc mvc;
    @Autowired CustomerReviewRepository repository;

    @Test
    void pendingReviewsArePrivateUntilAdminApproves() throws Exception {
        String payload = "{\"name\":\"Sample passenger\",\"rating\":5,\"comment\":\"The driver was punctual and helpful.\",\"publicationConsent\":true}";
        mvc.perform(post("/reviews").contentType(MediaType.APPLICATION_JSON).content(payload))
            .andExpect(status().isAccepted());
        mvc.perform(get("/reviews")).andExpect(status().isOk()).andExpect(content().json("[]"));
        mvc.perform(get("/reviews/moderation")).andExpect(status().isUnauthorized());

        CustomerReview review = repository.findByStatusOrderByCreatedAtDesc("PENDING").get(0);
        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"APPROVED\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("APPROVED"));
        mvc.perform(get("/reviews")).andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Sample passenger"));
    }

    @Test
    void rejectedReviewNeverAppearsPublicly() throws Exception {
        mvc.perform(post("/reviews").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Rejected passenger\",\"rating\":2,\"comment\":\"The pickup was not on time.\",\"publicationConsent\":true}"))
            .andExpect(status().isAccepted());
        CustomerReview review = repository.findByStatusOrderByCreatedAtDesc("PENDING").get(0);
        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"REJECTED\"}"))
            .andExpect(status().isOk());
        mvc.perform(get("/reviews")).andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test
    void anonymousUserCannotModerateReviews() throws Exception {
        mvc.perform(patch("/reviews/123/moderation").contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"APPROVED\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsReviewWithoutPublicationConsent() throws Exception {
        mvc.perform(post("/reviews").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Passenger\",\"rating\":5,\"comment\":\"A valid length comment.\",\"publicationConsent\":false}"))
            .andExpect(status().isBadRequest());
    }
}
