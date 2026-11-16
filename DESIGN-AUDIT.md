# BLADE design and booking audit

## Direction

An editorial barbershop identity with smoked charcoal (`#121411`), warm ivory (`#f1eade`) and forged brass (`#d6a05f`). The accent is reserved for prices, selected states and booking actions, so the main action remains easy to find. Cards, language control, social icons, calendar cells and buttons now share a restrained 3–8 px corner radius. The supplied reference informed the booking hierarchy and contrast; the site's photography and typography keep the BLADE composition distinct.

## Problems found and changes made

| Before | Change | Why it helps |
| --- | --- | --- |
| Service buttons were square, barber buttons were pills, and decorative arrows varied across sections. | One rectangular button system with a slight radius; booking actions use the same calendar icon. The first booking step now uses quiet service rows and compact portrait choices rather than checkbox-like cards. | Consistent actions are easier to recognize. |
| Service cards were pale below the photo and visually separate from the rest of the dark site. | Dark bordered cards, warmer photos, ivory text and brass price/action treatment. | Keeps the cards in the same visual language and improves hierarchy. |
| Hero had two competing actions. | One primary Book Appointment action with a calendar icon. | Clear path into booking. |
| Booking opened with a preselected time and only a seven-day strip. | Three explicit steps, a month calendar covering the next three months, a separate time choice and a live recap. The progress uses service, calendar and person icons instead of numbered boxes and checkmarks. | The date, month, service, barber and time are visible and editable. |
| Sample availability could be mistaken for a real reservation. | Sample-time label and explicit preview notices before and after contact entry. | Avoids a false confirmation while the backend is pending. |
| Mobile and tablet headers had cramped controls or horizontal overflow. | Compact mobile actions and a collapsed tablet menu. | Preserves navigation at 320–900 px. |

## Booking behaviour

1. A service is required. The customer can select a barber or keep “Any available barber.”
2. Past dates are disabled. The month control moves across three months; selecting a date reveals sample time slots. Continuing requires both a date and a time.
3. The selected service, barber, date, time and price appear in the recap. Contact fields are required for the preview. The dialog traps focus, closes with Escape, and locks page scrolling while open.

The frontend still uses example slots and does not save appointments. A booking service must supply real opening hours, service duration constraints, barber schedules and confirmation before launch as a live reservation system.

## Verification

Reviewed at 320, 390, 768 and 1280 px; checked the service and team cards, month navigation, disabled states, the full mobile booking path, modal scroll lock and horizontal overflow. ESLint, TypeScript and the production build are the code checks.
