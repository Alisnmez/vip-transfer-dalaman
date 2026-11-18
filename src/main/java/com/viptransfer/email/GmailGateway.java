package com.viptransfer.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.nio.charset.StandardCharsets;

/** Authenticated Gmail SMTP over required STARTTLS. The normal Google password is never used. */
@Component
@ConditionalOnProperty(name = "app.email.provider", havingValue = "gmail")
public class GmailGateway implements EmailGateway {
    private static final String ACCOUNT = "dalamanway.booking@gmail.com";
    private final JavaMailSender sender;
    private final ObjectMapper json;

    @org.springframework.beans.factory.annotation.Autowired
    public GmailGateway(EmailSettings settings, ObjectMapper json,
                        @Value("${app.email.gmail-password:}") String appPassword) {
        if (settings.enabled() && appPassword.isBlank()) throw new IllegalArgumentException("Gmail requires an app password in the backend environment.");
        var smtp = new JavaMailSenderImpl();
        smtp.setHost("smtp.gmail.com"); smtp.setPort(587); smtp.setUsername(ACCOUNT);
        smtp.setPassword(appPassword.replace(" ", "")); smtp.setDefaultEncoding(StandardCharsets.UTF_8.name());
        var properties = smtp.getJavaMailProperties();
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");
        properties.setProperty("mail.smtp.starttls.required", "true");
        properties.setProperty("mail.smtp.ssl.checkserveridentity", "true");
        properties.setProperty("mail.smtp.connectiontimeout", "5000");
        properties.setProperty("mail.smtp.timeout", "8000");
        properties.setProperty("mail.smtp.writetimeout", "8000");
        this.sender = smtp; this.json = json;
    }
    GmailGateway(JavaMailSender sender, ObjectMapper json) { this.sender = sender; this.json = json; }

    public String send(String eventId, String payload) {
        try {
            Map<?, ?> data = json.readValue(payload, Map.class);
            var message = sender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            // Enforce authenticated identity rather than accepting an arbitrary From from old queue entries.
            helper.setFrom(ACCOUNT, "DalamanWay");
            var recipients = (java.util.List<?>) data.get("to");
            helper.setTo((String) recipients.getFirst());
            helper.setReplyTo((String) data.get("reply_to"));
            helper.setSubject((String) data.get("subject"));
            String html = (String) data.get("html");
            if (html != null && !html.isBlank()) helper.setText((String) data.get("text"), html);
            else helper.setText((String) data.get("text"), false);
            message.setHeader("X-DalamanWay-Event", eventId);
            sender.send(message);
            return message.getMessageID() == null ? "smtp-" + eventId : message.getMessageID();
        } catch (MailAuthenticationException error) {
            throw new DeliveryFailure("SMTP_AUTH", false);
        } catch (MailException error) {
            // SMTP has no provider idempotency API. An uncertain send must be reviewed, never blindly resent.
            throw new DeliveryFailure("SMTP_UNKNOWN", false);
        } catch (java.io.IOException | MessagingException | IllegalStateException error) {
            throw new DeliveryFailure("SMTP_MESSAGE", false);
        }
    }
}
