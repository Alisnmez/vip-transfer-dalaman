package com.viptransfer.booking;

import java.time.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties="app.email.enabled=false")
@Transactional
class DispatchIntegrationTest {
    @Autowired BookingRepository bookings;
    @Autowired DispatchController dispatch;

    @Test void reviewingAnUrgentLegDoesNotAssignItAndReturnCanUseAnotherDriver() {
        Booking b=new Booking();
        var pickup=LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusMinutes(45);
        b.setTransferDateTime(pickup);b.setReturnDateTime(pickup.plusDays(5));b.setPassengerCount(2);
        bookings.saveAndFlush(b);
        long id=b.getId();
        assertEquals(2,dispatch.details(id).size());
        dispatch.update(id,"outbound",new DispatchController.Update(null,null,null,null,null,true,0));
        assertEquals(0,((Number)dispatch.details(id).get(0).get("priority")).intValue());
        dispatch.update(id,"outbound",new DispatchController.Update("A","123","A1",4,"Assigned",false,1));
        dispatch.update(id,"return",new DispatchController.Update("B","456","B1",4,"Assigned",false,0));
        assertEquals("B",dispatch.details(id).get(1).get("driver"));
        assertEquals("PENDING",b.getStatus());
        assertThrows(ResponseStatusException.class,()->dispatch.update(id,"outbound",
                new DispatchController.Update("C",null,null,4,"Assigned",false,0)));
        assertEquals(3,dispatch.history(id).size());
        assertNotNull(dispatch.counts().get("today"));
    }
}
