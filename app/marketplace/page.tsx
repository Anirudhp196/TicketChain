"use client"

import { useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MOCK_MARKETPLACE, shortenAddress } from "@/lib/mock-data"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  ShoppingCart,
  Info,
} from "lucide-react"

export default function MarketplacePage() {
  const { connected } = useWallet()
  const [buying, setBuying] = useState<string | null>(null)
  const [bought, setBought] = useState<string | null>(null)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)

  const handleBuy = async (listingId: string) => {
    setBuying(listingId)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setBuying(null)
    setBought(listingId)
  }

  const selectedItem = MOCK_MARKETPLACE.find((l) => l.id === selectedListing)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Marketplace
          </h1>
          <p className="text-muted-foreground">
            Browse and buy verified resale tickets. Revenue is split fairly
            between artists, sellers, and the platform.
          </p>
        </div>

        {/* Revenue Split Banner */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Info className="h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            All resales enforce a{" "}
            <span className="font-medium text-foreground">
              40% Artist / 40% Seller / 20% Platform
            </span>{" "}
            revenue split, powered by on-chain smart contracts on Solana.
          </p>
        </div>

        {/* Listings */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_MARKETPLACE.map((listing) => {
            const markup = (
              ((listing.askingPrice - listing.originalPrice) /
                listing.originalPrice) *
              100
            ).toFixed(0)
            const isBought = bought === listing.id
            return (
              <div
                key={listing.id}
                className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={listing.ticket.imageUrl || "/placeholder.svg"}
                    alt={listing.ticket.eventTitle}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-display text-lg font-bold text-foreground">
                      {listing.ticket.eventTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {listing.ticket.artist}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(listing.ticket.date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.ticket.venue}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-xs text-secondary-foreground"
                    >
                      {listing.ticket.seatInfo}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Asking Price
                      </p>
                      <p className="font-display text-lg font-bold text-foreground">
                        {listing.askingPrice} SOL
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Original
                      </p>
                      <p className="text-sm text-muted-foreground line-through">
                        {listing.originalPrice} SOL
                      </p>
                      <Badge className="mt-1 border-0 bg-accent/10 text-xs text-accent">
                        <ArrowUpRight className="mr-0.5 h-3 w-3" />+{markup}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">
                      Seller:{" "}
                      <span className="font-mono">
                        {shortenAddress(listing.sellerAddress)}
                      </span>
                    </p>
                    {isBought ? (
                      <div className="flex items-center gap-1 text-sm font-medium text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        Purchased
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        disabled={!connected || buying === listing.id}
                        onClick={() => setSelectedListing(listing.id)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {buying === listing.id ? (
                          "Processing..."
                        ) : (
                          <>
                            <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                            Buy
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Purchase confirmation dialog */}
      <Dialog
        open={!!selectedListing}
        onOpenChange={() => setSelectedListing(null)}
      >
        <DialogContent className="border-border bg-card text-card-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Confirm Purchase
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 rounded-lg border border-border bg-secondary/50 p-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={selectedItem.ticket.imageUrl || "/placeholder.svg"}
                    alt={selectedItem.ticket.eventTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">
                    {selectedItem.ticket.eventTitle}
                  </p>
                  <p className="text-sm text-primary">
                    {selectedItem.ticket.artist}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedItem.ticket.seatInfo}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Revenue Breakdown
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: "Artist",
                      pct: 40,
                      amount: (selectedItem.askingPrice * 0.4).toFixed(3),
                    },
                    {
                      label: "Seller",
                      pct: 40,
                      amount: (selectedItem.askingPrice * 0.4).toFixed(3),
                    },
                    {
                      label: "Platform",
                      pct: 20,
                      amount: (selectedItem.askingPrice * 0.2).toFixed(3),
                    },
                  ].map((split) => (
                    <div
                      key={split.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {split.label} ({split.pct}%)
                      </span>
                      <span className="font-medium text-foreground">
                        {split.amount} SOL
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {selectedItem.askingPrice} SOL
                    </span>
                  </div>
                </div>
              </div>

              {bought === selectedItem.id ? (
                <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Ticket purchased!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      The NFT has been transferred to your wallet.
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => handleBuy(selectedItem.id)}
                  disabled={buying === selectedItem.id}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {buying === selectedItem.id
                    ? "Processing Transaction..."
                    : `Buy for ${selectedItem.askingPrice} SOL`}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
