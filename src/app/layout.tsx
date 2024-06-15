import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

import Providers from "@/providers";
import "./globals.css";

const font = IBM_Plex_Mono({ subsets: ["latin"], weight: "300" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
