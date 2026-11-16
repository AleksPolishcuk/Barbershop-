# Booking through WhatsApp

## Decision for this demo

The website collects a **preferred** service, barber, date, time, name and phone number. It creates a readable WhatsApp message. A real shop number is intentionally absent from this universal demo. Until `NEXT_PUBLIC_BOOKING_WHATSAPP_NUMBER` is set, the last step shows a copyable request and clearly says nothing was sent.

With a configured number, the last action opens `wa.me/<number>?text=<encoded request>`. The customer must tap **Send** inside WhatsApp. Opening a chat is not proof of sending. The shop then confirms the time in that same chat or suggests another. The website never marks the appointment confirmed. The request reference helps staff match a change or cancellation; it is a client-side conversation reference, not a reservation ID in a database.

The calendar's times are examples of **time preferences**, not live availability. Staff must check their own calendar before confirming. The site does not prevent double booking.

## Options compared

| Option | Setup and running cost | What works | Limitation |
| --- | --- | --- | --- |
| WhatsApp Business app + click to chat | Lowest complexity; no custom server | Prefilled requests, manual reply, quick replies, labels, greeting and away messages | No live availability, automatic confirmation, or trustworthy delivery status |
| Hosted booking provider + WhatsApp contact | Provider subscription/fees | Real shared calendar, reminders and cancellation links, depending on provider | Vendor cost and less control over the booking UI; verify a provider's current features and pricing before choosing |
| WhatsApp Business Platform + small backend/database | Development, hosting and Meta message charges | Webhooks, real state transitions, calendar locks, automatic confirmation/cancellation and reminders | Requires a verified business setup, credentials, opt-in/message-template rules, monitoring and support |

**Recommendation now:** first option. Move to a hosted booking provider if staff cannot reliably manage the calendar manually. Build the API option only if the business needs custom automation at enough volume to justify maintenance.

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
