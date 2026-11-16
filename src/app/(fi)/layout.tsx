import type { Metadata, Viewport } from "next";
import { pageMetadata } from "@/lib/site";
import "../globals.css";
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#171614" };
export const metadata: Metadata = pageMetadata("fi");
export default function FinnishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi-FI"><body>{children}</body></html>;
}
