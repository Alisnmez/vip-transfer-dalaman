# Manage My Booking: policy and implementation

## Customer policy shown on the site

- Customers may request a change or cancellation without a DalamanWay service fee at least 24 hours before each affected pickup, using Türkiye local time.
- A change depends on vehicle and driver availability. Any fare difference must be disclosed and approved before the booking is updated.
- Requests inside 24 hours are still accepted for review. The operations team confirms availability and any applicable cost before the customer decides.
- A submitted request does not itself change or cancel a booking. The customer waits for written confirmation.
- For return journeys, the cutoff is considered separately for each affected pickup. Flight changes should be reported promptly.
- The online booking form does not collect payment. Any payment collected separately follows the terms disclosed for that payment and applicable consumer rights.
- The operational policy does not limit mandatory consumer rights.

## Customer request flow

The public form is `/booking/lookup` (linked as “Manage Booking” in the site navigation). It requires the booking reference, the email saved on that booking, the request type, and a short description. The reference alone is not treated as proof of access. The API returns the same public response whether a booking matched or not and never returns booking details.

Requests are stored in `booking_management_request` and appear in the admin queue at `/admin/management-requests`. One active request per booking is allowed at a time. Admins can mark it in progress, resolve or decline it; cancellation requests have a separate action that cancels the booking and resolves the request. Change requests should be applied on the booking details page before they are marked resolved.

Customer acknowledgements and operator notifications use the existing transactional email outbox. Delivery requires the existing email service configuration to be enabled (`EMAIL_ENABLED=true`) with a verified sender/provider and `EMAIL_OPERATOR` configured for operator alerts. The application default is disabled, so confirm deployment configuration before promising live email delivery.

## Competitor policy review (21 November 2026)

- Dalaman Go Transfer publishes full refunds for cancellations at least 24 hours before transfer; late cancellations and no-shows are non-refundable.
- DalamanTransfer publishes free cancellation/modification up to 24 hours, with a 50% charge inside 24 hours, and an exception for airline cancellations.
- TransferVIP publishes a different 12-hour window, showing that rules vary between operators.

The site uses the 24-hour request window as a clear operating policy, but keeps late requests reviewable instead of automatically imposing a blanket charge. Any contractual fee/refund language should be checked against the actual booking/payment terms and applicable consumer law before payment collection is introduced.
