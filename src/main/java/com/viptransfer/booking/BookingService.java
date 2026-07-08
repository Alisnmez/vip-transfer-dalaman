package com.viptransfer.booking;

import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService (BookingRepository bookingRepository) {

        this.bookingRepository = bookingRepository;

    }

    public Booking CreateBooking(Booking booking){
        return bookingRepository.save(booking);
    }

    public Booking getBooking(Long id){

        return bookingRepository.findById(id).orElseThrow();
    }

}
