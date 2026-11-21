package com.viptransfer.email;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viptransfer.booking.Booking;
import com.viptransfer.booking.BookingManagementRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/** Queue inside the booking transaction; delivery never runs on the customer's request thread. */
@Service
public class BookingEmails {
    private final JdbcTemplate jdbc;
    private final ObjectMapper json;
    private final EmailSettings settings;

    public BookingEmails(JdbcTemplate jdbc, ObjectMapper json, EmailSettings settings) {
        this.jdbc = jdbc; this.json = json; this.settings = settings;
    }

    public void queue(Booking booking, String event) {
        if (!settings.enabled()) return;
        // Suppress synthetic/special-use recipients; never send these tests to the operator either.
        String email = booking.getEmail();
        if (email == null || email.isBlank() || email.toLowerCase(java.util.Locale.ROOT).endsWith(".invalid")) return;
        String description = switch (event) {
            case "RECEIVED" -> "Your booking request was received. It is PENDING and is not yet confirmed.";
            case "CONFIRMED" -> "Your transfer booking has been confirmed by the operator.";
            case "CANCELLED" -> "Your booking has been cancelled by the operator.";
            case "PENDING" -> "Your booking is now pending operator confirmation.";
            case "COMPLETED" -> "Thank you for travelling with DalamanWay. We hope you enjoyed a comfortable journey and look forward to welcoming you again.";
            default -> throw new IllegalArgumentException("Unsupported booking email event.");
        };
        String details = "Booking reference: #" + booking.getId()
                + "\nPickup: " + booking.getPickUpLocation()
                + "\nDestination: " + booking.getDropOffLocation()
                + "\nPickup time (Turkey local time): " + booking.getTransferDateTime()
                + (booking.getReturnDateTime() == null ? "" : "\nReturn time (Turkey local time): " + booking.getReturnDateTime())
                + "\nPassengers: " + booking.getPassengerCount()
                + "\nPublished fare: GBP " + booking.getPrice().toPlainString();
        String text = "DalamanWay\n\n" + description + "\n\n" + details
                + "\n\nNo online payment has been collected. Payment terms are confirmed by the operator."
                + "\nFor questions, reply to this email quoting your booking reference.\nhttps://dalamanway.com";
        String subject = switch (event) {
            case "RECEIVED" -> "We received your transfer request";
            case "CONFIRMED" -> "Your airport transfer is confirmed";
            case "CANCELLED" -> "Your transfer booking has been cancelled";
            case "PENDING" -> "Update: your booking is awaiting confirmation";
            case "COMPLETED" -> "Thank you for travelling with DalamanWay";
            default -> throw new IllegalArgumentException("Unsupported booking email event.");
        };
        enqueue(booking.getId(), event, email, "DalamanWay | " + subject + " (#" + booking.getId() + ")", text, customerHtml(booking, event, description).replace("DETAIL_CHANGES", ""));
        if (settings.operator() != null && !settings.operator().isBlank()) {
            enqueue(booking.getId(), event, settings.operator(), "[Operator] DalamanWay #" + booking.getId() + " — " + event,
                    description + "\n\n" + details + "\nReview details in the admin panel: https://dalamanway.com/admin/bookings/" + booking.getId(), null);
        }
    }

    /** Customer request receipts and operator alerts use the existing transactional outbox. */
    public void queueManagementRequest(Booking booking, BookingManagementRequest request) {
        if (!settings.enabled()) return;
        String kind = "CHANGE".equals(request.getRequestType()) ? "change" : "cancellation";
        String event = "MANAGEMENT_REQUEST";
        String customerText = "DalamanWay\n\nWe received your " + kind + " request for booking #" + booking.getId()
                + ". Your booking has not been changed or cancelled. Please wait for our written confirmation.\n\n"
                + "Request: " + request.getMessage()
                + "\n\nIf you did not send this request, contact us by replying to this email.\nhttps://dalamanway.com/booking/lookup";
        String email = booking.getEmail();
        if (email != null && !email.isBlank() && !email.toLowerCase(Locale.ROOT).endsWith(".invalid")) {
            enqueue(booking.getId(), event, email,
                    "DalamanWay | We received your booking " + kind + " request (#" + booking.getId() + ")",
                    customerText, null);
        }
        if (settings.operator() != null && !settings.operator().isBlank()) {
            String operatorText = "New " + kind + " request received in Manage My Booking.\n\n"
                    + "Request ID: " + request.getId()
                    + "\nBooking reference: #" + booking.getId()
                    + "\nCustomer: " + booking.getCustomerName()
                    + "\nCustomer email: " + booking.getEmail()
                    + "\nPhone: " + booking.getPhoneNumber()
                    + "\nJourney: " + booking.getPickUpLocation() + " → " + booking.getDropOffLocation()
                    + "\nPickup time (Türkiye): " + booking.getTransferDateTime()
                    + "\n\nCustomer's request:\n" + request.getMessage()
                    + "\n\nReview and update the request in the admin panel: https://dalamanway.com/admin/management-requests";
            enqueue(booking.getId(), event, settings.operator(),
                    "[Manage booking] " + kind + " request #" + request.getId() + " for booking #" + booking.getId(),
                    operatorText, null);
        }
    }

