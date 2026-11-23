package com.viptransfer.booking;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class PublicBookingLookupRateLimitFilter extends OncePerRequestFilter {
    private static final long WINDOW_MS = 60_000L;
    private static final int MAX_ATTEMPTS = 30;
    private final ConcurrentHashMap<String, Window> attempts = new ConcurrentHashMap<>();
    private record Window(long start, AtomicInteger count) {}

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !"/bookings/public-lookup".equals(request.getServletPath());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        long now = System.currentTimeMillis();
        // Use servlet remote address, never untrusted X-Forwarded-For header.
        String ip = request.getRemoteAddr();
        Window window = attempts.compute(ip, (key, old) -> {
            if (old == null || now - old.start() >= WINDOW_MS) return new Window(now, new AtomicInteger(1));
            old.count().incrementAndGet();
            return old;
        });
        if (window.count().get() > MAX_ATTEMPTS) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Too many booking lookups. Please try again shortly.\"}");
            return;
        }
        if (attempts.size() > 10_000) {
            attempts.entrySet().removeIf(entry -> now - entry.getValue().start() >= WINDOW_MS);
        }
        chain.doFilter(request, response);
    }
}
