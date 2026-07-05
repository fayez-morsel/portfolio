import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Anton, Montserrat, Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Alex Turner | Premium 3D Designer Portfolio",
  description: "Alex Turner - Premium 3D Designer Portfolio. Recreated 1:1 with hardware-accelerated 3D meshes, mouse-tracking, and fluid interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakarta.variable} ${anton.variable} ${montserrat.variable} ${bebasNeue.variable} ${poppins.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-[#09090B] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
