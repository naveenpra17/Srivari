package com.motors.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class BrevoEmailSender {

    private final RestClient restClient;
    private final String apiKey;

    public BrevoEmailSender(@Value("${app.mail.brevo.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public void sendHtmlEmail(String fromEmail, String fromName, String toEmail, String subject, String htmlContent) {
        if (!isConfigured()) {
            throw new IllegalStateException("Brevo API key is not configured");
        }

        Map<String, Object> payload = Map.of(
                "sender", Map.of(
                        "email", fromEmail,
                        "name", fromName
                ),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "htmlContent", htmlContent
        );

        try {
            restClient.post()
                    .uri("/smtp/email")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-key", apiKey)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Brevo notification email sent: {}", subject);
        } catch (RestClientResponseException e) {
            log.warn("Brevo API error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        }
    }
}