    /** Notify the customer when an operator declines or resolves a change request. */
    public void queueManagementRequestDecision(Booking booking, BookingManagementRequest request) {
        if (!settings.enabled() || booking.getEmail() == null || booking.getEmail().isBlank()
                || booking.getEmail().toLowerCase(Locale.ROOT).endsWith(".invalid")) return;
        String result = "DECLINED".equals(request.getStatus()) ? "could not be approved" : "has been handled";
        String message = "Your " + ("CHANGE".equals(request.getRequestType()) ? "change" : "cancellation")
                + " request for booking #" + booking.getId() + " " + result + ".";
        if (request.getAdminNote() != null && !request.getAdminNote().isBlank()) {
            message += "\n\nMessage from our team: " + request.getAdminNote();
        }
        message += "\n\nCurrent booking status: " + booking.getStatus()
                + ". If a change was approved, please review the updated booking email.\n"
                + "https://dalamanway.com/booking/lookup";
        enqueue(booking.getId(), "MANAGEMENT_DECISION", booking.getEmail(),
                "DalamanWay | Update on booking request #" + request.getId(), message, null);
    }


    /** Notify only when customer-facing journey details change, with a before/after summary. */
    public void queueUpdated(Booking booking, String changes) {
        if (!settings.enabled() || booking.getEmail() == null || booking.getEmail().isBlank()
                || booking.getEmail().toLowerCase(Locale.ROOT).endsWith(".invalid")) return;
        String description = "Your transfer details have been updated. Please review the changes below. "
                + "If you did not request this change, reply to this email.";
        String text = "DalamanWay\n\n" + description + "\n\nChanges:\n" + changes
                + "\n\nBooking reference: #" + booking.getId()
                + "\nNo online payment has been collected. Payment arrangements are confirmed by our team.";
        String html = customerHtml(booking, "UPDATED", description)
                .replace("DETAIL_CHANGES", "<div style='white-space:pre-line;padding:14px;background:#f1f5f9;color:#1E3A5F;font-size:14px'>"
                        + escape(changes).replace("\n", "<br>") + "</div>");
        enqueue(booking.getId(), "UPDATED", booking.getEmail(),
                "DalamanWay | Your transfer details have been updated (#" + booking.getId() + ")", text, html);
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEE, d MMM yyyy 'at' HH:mm", Locale.UK);

    private static String escape(String value) {
        if (value == null) return "—";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }

    private static String row(String label, String value) {
        return "<tr><td style='padding:10px 0;color:#64748b;font-size:13px;vertical-align:top;width:38%'>"
                + escape(label) + "</td><td style='padding:10px 0;color:#1E3A5F;font-size:14px;font-weight:600;vertical-align:top'>"
                + escape(value) + "</td></tr>";
    }

    private static String customerHtml(Booking booking, String event, String description) {
        String headline = switch (event) {
            case "RECEIVED" -> "We've received your request";
            case "CONFIRMED" -> "Your transfer is confirmed";
            case "CANCELLED" -> "Your booking has been cancelled";
            case "PENDING" -> "Your booking is awaiting confirmation";
            case "COMPLETED" -> "Thank you for travelling with us";
            case "UPDATED" -> "Your transfer details have been updated";
            default -> throw new IllegalArgumentException("Unsupported booking email event.");
        };
        String status = "RECEIVED".equals(event) ? "PENDING" : event;
        String statusColor = switch (status) {
            case "CONFIRMED", "COMPLETED", "UPDATED" -> "#087F69";
            case "CANCELLED" -> "#B42318";
            default -> "#A16207";
        };
        String rows = row("Booking reference", "#" + booking.getId())
                + row("Pick-up", booking.getPickUpLocation())
                + row("Destination", booking.getDropOffLocation())
                + row("Pick-up date & time", booking.getTransferDateTime().format(DATE_FORMAT) + " (Türkiye time)")
                + (booking.getReturnDateTime() == null ? "" :
                    row("Return date & time", booking.getReturnDateTime().format(DATE_FORMAT) + " (Türkiye time)"))
                + row("Passengers", String.valueOf(booking.getPassengerCount()))
                + row("Quoted fare", "£" + booking.getPrice().setScale(2, java.math.RoundingMode.HALF_UP).toPlainString());
        return """
                <!doctype html><html lang="en"><head><meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,Helvetica,sans-serif;color:#1E3A5F">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F8FAFC">
                <tr><td align="center" style="padding:32px 14px">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0">
                <tr><td style="background:#1E3A5F;padding:27px 32px">
                <div style="font-size:27px;line-height:1.2;font-weight:700;color:#fff;letter-spacing:-.5px">Dalaman<span style="color:#55C6B6">Way</span></div>
                <div style="font-size:10px;letter-spacing:2px;color:#d8e8f1;margin-top:7px">PRIVATE AIRPORT TRANSFERS</div>
                </td></tr><tr><td style="padding:32px">
                <div style="display:inline-block;padding:7px 12px;border-radius:20px;background:#f1f5f9;color:STATUS_COLOR;font-size:12px;font-weight:700;letter-spacing:1px">STATUS_TEXT</div>
                <h1 style="font-size:25px;line-height:1.3;margin:20px 0 12px;color:#1E3A5F">HEADLINE_TEXT</h1>
                <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 24px">DESCRIPTION_TEXT</p>
                DETAIL_CHANGES<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">DETAIL_ROWS</table>
                <p style="font-size:13px;line-height:1.7;color:#64748b;margin:24px 0 0">No online payment has been collected. Payment arrangements are confirmed by our team.</p>
                <p style="font-size:14px;line-height:1.7;color:#475569;margin:16px 0 0">Need help? Simply reply to this email and include your booking reference.</p>
                <p style="margin:24px 0 0"><a href="https://dalamanway.com" style="display:inline-block;background:#2A9D8F;color:#fff;text-decoration:none;padding:13px 22px;border-radius:7px;font-size:14px;font-weight:700">Visit DalamanWay</a></p>
                </td></tr><tr><td style="background:#f1f5f9;padding:22px 32px;text-align:center;color:#64748b;font-size:12px;line-height:1.7">
                DalamanWay · Private Airport Transfers<br>Thank you for choosing us for your journey.
                </td></tr></table></td></tr></table></body></html>
                """.replace("STATUS_COLOR", statusColor).replace("STATUS_TEXT", escape(status))
                .replace("HEADLINE_TEXT", escape(headline)).replace("DESCRIPTION_TEXT", escape(description))
                .replace("DETAIL_ROWS", rows);
    }

    private void enqueue(Long bookingId, String event, String recipient, String subject, String text, String html) {
        var payload = new LinkedHashMap<String, Object>();
        payload.put("from", settings.from()); payload.put("to", List.of(recipient));
        payload.put("reply_to", settings.replyTo()); payload.put("subject", subject); payload.put("text", text);
        if (html != null) payload.put("html", html);
        try {
            Instant now = Instant.now();
            jdbc.update("""
                    INSERT INTO booking_email_outbox
                    (id, booking_id, event_type, payload, status, attempts, created_at, next_attempt_at, expires_at)
                    VALUES (?, ?, ?, ?, 'PENDING', 0, ?, ?, ?)
                    """, UUID.randomUUID(), bookingId, event, json.writeValueAsString(payload),
                    java.sql.Timestamp.from(now), java.sql.Timestamp.from(now), java.sql.Timestamp.from(now.plus(23, ChronoUnit.HOURS)));
        } catch (JsonProcessingException error) {
            throw new IllegalStateException("Could not serialize booking notification.");
        }
    }
}
