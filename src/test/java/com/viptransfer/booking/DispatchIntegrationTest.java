package com.viptransfer.booking;

import static org.junit.jupiter.api.Assertions.*;

import java.time.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest(properties = "app.email.enabled=false")
@Transactional
class DispatchIntegrationTest {
  @Autowired BookingRepository bookings;
  @Autowired DispatchController dispatch;

  @Test
  void reviewingAnUrgentLegDoesNotAssignItAndReturnCanUseAnotherDriver() {
    Booking b = new Booking();
    var pickup = LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusMinutes(45);
    b.setTransferDateTime(pickup);
    b.setReturnDateTime(pickup.plusDays(5));
    b.setPassengerCount(2);
    bookings.saveAndFlush(b);
    long id = b.getId();
    assertEquals(2, dispatch.details(id).size());
    dispatch.update(
        id,
        "outbound",
        new DispatchController.Update(null, null, null, null, null, true, false, 0, null));
    assertEquals(0, ((Number) dispatch.details(id).get(0).get("priority")).intValue());
    dispatch.update(
        id,
        "outbound",
        new DispatchController.Update("A", "123", "A1", 4, "Assigned", false, false, 1, null));
    dispatch.update(
        id,
        "return",
        new DispatchController.Update("B", "456", "B1", 4, "Assigned", false, false, 0, null));
    assertEquals("B", dispatch.details(id).get(1).get("driver"));
    assertEquals("PENDING", b.getStatus());
    assertThrows(
        ResponseStatusException.class,
        () ->
            dispatch.update(
                id,
                "outbound",
                new DispatchController.Update(
                    "C", null, null, 4, "Assigned", false, false, 0, null)));
    assertEquals(3, dispatch.history(id).size());
    assertNotNull(dispatch.counts().get("today"));
  }

  @Test
  void overlappingDriverWindowsGenerateWarningAndDistinctDriversRemainAvailable() {
    var pickup = LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusDays(3);
    Booking first = new Booking();
    first.setPassengerCount(2);
    first.setTransferDateTime(pickup);
    Booking second = new Booking();
    second.setPassengerCount(2);
    second.setTransferDateTime(pickup.plusHours(2));
    bookings.saveAndFlush(first);
    bookings.saveAndFlush(second);
    dispatch.update(
        first.getId(),
        "outbound",
        new DispatchController.Update(
            "Window test", null, null, 4, "Assigned", false, false, 0, pickup.plusHours(3)));
    var conflict =
        dispatch.update(
            second.getId(),
            "outbound",
            new DispatchController.Update(
                "Window test", null, null, 4, "Assigned", false, false, 0, null));
    assertTrue(conflict.get("warning").toString().contains("overlapping"));
    var available =
        dispatch.update(
            second.getId(),
            "outbound",
            new DispatchController.Update(
                "Another driver", null, null, 4, "Assigned", false, false, 1, null));
    assertEquals("", available.get("warning"));
  }
}
