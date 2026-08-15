import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Berkin Yıldız — Infrastructure Console",
  description: "Personal site of Berkin Yıldız, IT Infrastructure and Network Specialist.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
