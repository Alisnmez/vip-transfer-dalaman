package com.viptransfer.booking;

import java.util.Locale;

/** Stable public display reference; the numeric database ID remains the internal key. */
public final class BookingReference {
    private static final long SPACE = 456_976_000L; // 26^4 * 1000
    private static final long MULTIPLIER = 7919L;
    private static final long OFFSET = 173_821_457L;
    private static final long INVERSE = java.math.BigInteger.valueOf(MULTIPLIER)
            .modInverse(java.math.BigInteger.valueOf(SPACE)).longValue();

    private BookingReference() {}

    public static String fromId(long id) {
        if (id < 1 || id > SPACE) throw new IllegalArgumentException("Booking reference capacity exceeded.");
        long value = Math.floorMod(id * MULTIPLIER + OFFSET, SPACE);
        long letters = value / 1000;
        StringBuilder result = new StringBuilder(7);
        for (int i = 0; i < 4; i++) {
            result.append((char) ('A' + letters % 26));
            letters /= 26;
        }
        return result.append(String.format(Locale.ROOT, "%03d", value % 1000)).toString();
    }

    public static Long toId(String input) {
        if (input == null) return null;
        String value = input.strip().toUpperCase(Locale.ROOT);
        if (!value.matches("[A-Z]{4}[0-9]{3}")) return null;
        long letters = 0;
        long factor = 1;
        for (int i = 0; i < 4; i++) {
            letters += (value.charAt(i) - 'A') * factor;
            factor *= 26;
        }
        long encoded = letters * 1000 + Long.parseLong(value.substring(4));
        long id = Math.floorMod((encoded - OFFSET) * INVERSE, SPACE);
        return id == 0 ? SPACE : id;
    }
}
