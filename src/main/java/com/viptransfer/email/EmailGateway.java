package com.viptransfer.email;

public interface EmailGateway {
    String send(String eventId, String payload);

    class DeliveryFailure extends RuntimeException {
        final boolean retryable;
        public DeliveryFailure(String safeCode, boolean retryable) { super(safeCode); this.retryable = retryable; }
    }
}
