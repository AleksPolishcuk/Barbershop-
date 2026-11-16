import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionSite } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionSite) return [];
  return ["/", "/en"].map((path) => ({ url: absoluteUrl(path), changeFrequency: "monthly", priority: path === "/" ? 1 : 0.9, alternates: { languages: { "fi-FI": absoluteUrl("/"), "en-FI": absoluteUrl("/en") } } }));
}
