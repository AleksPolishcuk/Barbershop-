// A shop-specific hosted booking page is the sole source of live availability.
// Keep this unset for the universal preview. Only HTTPS destinations are accepted.
const configuredUrl = process.env.NEXT_PUBLIC_BOOKING_PROVIDER_URL?.trim();

export const bookingProviderUrl = (() => {
  if (!configuredUrl) return null;
  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
})();
