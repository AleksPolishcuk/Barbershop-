export type BookingLanguage = "fi" | "en";

export type BookingRequest = {
  reference: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  price: number;
  name: string;
  phone: string;
};

// A public phone number is safe in the client bundle. Never put an API token here.
const configuredNumber = process.env.NEXT_PUBLIC_BOOKING_WHATSAPP_NUMBER ?? "";
export const bookingWhatsAppNumber = /^\d{8,15}$/.test(configuredNumber) && !configuredNumber.startsWith("0")
  ? configuredNumber
  : null;

export function formatBookingRequest(request: BookingRequest, language: BookingLanguage) {
  const lines = language === "fi"
    ? [
        `BLADE · AJANVARAUSPYYNTÖ #${request.reference}`,
        `Palvelu: ${request.service}`,
        `Parturi: ${request.barber}`,
        `Toivottu aika: ${request.date} klo ${request.time}`,
        `Hinta: ${request.price} €`,
        `Nimi: ${request.name}`,
        `Puhelin: ${request.phone}`,
        "Vahvistattehan ajan vastaamalla tähän viestiin. Aika ei ole vielä varattu.",
      ]
    : [
        `BLADE · APPOINTMENT REQUEST #${request.reference}`,
        `Service: ${request.service}`,
        `Barber: ${request.barber}`,
        `Preferred time: ${request.date} at ${request.time}`,
        `Price: ${request.price} €`,
        `Name: ${request.name}`,
        `Phone: ${request.phone}`,
        "Please confirm the time by replying here. This appointment is not booked yet.",
      ];
  return lines.join("\n");
}

export function bookingWhatsAppUrl(message: string) {
  return bookingWhatsAppNumber
    ? `https://wa.me/${bookingWhatsAppNumber}?text=${encodeURIComponent(message)}`
    : null;
}

export function cancellationWhatsAppUrl(reference: string, language: BookingLanguage) {
  const message = language === "fi"
    ? `Hei! Haluan muuttaa tai perua ajanvarauspyynnön #${reference}. Voitteko auttaa?`
    : `Hello! I'd like to change or cancel appointment request #${reference}. Can you help?`;
  return bookingWhatsAppUrl(message);
}
