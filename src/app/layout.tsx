import { SiteHeader } from "@/components/layouts/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";

import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

import { CaslProvider } from "@/providers/casl-provider";
import { QueryProvider } from "@/providers/query-client-provider";
import SessionProviderForClient from "@/providers/session-provider-for-client";
import { fontMono, fontSans, fontSerif } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "table",
    "react-table",
    "tanstack-table",
    "shadcn-table",
    "tablecn",
  ],
  authors: [
    {
      name: "sadmann7",
      url: "https://www.sadmn.com",
    },
  ],
  creator: "sadmann7",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@sadmann17",
  },
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontSerif.variable,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div> */}
          <Suspense>
            <SessionProviderForClient>
              <CaslProvider>
                <QueryProvider>{children}</QueryProvider>
              </CaslProvider>
            </SessionProviderForClient>
          </Suspense>
          <TailwindIndicator />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
