import type { Metadata, Viewport } from "next";
import { pageMetadata } from "@/lib/site";
import "../globals.css";
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#171614" };
export const metadata: Metadata = pageMetadata("en");
export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-FI"><body>{children}</body></html>;
}
