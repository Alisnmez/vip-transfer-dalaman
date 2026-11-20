package com.viptransfer.booking.dto;

import java.time.LocalDateTime;

public class ErrorResponseDto {

    private String message;
    private int status;
    private LocalDateTime timestamp;

    public ErrorResponseDto(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() {
        return this.status;
    }

    public String getMessage() {
        return this.message;
    }

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }
}
