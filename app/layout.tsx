import type { Metadata } from "next";
import { Bebas_Neue, Anton, M_PLUS_Code_Latin, Manrope } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-nf",
  display: "swap",
});
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton-nf",
  display: "swap",
});
const mplus = M_PLUS_Code_Latin({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mplus-nf",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-nf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dead Miniatures",
  description: "Hand-painted miniatures studio. Nothing here is mass-made.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${anton.variable} ${mplus.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
