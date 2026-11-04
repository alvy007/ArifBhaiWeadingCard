import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arif & Suchana | Kabin Ceremony",
  description: "A personal animated Kabin ceremony invitation for Arif Rahman and Suchana Sarker, on Friday, 6 November 2026, filled with love, prayers, and warm wishes.",
  applicationName: "A & S Kabin Invitation",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "A & S Kabin" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "A & S | Kabin Ceremony",
    description: "Arif Rahman & Suchana Sarker invite you to share in their Kabin ceremony on Friday, 6 November 2026.",
    images: [{ url: "/arif-suchana.webp", width: 640, height: 853 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#315d4d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
