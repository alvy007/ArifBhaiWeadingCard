import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arif & Suchana | Kabin Ceremony Invitation",
  description: "With love and blessings, join Arif Rahman and Suchana Sarker in celebrating their Kabin ceremony. A personal invitation filled with prayers and gratitude.",
  openGraph: {
    title: "A & S | Kabin Ceremony",
    description: "A wedding invitation from Arif & Suchana, with love and prayers.",
    images: ["/arif-suchana.webp"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f2e8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
