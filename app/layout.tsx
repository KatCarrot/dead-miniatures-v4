import type { Metadata } from "next";
import { Bebas_Neue, Big_Shoulders_Display, Manrope } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const bigShoulders = Big_Shoulders_Display({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-big-shoulders",
});

const manrope = Manrope({
  weight: ["400", "500", "600"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
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
      className={`${bebas.variable} ${mplus.variable} ${bigShoulders.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen bg-bg font-mono text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
