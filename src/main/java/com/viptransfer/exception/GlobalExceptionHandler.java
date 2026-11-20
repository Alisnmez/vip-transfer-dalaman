package com.viptransfer.exception;

import com.viptransfer.booking.dto.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponseDto> handleResponseStatus(ResponseStatusException ex) {
        int status = ex.getStatusCode().value();
        String message = ex.getReason() == null ? "Request could not be completed." : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(new ErrorResponseDto(status, message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidBooking(IllegalArgumentException ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleBookingNotFoundException(BookingNotFoundException ex) {
        ErrorResponseDto errorDto = new ErrorResponseDto(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );
        return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = "Validation error";
        if (ex.getBindingResult().getFieldError() != null) {
            errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        }

        ErrorResponseDto errorDto = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                errorMessage
        );
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }
}
