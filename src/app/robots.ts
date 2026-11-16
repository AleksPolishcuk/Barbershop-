import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionSite } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: isProductionSite ? "/" : undefined, disallow: isProductionSite ? undefined : "/" }, ...(isProductionSite ? { sitemap: absoluteUrl("/sitemap.xml") } : {}) };
}
