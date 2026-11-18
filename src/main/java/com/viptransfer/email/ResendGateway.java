package com.viptransfer.email;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;

@Component
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.email.provider", havingValue = "resend", matchIfMissing = true)
public class ResendGateway implements EmailGateway {
    private final RestClient client;

    @org.springframework.beans.factory.annotation.Autowired
    public ResendGateway(EmailSettings settings) {
        var factory = new JdkClientHttpRequestFactory(HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3)).build());
        factory.setReadTimeout(Duration.ofSeconds(8));
        this.client = RestClient.builder().baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + (settings.apiKey() == null ? "" : settings.apiKey()))
                .requestFactory(factory)
                .build();
    }
    ResendGateway(RestClient client) { this.client = client; }

    public String send(String eventId, String payload) {
        try {
            Map<?, ?> response = client.post().uri("/emails").header("Idempotency-Key", "booking-email-" + eventId)
                    .contentType(MediaType.APPLICATION_JSON).body(payload).retrieve().body(Map.class);
            if (response == null || !(response.get("id") instanceof String id) || id.isBlank())
                throw new DeliveryFailure("INVALID_RESPONSE", true);
            return id;
        } catch (RestClientResponseException error) {
            int code = error.getStatusCode().value();
            boolean retry = code == 429 || code >= 500 || (code == 409
                    && error.getResponseBodyAsString().contains("concurrent_idempotent_requests"));
            throw new DeliveryFailure("HTTP_" + code, retry);
        } catch (RestClientException error) {
            throw new DeliveryFailure("NETWORK", true);
        }
    }

}
