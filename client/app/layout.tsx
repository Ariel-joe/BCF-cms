import type { Metadata } from "next";
import {  Outfit } from "next/font/google";
import "./globals.css";

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "BCF-cms",
  description: "admin portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfitSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
