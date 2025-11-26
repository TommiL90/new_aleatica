import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Adamina, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

// export const fontSans = GeistSans;
// export const fontMono = GeistMono;

export const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const fontSerif = Adamina({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const fontMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
