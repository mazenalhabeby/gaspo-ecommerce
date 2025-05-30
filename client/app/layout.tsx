import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "@/styles/globals.css"
import {NextIntlClientProvider} from "next-intl"
import ReactQueryProvider from "@/providers/ReactQueryProvider"
import {Toaster} from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
