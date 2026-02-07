import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { WalletProvider } from "@/contexts/wallet-context"
import { RoleProvider } from "@/contexts/role-context"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Matcha | Fair Concert Ticketing on Solana",
  description:
    "Decentralized concert ticketing platform built on Solana. NFT tickets, loyalty badges, and a fair resale marketplace for artists and fans.",
}

export const viewport: Viewport = {
  themeColor: "#2d9b63",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_inter.variable} ${_spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <WalletProvider>
          <RoleProvider>{children}</RoleProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
