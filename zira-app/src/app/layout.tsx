import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Playfair_Display, Cormorant_Garamond, Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400","500","600","700","800","900"],
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  style: ["normal","italic"],
  display: "swap",
});
const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["200","300","400","500","700","800","900"],
  display: "swap",
});
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:       { default: "زيرا", template: "%s · زيرا" },
  description: "منصة الدراسة الاجتماعية — ادرس، اكسب، وابنِ مزرعتك الافتراضية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar" dir="rtl"
      className={`${playfair.variable} ${cormorant.variable} ${tajawal.variable} ${mono.variable} h-full`}
      style={{
        "--font-display": "var(--font-playfair), 'Amiri', Georgia, serif",
        "--font-accent":  "var(--font-cormorant), Georgia, serif",
        "--font-ui":      "var(--font-tajawal), system-ui, sans-serif",
      } as React.CSSProperties}
    >
      <body className="h-full font-[family-name:var(--font-ui)] antialiased">
        {children}
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background:    "rgba(22,14,8,0.9)",
              backdropFilter:"blur(20px)",
              border:        "1px solid rgba(201,168,76,0.3)",
              color:         "var(--parchment)",
              fontFamily:    "var(--font-ui)",
              boxShadow:     "0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(201,168,76,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
