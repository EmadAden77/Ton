import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ton | Realistic Selfie Prompt Studio",
  description: "واجهة عربية لبناء أوصاف سيلفي واقعية ومتسقة فيزيائياً.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
