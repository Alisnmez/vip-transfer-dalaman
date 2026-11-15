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
        booking.setTransferDateTime(dto.getTransferDateTime());
        booking.setPhoneNumber(dto.getPhoneNumber());
        booking.setEmail(dto.getEmail());
        booking.setVehicleId(dto.getVehicleId());
        booking.setTripType(dto.getTripType());
        booking.setPrice(transferPricingService.calculatePrice(dto.getPickUpLocation(), dto.getDropOffLocation(), dto.getVehicleId(), dto.getTripType(), dto.getPassengerCount()));

        return bookingRepository.save(booking);
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
        existingBooking.setTransferDateTime(dto.getTransferDateTime());
        existingBooking.setPhoneNumber(dto.getPhoneNumber());
        existingBooking.setEmail(dto.getEmail());
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