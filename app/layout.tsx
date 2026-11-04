import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A & S | Kabin Ceremony",
  description: "A special invitation celebrating the Kabin ceremony of Arif Rahman and Suchana Sarker.",
  openGraph: {
    title: "A & S | Kabin Ceremony",
    description: "You are warmly invited to celebrate with Arif & Suchana.",
    images: ["/arif-suchana.webp"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ecf3ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
