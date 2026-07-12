import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const outfit = Outfit({ subsets: ["latin"] });
const materialSymbolsUrl =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";

export const metadata: Metadata = {
  title: "WeddingKit - Wedding Organizer",
  description: "Kelola persiapan pernikahanmu dalam satu tempat",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={materialSymbolsUrl} rel="stylesheet" />
      </head>
      <body className={outfit.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
