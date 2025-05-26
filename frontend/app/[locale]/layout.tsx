import type {Metadata} from "next"
import {Toaster} from "@/components/ui/sonner"

import "@/styles/globals.css"
import {NextIntlClientProvider} from "next-intl"
import {geistMono, geistSans, venusRising} from "../fonts"
import ReactQueryProvider from "@/providers/ReactQueryProvider"

export const metadata: Metadata = {
  title: "GASPO | Garden Furniture & Sports Equipment",
  description:
    "Discover premium garden furniture and sports equipment from GASPO Sportartikel- und Gartenmöbel GmbH. Designed in Austria with a focus on quality, comfort, and sustainability. Perfect for your home, garden, and active lifestyle.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${venusRising.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
