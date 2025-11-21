import type { Metadata } from "next";
import {  Outfit, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const mont = Montserrat({
  variable: "--font-montserrat",
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
          <body className={`${mont.variable} antialiased`}>
              {children}
              <Toaster position="top-center" richColors />
          </body>
      </html>
  );
}
