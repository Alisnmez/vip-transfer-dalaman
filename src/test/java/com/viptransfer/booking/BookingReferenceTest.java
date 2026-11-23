package com.viptransfer.booking;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class BookingReferenceTest {
    @Test void roundTripsAndPreservesLegacyReferences() {
        for (long id : new long[]{1, 17, 999, 1000, 100_000, 456_976_000}) {
            String reference = BookingReference.fromId(id);
            assertTrue(reference.matches("[A-Z]{4}[0-9]{3}"));
            assertEquals(id, BookingReference.toId(reference));
            assertEquals(id, BookingReference.toId("#" + reference.toLowerCase(java.util.Locale.ROOT)));
        }
        assertEquals(17L, BookingReference.toId("17"));
        assertEquals(17L, BookingReference.toId("#17"));
        assertNull(BookingReference.toId("wrong"));
        assertNull(BookingReference.toId("#0"));
    }

    @Test void referencesAreDistinctAcrossManyBookings() {
        var references = new java.util.HashSet<String>();
        for (long id = 1; id <= 10_000; id++) {
            assertTrue(references.add(BookingReference.fromId(id)));
        }
    }
}
