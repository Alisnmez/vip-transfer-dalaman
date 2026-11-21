package com.viptransfer.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class BookingManagementRequestUpdateDto {
    @NotBlank
    @Pattern(regexp = "IN_PROGRESS|RESOLVED|DECLINED")
    private String status;

    @Size(max = 2000)
    private String adminNote;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }
}
