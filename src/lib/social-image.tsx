import { ImageResponse } from "next/og";
import type { SiteLanguage } from "@/lib/site";
export function socialImage(language: SiteLanguage) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 76px", color: "#f3e9db", background: "radial-gradient(circle at 76% 24%, #554537 0%, #29231e 34%, #141311 75%)", fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Arial, sans-serif", fontSize: 23, letterSpacing: 10 }}><span>BLADE</span><span style={{ fontSize: 16, letterSpacing: 3, color: "#d9c0a1" }}>BARBERSHOP</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ width: 96, height: 2, background: "#d7b894" }}/><div style={{ fontSize: 76, letterSpacing: -3, lineHeight: 1.07 }}>{language === "fi" ? "Parturi ja tyyli." : "Barbering, refined."}</div><div style={{ fontSize: 43, fontStyle: "italic", color: "#ead3b5" }}>{language === "fi" ? "Sinun tyylilläsi." : "Made for you."}</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #8b7764", paddingTop: 25, fontFamily: "Arial, sans-serif", fontSize: 19, color: "#e4d8c9" }}><span>{language === "fi" ? "HIUSTENLEIKKAUS · FADE · PARTA" : "HAIRCUTS · FADES · BEARDS"}</span><span>BLADE BARBERSHOP</span></div>
    </div>, { width: 1200, height: 630 });
}
