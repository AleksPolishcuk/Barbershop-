import type { Metadata } from "next";

export type SiteLanguage = "fi" | "en";
const demoProductionUrl = "https://barbershop-seven-orpin.vercel.app";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : demoProductionUrl;
const productionUrl = configuredUrl || (process.env.NODE_ENV === "production" ? vercelProductionUrl : undefined);
export const isProductionSite = Boolean(
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview" &&
  productionUrl && /^https:\/\/[^/]+$/i.test(productionUrl),
);
export const siteUrl = isProductionSite ? productionUrl! : "http://localhost:3000";
export const business = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME?.trim() || "BLADE Barbershop",
  address: process.env.NEXT_PUBLIC_BUSINESS_STREET_ADDRESS?.trim(),
  postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE?.trim(),
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim(),
};
export const absoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).toString();
const title = {
  fi: "Parturi ja hiustenleikkaus | BLADE Barbershop",
  en: "Barbershop & haircuts | BLADE Barbershop",
};
const description = {
  fi: "Tutustu BLADE Barbershopin hiustenleikkauksiin, fade-leikkauksiin ja partapalveluihin. Katso palvelut ja hinnat sekä tutustu ajanvaraukseen.",
  en: "Explore haircuts, fades and beard services at BLADE Barbershop. View services and prices, and discover the booking experience.",
};
export function pageMetadata(language: SiteLanguage): Metadata {
  const path = language === "fi" ? "/" : "/en";
  return {
    metadataBase: new URL(siteUrl),
    title: title[language],
    description: description[language],
    applicationName: business.name,
    robots: isProductionSite ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: path, languages: { "fi-FI": "/", "en-FI": "/en", "x-default": "/" } },
    openGraph: {
      type: "website", siteName: business.name, title: title[language], description: description[language],
      url: path, locale: language === "fi" ? "fi_FI" : "en_FI", alternateLocale: language === "fi" ? ["en_FI"] : ["fi_FI"],
      images: [{ url: `/social/${language}`, width: 1200, height: 630, alt: language === "fi" ? "BLADE – parturipalvelut" : "BLADE – barbershop services" }],
    },
    twitter: { card: "summary_large_image", title: title[language], description: description[language], images: [`/social/${language}`] },
    category: "barbershop",
  };
}
