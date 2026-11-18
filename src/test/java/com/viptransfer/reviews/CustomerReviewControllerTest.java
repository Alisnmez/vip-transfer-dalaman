package com.viptransfer.reviews;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;

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
        mvc.perform(get("/reviews?page=0")).andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
        mvc.perform(get("/reviews/moderation")).andExpect(status().isUnauthorized());

        CustomerReview review = repository.findByStatus("PENDING", PageRequest.of(0, 10)).getContent().get(0);
        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"APPROVED\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("APPROVED"));
        mvc.perform(get("/reviews?page=0")).andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].name").value("Sample passenger"));
    }

    @Test
    void rejectedReviewNeverAppearsPublicly() throws Exception {
        mvc.perform(post("/reviews").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Rejected passenger\",\"rating\":2,\"comment\":\"The pickup was not on time.\",\"publicationConsent\":true}"))
            .andExpect(status().isAccepted());
        CustomerReview review = repository.findByStatus("PENDING", PageRequest.of(0, 10)).getContent().get(0);
        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"REJECTED\"}"))
            .andExpect(status().isOk());
        mvc.perform(get("/reviews?page=0")).andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
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
    @Test
    void adminCanArchivePublishedReviewAndRestoreIt() throws Exception {
        CustomerReview review = new CustomerReview();
        review.customerName = "Archive passenger";
        review.rating = 5;
        review.comment = "The journey was comfortable and on time.";
        review.status = "APPROVED";
        repository.saveAndFlush(review);

        mvc.perform(get("/reviews/moderation?page=0&status=APPROVED"))
            .andExpect(status().isUnauthorized());
        mvc.perform(get("/reviews/moderation?page=0&status=APPROVED")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].customerName").value("Archive passenger"));

        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"ARCHIVED\"}"))
            .andExpect(status().isOk());
        mvc.perform(get("/reviews?page=0")).andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());

        mvc.perform(get("/reviews/moderation?page=0&status=ARCHIVED")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].customerName").value("Archive passenger"));

        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"APPROVED\"}"))
            .andExpect(status().isOk());
        mvc.perform(get("/reviews?page=0")).andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].name").value("Archive passenger"))
            .andExpect(jsonPath("$.content[0].createdAt").exists());
    }

    @Test
    void legacyClientsStillReceiveArraysWhileNewClientsReceivePages() throws Exception {
        mvc.perform(get("/reviews")).andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
        mvc.perform(get("/reviews?page=0")).andExpect(status().isOk()).andExpect(jsonPath("$.content").isArray());
        mvc.perform(get("/reviews/moderation?status=PENDING")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword")))
            .andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
        mvc.perform(get("/reviews/moderation?status=PENDING&page=0")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void cannotRestoreReviewThatWasNeverArchived() throws Exception {
        CustomerReview review = new CustomerReview();
        review.customerName = "Rejected passenger";
        review.rating = 2;
        review.comment = "A valid review that was rejected.";
        review.status = "REJECTED";
        repository.saveAndFlush(review);

        mvc.perform(patch("/reviews/" + review.id + "/moderation")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic("testadmin", "testpassword"))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"APPROVED\"}"))
            .andExpect(status().isConflict());
    }

}
