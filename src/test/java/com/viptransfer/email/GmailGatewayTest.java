package com.viptransfer.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.Properties;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GmailGatewayTest {
    private static final String PAYLOAD = """
            {"from":"untrusted@example.com","to":["customer@example.com"],
            "reply_to":"dalamanway.booking@gmail.com","subject":"Booking received","text":"Pending confirmation."}
            """;

    @Test void usesOnlyTheAuthorizedGmailSenderAndKeepsRecipientsSeparate() throws Exception {
        JavaMailSender sender = mock(JavaMailSender.class);
        MimeMessage message = new MimeMessage(Session.getInstance(new Properties()));
        when(sender.createMimeMessage()).thenReturn(message);
        new GmailGateway(sender, new ObjectMapper()).send("event-1", PAYLOAD);
        verify(sender).send(message);
        assertEquals("DalamanWay <dalamanway.booking@gmail.com>", message.getFrom()[0].toString());
        assertEquals("dalamanway.booking@gmail.com", message.getReplyTo()[0].toString());
        assertEquals(1, message.getAllRecipients().length);
        assertEquals("customer@example.com", message.getAllRecipients()[0].toString());
        assertEquals("Pending confirmation.", message.getContent());
        assertEquals("event-1", message.getHeader("X-DalamanWay-Event", null));
    }
    @Test void htmlNotificationContainsPlainTextAndHtmlAlternatives() throws Exception {
        JavaMailSender sender = mock(JavaMailSender.class);
        MimeMessage message = new MimeMessage(Session.getInstance(new Properties()));
        when(sender.createMimeMessage()).thenReturn(message);
        String payload = """
                {"from":"dalamanway.booking@gmail.com","to":["customer@example.com"],
                "reply_to":"dalamanway.booking@gmail.com","subject":"Booking received",
                "text":"Pending confirmation.","html":"<h1>Booking received</h1>"}
                """;
        new GmailGateway(sender, new ObjectMapper()).send("event-html", payload);
        verify(sender).send(message);
        message.saveChanges();
        assertTrue(message.isMimeType("multipart/*"));
        java.io.ByteArrayOutputStream output = new java.io.ByteArrayOutputStream();
        message.writeTo(output);
        String mime = output.toString(java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(mime.contains("text/plain"));
        assertTrue(mime.contains("text/html"));

    }
    @Test void uncertainSmtpFailureIsNotAutomaticallyRetried() {
        JavaMailSender sender = mock(JavaMailSender.class);
        when(sender.createMimeMessage()).thenReturn(new MimeMessage(Session.getInstance(new Properties())));
        doThrow(new MailSendException("private details")).when(sender).send(any(MimeMessage.class));
        var error = assertThrows(EmailGateway.DeliveryFailure.class,
                () -> new GmailGateway(sender, new ObjectMapper()).send("event-1", PAYLOAD));
        assertEquals("SMTP_UNKNOWN", error.getMessage()); assertFalse(error.retryable);
    }
    @Test void authenticationFailureNeverLeaksCredentialsOrProviderText() {
        JavaMailSender sender = mock(JavaMailSender.class);
        when(sender.createMimeMessage()).thenReturn(new MimeMessage(Session.getInstance(new Properties())));
        doThrow(new MailAuthenticationException("secret")).when(sender).send(any(MimeMessage.class));
        var error = assertThrows(EmailGateway.DeliveryFailure.class,
                () -> new GmailGateway(sender, new ObjectMapper()).send("event-1", PAYLOAD));
        assertEquals("SMTP_AUTH", error.getMessage()); assertFalse(error.retryable);
    }
}
