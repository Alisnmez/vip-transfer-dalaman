package com.viptransfer.booking;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class BookingReferenceTest {
    @Test void roundTripsAndRejectsLegacyReferences() {
        for (long id : new long[]{1, 17, 999, 1000, 100_000, 456_976_000}) {
            String reference = BookingReference.fromId(id);
            assertTrue(reference.matches("[A-Z]{4}[0-9]{3}"));
            assertEquals(id, BookingReference.toId(reference));
            assertEquals(id, BookingReference.toId(reference.toLowerCase(java.util.Locale.ROOT)));
        }
        assertNull(BookingReference.toId("17"));
        assertNull(BookingReference.toId("#17"));
        assertNull(BookingReference.toId("#ABCD123"));
        assertNull(BookingReference.toId("wrong"));
        assertNull(BookingReference.toId("#0"));
    }

    @Test void randomReferencesHaveSevenMixedCharactersAndAvoidLegacyFormat() {
        var seen = new java.util.HashSet<String>();
        for (int i = 0; i < 20_000; i++) {
            String ref = BookingReference.generate();
            assertEquals(7, ref.length());
            assertTrue(ref.matches("[A-Z2-9]{7}"));
            assertTrue(ref.matches(".*[A-Z].*"));
            assertTrue(ref.matches(".*[2-9].*"));
            assertFalse(ref.matches("[A-Z]{4}[0-9]{3}"));
            // Collision probability at this sample size is negligible, but uniqueness
            // in production is ultimately enforced by the PostgreSQL constraint.
            assertTrue(seen.add(ref), "Unexpected random reference collision: " + ref);
        }
    }

    @Test void referenceUniqueViolationDetectionDoesNotSwallowOtherDbErrors() throws Exception {
        var method = BookingService.class.getDeclaredMethod("isReferenceUniqueViolation", Throwable.class);
        method.setAccessible(true);
        var duplicateReference = new org.springframework.dao.DataIntegrityViolationException(
                "duplicate", new java.sql.SQLException("duplicate key violates unique constraint uq_booking_public_reference", "23505"));
        var duplicateOther = new org.springframework.dao.DataIntegrityViolationException(
                "duplicate", new java.sql.SQLException("duplicate key violates unique constraint booking_idempotency_key_key", "23505"));
        var nonUnique = new org.springframework.dao.DataIntegrityViolationException(
                "not null", new java.sql.SQLException("null value in column reference", "23502"));
        assertEquals(true, method.invoke(null, duplicateReference));
        assertEquals(false, method.invoke(null, duplicateOther));
        assertEquals(false, method.invoke(null, nonUnique));
    }

    @Test void referencesAreDistinctAcrossManyBookings() {
        var references = new java.util.HashSet<String>();
        for (long id = 1; id <= 10_000; id++) {
            assertTrue(references.add(BookingReference.fromId(id)));
        }
    }
}
