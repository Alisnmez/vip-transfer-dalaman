package com.viptransfer;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.viptransfer.booking.Booking;
import com.viptransfer.booking.BookingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VipTransferDalamanApplication {

    public static void main(String[] args) {
        SpringApplication.run(VipTransferDalamanApplication.class, args);
    }
    @Bean
    CommandLineRunner testBookingFindById(BookingService bookingService) {
        return args -> {
            Booking booking = bookingService.getBooking(1L);

            System.out.println("Booking found:");
            System.out.println("ID: " + booking.getId());
            System.out.println("Customer: " + booking.getCustomerNameSnapshot());
        };
    }

}
