package com.viptransfer.email;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
@EnableConfigurationProperties(EmailSettings.class)
class EmailConfiguration { }

@ConfigurationProperties(prefix = "app.email")
public record EmailSettings(boolean enabled, String apiKey, String from, String replyTo, String operator, String provider) {
    public EmailSettings {
        if (enabled && (("resend".equals(provider) && (apiKey == null || apiKey.isBlank())) || from == null || from.isBlank()
                || replyTo == null || replyTo.isBlank())) {
            throw new IllegalArgumentException("Email requires API key, verified sender and monitored reply-to.");
        }
    }
    // Never let an exception or debug log disclose credentials.
    @Override public String toString() { return "EmailSettings[enabled=" + enabled + "]"; }
}
