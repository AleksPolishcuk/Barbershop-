# Booking through WhatsApp

## Chosen launch path: hosted booking provider

The project owner chose a hosted booking service for client launch, without a custom booking backend. The integration is now implemented as a single `NEXT_PUBLIC_BOOKING_PROVIDER_URL` setting. When a real shop's HTTPS booking page is configured, **every Book Appointment button goes to that page**; the demo calendar and WhatsApp request flow are bypassed. No two independent calendars are presented to customers. Without a provider URL, the site remains a clearly labelled preview.

For a Finnish barbershop, Timma Pro is a practical candidate: its [own booking page](https://help.timma.fi/en/articles/14334778-a-great-customer-experience-starts-with-the-booking) is linked to its staff calendar and sends customer confirmations by email. Timma [recommends a booking link/button on the shop's website, especially for mobile](https://help.timma.fi/en/articles/14617808-upgrade-your-online-booking); an iframe option exists, but the direct link is the recommended launch integration here. The real shop can set services, prices, barber working hours, breaks and cancellation rules in its provider account. [Timma's booking settings](https://help.timma.fi/en/articles/5545566-online-booking) include the “anyone” professional option and cancellation cutoff. Do not claim WhatsApp confirmations from Timma: the documented automatic channel is email, with optional paid SMS features. A WhatsApp channel can remain for personal questions or manual changes.

**Activation for a real shop:** obtain its exact customer-facing booking URL from the provider account (Timma: Company → Information → Online booking), set `NEXT_PUBLIC_BOOKING_PROVIDER_URL` in Vercel, redeploy, and test every CTA on mobile and desktop. In the provider account, first load real staff schedules and existing appointments. Before publishing, use two authorized test customers in separate sessions to attempt the same barber/time; confirm that only one booking succeeds and that the other sees a different available time. Then test a longer overlapping service, “any barber”, cancellation, and notification delivery. This vendor test cannot be completed in the universal demo because no shop account or URL was supplied.

The PostgreSQL migration and concurrency test below are a **verified fallback architecture**, not part of the chosen provider launch. They are kept for a future custom booking system and do not run on Vercel today.

## Double-booking decision (2026-11-16)

**The current WhatsApp-only demo cannot guarantee unique slots.** Two customers may choose the same example time and send messages. WhatsApp delivery order is not a reservation lock, and a `wa.me` link cannot report to the website whether a message was sent. Do not present the current date/time grid as live availability.

For a real launch choose one of these two paths:

1. **No custom backend:** let a hosted booking provider such as Timma own the calendar, availability, confirmation and cancellation. Keep WhatsApp as a contact channel. Replace this site's sample booking form with the provider's booking link or supported embed. Verify provider-specific behavior before launch.
2. **Keep this booking UI:** use a small server-side API plus one PostgreSQL database. The site submits a booking request to the API. PostgreSQL atomically accepts one overlapping slot per barber and returns `unavailable` to the loser. The losing user sees an immediate in-page message and can choose another slot. WhatsApp notifications are triggered only **after** the database result, through the official Business Platform and a retryable notification queue. The business and customer must see the same database booking ID/status.

The implementation foundation for path 2 is [db/001_atomic_bookings.sql](db/001_atomic_bookings.sql). Its GiST exclusion constraint protects full service intervals, not just identical start times. `claim_booking` derives durations on the server side, uses a caller-provided idempotency key, and can assign a different free barber when the customer chose “any”. The function returns `confirmed`, `unavailable`, `invalid`, or `idempotency_mismatch`; callers cannot bypass the underlying overlap constraint. Browser roles are denied access to customer records and the function. These rules are verified by [scripts/test-booking-concurrency.sh](scripts/test-booking-concurrency.sh) against two actual concurrent PostgreSQL sessions.

**Important ordering:** “first” means the first valid transaction that wins the database constraint. Click order and WhatsApp message arrival order cannot be guaranteed across networks. The user whose transaction loses receives `unavailable` regardless of what the calendar showed moments earlier; availability display is only advisory.

```mermaid
sequenceDiagram
  participant A as Customer A
  participant B as Customer B
  participant API as Booking API
  participant DB as PostgreSQL
  participant WA as WhatsApp sender
  A->>API: request 12:00, Ali
  B->>API: request 12:00, Ali
  API->>DB: atomic claim A
  API->>DB: atomic claim B
  DB-->>API: A confirmed; B unavailable
  API-->>A: booking ID and confirmed time
  API-->>B: 409, choose another time
  API->>WA: queue confirmation after commit
```

| Failure mode | Required behavior |
| --- | --- |
| Two users submit the same start time | One database transaction succeeds; the other gets a conflict. |
| Different starts overlap because services last 45–65 minutes | Exclusion constraint compares full time ranges for each barber. |
| Browser shows a slot that was just taken | Submit again against the database; refresh suggestions after `409`. |
| Client retries after a timeout or double clicks | Reuse the same UUID request key; return the original result without adding a second booking. |
| Preferred barber is “any” | Claim one real barber atomically and tell the customer which barber was assigned. |
| WhatsApp delivery fails or arrives late | Booking status remains in the database; retry notifications from an outbox. Never choose the winner from delivery order. |
| Customer requests cancellation | Verify the request, update booking status, free the slot, then acknowledge. |
| Shop closes or a barber is absent | Server must validate business hours, breaks, holidays and staff shifts before attempting a claim; the generic demo has no verified schedule yet. |

The database migration and concurrency tests are implemented, but **the live booking API and WhatsApp Business Platform connection are not activated**. This demo has no shop account, database credentials, Meta API credentials, approved notification templates, or real opening hours. The website therefore remains in its honest request-preview mode. Setting only `NEXT_PUBLIC_BOOKING_WHATSAPP_NUMBER` does **not** turn on conflict-safe booking.

### Production state and failure handling

- **Create:** validate service, barber, business hours, date, contact and anti-abuse challenge on the server. Create the booking with a unique request key. Return a confirmed booking only after the database transaction commits; never call it confirmed merely because WhatsApp opened.
- **Conflict:** return HTTP 409 with `unavailable`. Refresh availability and offer alternative times or “any available barber”; do not silently move the customer to a different hour.
- **Notification:** write an outbox event in the same database transaction as the booking. A worker sends the shop and customer WhatsApp messages via Cloud API, retries failures, and records delivery status. A WhatsApp outage must not create duplicate bookings; notification state and booking state are separate.
- **Cancellation/change:** verify the booking owner or have staff process the request, update the database transactionally, then send notifications. A cancelled row releases its time range. A change claims the replacement interval before releasing the old one, or keeps the old booking if the replacement is unavailable.
- **Privacy and abuse:** keep API tokens server side, limit requests per phone/IP, use a challenge for public booking, restrict database roles, and publish the actual shop's retention and cancellation policy before launch.

References: [PostgreSQL range/exclusion constraints](https://www.postgresql.org/docs/16/rangetypes.html), [Supabase database functions and privileges](https://supabase.com/docs/guides/database/functions), [Vercel function lifecycle](https://vercel.com/docs/functions), [Meta WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/overview).

## Decision for this demo

The website collects a **preferred** service, barber, date, time, name and phone number. It creates a readable WhatsApp message. A real shop number is intentionally absent from this universal demo. Until `NEXT_PUBLIC_BOOKING_WHATSAPP_NUMBER` is set, the last step shows a copyable request and clearly says nothing was sent.

When no provider URL is set but a WhatsApp number is configured, the last action opens `wa.me/<number>?text=<encoded request>`. The customer must tap **Send** inside WhatsApp. Opening a chat is not proof of sending. The shop then confirms the time in that same chat or suggests another. The website never marks the appointment confirmed. The request reference helps staff match a change or cancellation; it is a client-side conversation reference, not a reservation ID in a database. A configured provider URL always takes precedence over this preview flow.

The calendar's times are examples of **time preferences**, not live availability. Staff must check their own calendar before confirming. The site does not prevent double booking.

## Options compared

| Option | Setup and running cost | What works | Limitation |
| --- | --- | --- | --- |
| WhatsApp Business app + click to chat | Lowest complexity; no custom server | Prefilled requests, manual reply, quick replies, labels, greeting and away messages | No live availability, automatic confirmation, or trustworthy delivery status |
| Hosted booking provider + WhatsApp contact | Provider subscription/fees | Real shared calendar, reminders and cancellation links, depending on provider | Vendor cost and less control over the booking UI; verify a provider's current features and pricing before choosing |
| WhatsApp Business Platform + small backend/database | Development, hosting and Meta message charges | Webhooks, real state transitions, calendar locks, automatic confirmation/cancellation and reminders | Requires a verified business setup, credentials, opt-in/message-template rules, monitoring and support |

**Recommendation for the current showcase:** first option as an explicitly unconfirmed request. **Recommendation for real, conflict-safe reservations without a custom backend:** a hosted booking provider. Build the API option only if the business needs this custom UI and WhatsApp automation enough to justify maintenance.

For a Finland-based shop, [Timma Pro currently advertises](https://timma.fi/pro/pricing) a starting price of **€20 per user per month** for calendar and online booking, plus **€0.08 per sent SMS reminder**; its [online-booking settings](https://help.timma.fi/fi/articles/5545566-nettiajanvaraus) include a cancellation cutoff. [Fresha's Finnish pricing page](https://www.fresha.com/fi/pricing) is another candidate with booking, reminders and cancellation controls. These are alternatives to evaluate with the eventual shop owner, not dependencies added to this demo. Confirm live prices and any marketplace fees before selecting one.

## Staff operating procedure

1. Use a shop-owned WhatsApp Business number. Configure greeting/away messages to say that a request is pending until a person confirms it. Do not use an automatic greeting that says “confirmed.”
2. Apply conversation labels such as `New request`, `Confirmed`, `Change requested`, `Cancelled`. Use quick replies for a confirmation with date, time, service and barber, for an alternative slot, and for a cancellation acknowledgement.
3. On each incoming request, check the calendar shared by all staff. Confirm the slot in WhatsApp and place it in the calendar immediately. If unavailable, offer a new time and record only the agreed slot.
4. For a change or cancellation, the customer replies in the same chat or uses the prefilled change/cancellation link on the review screen. Staff update the shared calendar and acknowledge the change in WhatsApp. A chat request alone does not remove a confirmed calendar entry.
5. Define a response target and cancellation policy for the real shop before launch. Publish these next to the form once confirmed by the owner. Keep staff trained on what to do if a customer does not have WhatsApp.

Suggested quick replies (edit to match the shop):

- **Request received:** “Thanks for your request. We are checking the time and will confirm here shortly.”
- **Confirmed:** “Confirmed: [service] with [barber], [date] at [time]. See you then.”
- **Alternative:** “That time is taken. Would [date/time] or [date/time] work?”
- **Cancelled:** “Your appointment on [date] at [time] has been cancelled.”

## To activate the direct WhatsApp handoff

1. Get the shop's actual WhatsApp Business number and verify that it receives messages.
2. Set `NEXT_PUBLIC_BOOKING_WHATSAPP_NUMBER` to country code plus digits only, for example `358401234567`, in the production environment; redeploy. Do not put a personal number or API secret in this public variable.
3. Test the complete journey on a phone and desktop: open chat, inspect the prefilled FI/EN text, **send a test request from an authorized test account**, confirm manually in the shop account, and test a change/cancellation.
4. Before a real launch, replace example barbers and time preferences with approved business details, and publish the shop's actual privacy and cancellation policies. The current privacy note describes only this front-end handoff.

The `wa.me` link carries the prefilled text in its URL when opened, so name, phone and preferences are passed to WhatsApp even if the customer does not tap Send. Keep the preview and disclosure visible before opening the link. Do not include sensitive extra notes in the request.

## If automatic confirmation becomes necessary

The minimum reliable architecture is: booking form → server endpoint → database transaction/slot lock → pending booking → WhatsApp Business Platform message/webhook → staff confirmation → confirmed booking → customer notification. Cancellation follows an authenticated or verified request, updates the same booking record and releases the slot. The server holds API credentials; a browser must never call the WhatsApp Cloud API directly with a secret. Use idempotency for form submissions and webhook events. A low-code automation still needs a durable booking store and a way to resolve double bookings.

Do not promise that a reply to a normal WhatsApp Business app conversation can automatically change website state. That requires an integration with webhooks or a booking provider.

## Research sources, checked 2026-11-16

- [WhatsApp Help: click to chat](https://faq.whatsapp.com/5913398998672934) — prefilled text opens a chat; the customer sends it.
- [WhatsApp Business app features](https://whatsappbusiness.com/products/business-app-features/) — greeting, away messages, quick replies and labels.
- [Meta Business Platform overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/overview) — API, messages, templates and webhooks.
- [Meta Business Platform pricing](https://whatsappbusiness.com/products/platform-pricing/) — charges depend on delivered message category and market; recheck rates when choosing an API plan.
