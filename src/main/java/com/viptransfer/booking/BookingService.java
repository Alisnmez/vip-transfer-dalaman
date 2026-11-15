package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import com.viptransfer.exception.BookingNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TransferPricingService transferPricingService;

    public BookingService(BookingRepository bookingRepository, TransferPricingService transferPricingService) {
        this.bookingRepository = bookingRepository;
        this.transferPricingService = transferPricingService;
    }

    public Booking createBooking(BookingRequestDto dto) {
        Booking booking = new Booking();
        booking.setCustomerName(dto.getCustomerName());
        booking.setPassengerCount(dto.getPassengerCount());
        booking.setPickUpLocation(dto.getPickUpLocation());
        booking.setDropOffLocation(dto.getDropOffLocation());
        validateSchedule(dto);
        booking.setTransferDateTime(dto.getTransferDateTime());
        booking.setReturnDateTime(dto.getReturnDateTime());
        booking.setPhoneNumber(dto.getPhoneNumber());
        booking.setEmail(dto.getEmail());
        booking.setTransferAddress(dto.getTransferAddress());
        booking.setSpecialRequests(dto.getSpecialRequests());
        booking.setVehicleId(dto.getVehicleId());
        booking.setTripType(dto.getTripType());
        booking.setPrice(transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(), dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount()));

        return bookingRepository.save(booking);
    }

    private void validateSchedule(BookingRequestDto dto) {
        if (!"one-way".equals(dto.getTripType()) && !"round-trip".equals(dto.getTripType())) {
            throw new IllegalArgumentException("Invalid trip type.");
        }
        if ("round-trip".equals(dto.getTripType())) {
            if (dto.getReturnDateTime() == null || !dto.getReturnDateTime().isAfter(dto.getTransferDateTime())) {
                throw new IllegalArgumentException("Return date and time must be after outbound pickup.");
            }
        } else if (dto.getReturnDateTime() != null) {
            throw new IllegalArgumentException("One-way transfers cannot have a return date.");
        }
    }

    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBooking(Long id, BookingRequestDto dto) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));

        existingBooking.setCustomerName(dto.getCustomerName());
        existingBooking.setPassengerCount(dto.getPassengerCount());
        existingBooking.setPickUpLocation(dto.getPickUpLocation());
        existingBooking.setDropOffLocation(dto.getDropOffLocation());
        validateSchedule(dto);
        existingBooking.setTransferDateTime(dto.getTransferDateTime());
        existingBooking.setReturnDateTime(dto.getReturnDateTime());
        existingBooking.setPhoneNumber(dto.getPhoneNumber());
        existingBooking.setEmail(dto.getEmail());
        existingBooking.setTransferAddress(dto.getTransferAddress());
        existingBooking.setSpecialRequests(dto.getSpecialRequests());
        existingBooking.setVehicleId(dto.getVehicleId());
        existingBooking.setTripType(dto.getTripType());
        existingBooking.setPrice(transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(), dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount()));

        return bookingRepository.save(existingBooking);
    }

    public String deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new BookingNotFoundException(id);
        }
        bookingRepository.deleteById(id);
        return "Booking with ID " + id + " has been successfully deleted.";
    }
}