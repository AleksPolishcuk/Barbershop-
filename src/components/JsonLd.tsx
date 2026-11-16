import { absoluteUrl, business, type SiteLanguage } from "@/lib/site";
export function JsonLd({ language }: { language: SiteLanguage }) {
  const path = language === "fi" ? "/" : "/en";
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, name: business.name,
        url: absoluteUrl("/"), inLanguage: ["fi-FI", "en-FI"],
      },
      {
        "@type": "WebPage", "@id": `${absoluteUrl(path)}#webpage`, url: absoluteUrl(path),
        name: language === "fi" ? "Parturi ja hiustenleikkaus | BLADE" : "Barbershop & haircuts | BLADE",
        inLanguage: language === "fi" ? "fi-FI" : "en-FI", isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
