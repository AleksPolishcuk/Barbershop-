# BLADE Barbershop — website handover

**Status:** reusable FI/EN demo. It can be adapted for a specific barbershop, but the displayed brand, people, photographs, prices and location details are examples until verified by that business. The demo is not a live appointment system.

- Demo: https://barbershop-seven-orpin.vercel.app
- Default language: Finnish (`/`); English: `/en`
- Stack: Next.js 15 App Router, React 19, TypeScript, Motion, CSS, Vercel deployment
- Related guides: [booking architecture](BOOKING-ARCHITECTURE.md), [SEO launch](SEO-LAUNCH.md), [design audit](DESIGN-AUDIT.md), [commercial kit](CLIENT-SALES-KIT.md)

## What the website includes

1. **Hero and clear booking action.** A photographic first screen, concise promise, starting price and calendar-marked booking button.
2. **Services and prices.** Three example services in ascending price order: Classic Haircut €20 / 45 min; Modern Fade €25 / 50 min; Haircut & Beard €35 / 65 min. A service card opens the demo with that service selected.
3. **Visit explanation.** A short three-part explanation of how a customer chooses a service, barber and time, then arrives for the cut.
4. **Barber profiles.** Three example people with direct booking actions. Names, portraits, experience and availability must be replaced for a client.
5. **Location and footer.** Turku is the demo city. Exact address, opening hours, phone and social URLs are intentionally absent until supplied. Social icons currently have no destination.
6. **Responsive design.** Desktop, tablet and mobile layouts; reduced-motion support in reveal animations; keyboard focus states and a dialog that locks background scrolling.
7. **Bilingual SEO and sharing.** FI/EN metadata, canonical/hreflang, robots and sitemap rules, localized social preview images, descriptive image alt text and basic WebSite/WebPage structured data. Client-specific LocalBusiness data is not fabricated.

The design uses a charcoal/ivory/brass palette, slightly rounded controls, editorial serif headlines and a restrained motion system. Responsive behavior was reviewed at 320, 390, 768 and 1280 px during development; recheck after adding each customer's content and images.

## Booking modes — one source of truth

| Configuration | Customer action | Reservation status |
| --- | --- | --- |
| `NEXT_PUBLIC_BOOKING_PROVIDER_URL` set | Every Book Appointment action navigates to that shop's hosted booking page | The provider owns live availability, confirmation and cancellation. Test these in the real shop account. |
| No provider URL, WhatsApp number set | Demo flow prepares a time request and opens WhatsApp with prefilled text | A request only. The customer taps Send and the shop replies manually; no slot lock. |
| Neither set (current demo) | Demo flow shows a review and copyable request | Nothing is sent, saved or confirmed. |

**Recommended client launch:** use a provider such as Timma Pro and set `NEXT_PUBLIC_BOOKING_PROVIDER_URL`. This avoids two independent calendars. The example time grid is never presented as live availability when a provider URL is configured. Automatic WhatsApp confirmation is not part of this integration. See [BOOKING-ARCHITECTURE.md](BOOKING-ARCHITECTURE.md) for the concurrency analysis and tested PostgreSQL alternative.

## Local development

Prerequisites: Node.js 22 and npm. From this folder:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The optional PostgreSQL concurrency test requires PostgreSQL 16+ command-line tools installed locally and permission to start a temporary instance:

```bash
bash scripts/test-booking-concurrency.sh
```

## Client configuration and deployment

1. Get the customer's verified legal/trading name, logo, address, postal code, public phone, hours, prices, service durations, barber names/portraits, photographs, social URLs and booking/cancellation policy. Obtain permission to use people and images in commercial advertising.
2. Replace the example copy, photos and service data in `src/components/Home.tsx`. Adjust both languages; do not leave FI/EN inconsistent. Verify all CTAs and prices against the provider's catalog.
3. Put the shop-owned hosted booking URL in `NEXT_PUBLIC_BOOKING_PROVIDER_URL`. It must be HTTPS. In Timma Pro, the customer-facing link is under Company → Information → Online booking. Configure its real staff schedules, breaks and existing appointments before linking it from the website.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Set the verified business environment values shown in `.env.example`. Rebuild and redeploy; public environment values are compiled into the client bundle.
5. Use a client-owned commercial hosting account and domain. The Vercel Hobby plan is for personal/non-commercial use; check current Vercel plans for commercial deployment. Domain, booking provider and hosting fees are separate from development fees.
6. Review the client's privacy and cancellation notices with its owner. The current demo disclosure only describes the preview/WhatsApp handoff. Add accurate, client-specific legal/contact pages or links as required for launch.
7. Check both language URLs, desktop/mobile layout, keyboard use, images, social previews, canonical URLs, robots and sitemap. Test two simultaneous bookings of one barber/time and cancellation inside the actual provider account. Only the provider can verify that end-to-end behavior.
8. Submit the production sitemap to search tools and complete the shop's Google Business Profile with consistent verified details. Monitor booking clicks and provider-completed appointments separately.

## Source map

| Area | File |
| --- | --- |
| Page UI and bilingual copy | `src/components/Home.tsx` |
| Styles | `src/app/globals.css`, `src/app/refinement.css` |
| Hosted booking link validation | `src/lib/booking-provider.ts` |
| Demo WhatsApp message formatting | `src/lib/booking-whatsapp.ts` |
| Metadata, site URL and business identity | `src/lib/site.ts` |
| Structured data | `src/components/JsonLd.tsx` |
| Sitemap and robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Social cards | `src/lib/social-image.tsx`, `src/app/(fi)/social/fi/route.tsx`, `src/app/(en)/social/en/route.tsx` |
| Optional custom booking database proof | `db/001_atomic_bookings.sql`, `scripts/test-booking-concurrency.sh` |

## Current launch limits

- The demo prices, barber profiles, imagery, business name and Turku references are illustrative. They must not be sold as facts about another salon.
- The demo form has example time preferences and cannot prevent double booking. A hosted provider URL is required for real online reservations without a custom backend.
- A WhatsApp click-to-chat link does not send a message automatically or report delivery to this website. WhatsApp-only confirmation and cancellation remain manual.
- The social icons have no links until real profiles are supplied. There is no Google review score, verified local address, newsletter, payment processing, CRM or analytics dashboard in this codebase.
- SEO implementation makes pages crawlable and shareable when correctly configured; search positions, traffic and conversion uplift are not guaranteed.
