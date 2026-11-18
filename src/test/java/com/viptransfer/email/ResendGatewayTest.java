package com.viptransfer.email;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class ResendGatewayTest {
    @Test void sendsImmutableJsonAndIdempotencyHeader() {
        var builder = RestClient.builder().baseUrl("https://api.resend.com");
        var server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(header("Idempotency-Key", "booking-email-event-1"))
                .andExpect(content().json("{\"to\":[\"customer@example.com\"]}"))
                .andRespond(withSuccess("{\"id\":\"provider-id\"}", MediaType.APPLICATION_JSON));
        assertEquals("provider-id", new ResendGateway(builder.build()).send("event-1", "{\"to\":[\"customer@example.com\"]}"));
        server.verify();
    }
    @Test void classifiesProviderFailuresWithoutLeakingResponseBodies() {
        for (HttpStatus status : new HttpStatus[]{HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.TOO_MANY_REQUESTS, HttpStatus.INTERNAL_SERVER_ERROR}) {
            var builder = RestClient.builder().baseUrl("https://api.resend.com");
            var server = MockRestServiceServer.bindTo(builder).build();
            server.expect(requestTo("https://api.resend.com/emails")).andRespond(withStatus(status)
                    .body("private provider details").contentType(MediaType.APPLICATION_JSON));
            var failure = assertThrows(ResendGateway.DeliveryFailure.class, () -> new ResendGateway(builder.build()).send("id", "{}"));
            assertEquals("HTTP_" + status.value(), failure.getMessage());
            assertEquals(status.value() == 429 || status.value() >= 500, failure.retryable);
        }
    }
    @Test void networkFailuresAndInvalidSuccessResponsesAreRetryable() {
        var builder = RestClient.builder().baseUrl("https://api.resend.com");
        var server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo("https://api.resend.com/emails")).andRespond(withException(new java.net.SocketTimeoutException()));
        var failure = assertThrows(ResendGateway.DeliveryFailure.class, () -> new ResendGateway(builder.build()).send("id", "{}"));
        assertTrue(failure.retryable); assertEquals("NETWORK", failure.getMessage());
    }
}
