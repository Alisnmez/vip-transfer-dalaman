package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingManagementRequestDto;
import com.viptransfer.booking.dto.BookingManagementRequestUpdateDto;
import com.viptransfer.booking.dto.BookingManagementRequestView;
import com.viptransfer.email.BookingEmails;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingManagementRequestService {
    private static final String PUBLIC_MESSAGE = "If the booking reference and email match, we have recorded your request and will email the address on the booking. Your booking remains unchanged until we confirm the outcome in writing.";
    private final BookingRepository bookingRepository;
    private final BookingManagementRequestRepository requestRepository;
    private final BookingEmails bookingEmails;

    public BookingManagementRequestService(BookingRepository bookingRepository,
                                           BookingManagementRequestRepository requestRepository,
                                           BookingEmails bookingEmails) {
        this.bookingRepository = bookingRepository;
        this.requestRepository = requestRepository;
        this.bookingEmails = bookingEmails;
    }

    @Transactional
    public Map<String, String> submit(BookingManagementRequestDto dto, String idempotencyKey) {
        if (idempotencyKey == null || !idempotencyKey.matches("[A-Za-z0-9_-]{16,64}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request key.");
        }
        if (requestRepository.findByIdempotencyKey(idempotencyKey).isPresent()) {
            return Map.of("message", PUBLIC_MESSAGE);
        }

        Long bookingId = BookingReference.toId(dto.getBookingReference());
        if (bookingId == null) return Map.of("message", PUBLIC_MESSAGE);

        Booking booking = bookingRepository.findByIdForUpdate(bookingId).orElse(null);
        if (requestRepository.findByIdempotencyKey(idempotencyKey).isPresent()) {
            return Map.of("message", PUBLIC_MESSAGE);
        }
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Europe/Istanbul"));
        boolean hasUpcomingLeg = booking != null && (
                (booking.getTransferDateTime() != null && booking.getTransferDateTime().isAfter(now))
                        || (booking.getReturnDateTime() != null && booking.getReturnDateTime().isAfter(now)));
        if (booking == null || booking.getEmail() == null
                || !booking.getEmail().strip().equalsIgnoreCase(dto.getEmail().strip())
                || !Set.of("PENDING", "CONFIRMED").contains(booking.getStatus() == null ? "PENDING" : booking.getStatus())
                || !hasUpcomingLeg) {
            // Keep the public response identical so booking references cannot be enumerated.
            return Map.of("message", PUBLIC_MESSAGE);
        }
        if (requestRepository.existsByBookingIdAndStatusIn(bookingId, List.of("NEW", "IN_PROGRESS"))) {
            return Map.of("message", PUBLIC_MESSAGE);
        }

        BookingManagementRequest request = new BookingManagementRequest();
        request.setBookingId(bookingId);
        request.setRequestType(dto.getRequestType());
        request.setMessage(dto.getMessage().strip());
        request.setStatus("NEW");
        request.setIdempotencyKey(idempotencyKey);
        BookingManagementRequest saved = requestRepository.saveAndFlush(request);
        bookingEmails.queueManagementRequest(booking, saved);
        return Map.of("message", PUBLIC_MESSAGE);
    }

    @Transactional(readOnly = true)
    public List<BookingManagementRequestView> list(String statusFilter) {
        List<BookingManagementRequest> requests;
        if (statusFilter == null || statusFilter.isBlank() || "ALL".equals(statusFilter)) {
            requests = requestRepository.findAllByOrderByCreatedAtDesc();
        } else {
            if (!Set.of("NEW", "IN_PROGRESS", "RESOLVED", "DECLINED").contains(statusFilter)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request status filter.");
            }
            requests = requestRepository.findByStatusOrderByCreatedAtDesc(statusFilter);
        }
        Map<Long, Booking> bookings = bookingRepository.findAllById(
                        requests.stream().map(BookingManagementRequest::getBookingId).distinct().toList())
                .stream().collect(Collectors.toMap(Booking::getId, booking -> booking));
        return requests.stream().map(request -> {
            Booking booking = bookings.get(request.getBookingId());
            return new BookingManagementRequestView(request.getId(), request.getBookingId(),
                    request.getRequestType(), request.getMessage(), request.getStatus(), request.getAdminNote(),
                    request.getCreatedAt(), request.getUpdatedAt(),
                    booking == null ? "Unavailable" : booking.getCustomerName(),
                    booking == null ? "Unavailable" : booking.getEmail(),
                    booking == null ? "Unavailable" : booking.getPickUpLocation(),
                    booking == null ? "Unavailable" : booking.getDropOffLocation(),
                    booking == null ? null : booking.getTransferDateTime(),
                    booking == null ? null : booking.getReturnDateTime(),
                    booking == null ? "Unavailable" : booking.getStatus());
        }).toList();
    }

    @Transactional
    public BookingManagementRequestView update(Long id, BookingManagementRequestUpdateDto dto) {
        BookingManagementRequest request = requestRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking request not found."));
        String current = request.getStatus();
        String next = dto.getStatus();
        if (current.equals("RESOLVED") || current.equals("DECLINED")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This request is already closed.");
        }
        if ("RESOLVED".equals(next) && "CANCEL".equals(request.getRequestType())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Use the cancel-booking action to resolve a cancellation request.");
        }
        request.setStatus(next);
        request.setAdminNote(normalizeNote(dto.getAdminNote()));
        BookingManagementRequest saved = requestRepository.saveAndFlush(request);
        if ("RESOLVED".equals(next) || "DECLINED".equals(next)) {
            Booking booking = bookingRepository.findById(saved.getBookingId()).orElse(null);
            if (booking != null) bookingEmails.queueManagementRequestDecision(booking, saved);
        }
        return view(saved);
    }

    @Transactional
    public BookingManagementRequestView cancelBookingAndResolve(Long requestId, String adminNote) {
        BookingManagementRequest request = requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking request not found."));
        if (!"CANCEL".equals(request.getRequestType())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This is not a cancellation request.");
        }
        if ("RESOLVED".equals(request.getStatus())) return view(request);
        if ("DECLINED".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This request has already been declined.");
        }
        Booking booking = bookingRepository.findByIdForUpdate(request.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        String bookingStatus = booking.getStatus() == null ? "PENDING" : booking.getStatus();
        if ("COMPLETED".equals(bookingStatus)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A completed transfer cannot be cancelled.");
        }
        if (!"CANCELLED".equals(bookingStatus)) {
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
            bookingEmails.queue(booking, "CANCELLED");
        }
        request.setStatus("RESOLVED");
        request.setAdminNote(normalizeNote(adminNote));
        BookingManagementRequest saved = requestRepository.saveAndFlush(request);
        return view(saved);
    }

    private BookingManagementRequestView view(BookingManagementRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId()).orElse(null);
        return new BookingManagementRequestView(request.getId(), request.getBookingId(),
                request.getRequestType(), request.getMessage(), request.getStatus(), request.getAdminNote(),
                request.getCreatedAt(), request.getUpdatedAt(),
                booking == null ? "Unavailable" : booking.getCustomerName(),
                booking == null ? "Unavailable" : booking.getEmail(),
                booking == null ? "Unavailable" : booking.getPickUpLocation(),
                booking == null ? "Unavailable" : booking.getDropOffLocation(),
                booking == null ? null : booking.getTransferDateTime(),
                booking == null ? null : booking.getReturnDateTime(),
                booking == null ? "Unavailable" : booking.getStatus());
    }

    private static String normalizeNote(String note) {
        if (note == null || note.isBlank()) return null;
        String trimmed = note.strip();
        if (trimmed.length() > 2000) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The operator note is too long.");
        return trimmed;
    }
}
