# Reusable SEO setup — barbershop demo

The Finnish (`/`) and English (`/en`) pages are separately rendered and have localized metadata, canonical links, reciprocal `hreflang`, Open Graph/Twitter previews, image alt text, a sitemap and robots rules. The social cards are generated at 1200 × 630 pixels. Titles and descriptions describe barbershop services without claiming a particular address, phone number, opening hours, review score or ranking.

## Reuse for a client

1. Set `NEXT_PUBLIC_SITE_URL` to that client's public HTTPS origin and rebuild. Without it, the demo is deliberately `noindex` and the sitemap is empty, so a staging deployment cannot be indexed with localhost URLs.
2. Replace the BLADE demo name, visible city, prices, staff, photos, hours and booking preview with the client's verified information. Keep the site's visible content, titles and previews consistent. The site currently has only `WebSite` and `WebPage` structured data; add `LocalBusiness`/`HairSalon` data only when the actual name, address and other published details are known.
3. Connect the booking flow to a real availability and confirmation service before taking appointments. Current slots are examples and do not create a reservation.
4. After launch, submit `/sitemap.xml` in Search Console and Bing Webmaster Tools, inspect both language URLs and test social previews on the client's live HTTPS domain. Confirm mobile layout, image loading and conversion tracking.

The reusable technical SEO is ready for a demo. Local ranking work becomes client-specific only after there is a real business and domain; avoid fabricated NAP details, reviews and hours.
