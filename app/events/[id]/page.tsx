"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MOCK_EVENTS } from "@/lib/mock-data"
import { useWallet } from "@/contexts/wallet-context"
import { useRole } from "@/contexts/role-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Lock,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  TicketIcon,
} from "lucide-react"

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const event = MOCK_EVENTS.find((e) => e.id === id)
  const { connected } = useWallet()
  const { role } = useRole()
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">
              Event not found
            </p>
            <Link
              href="/events"
              className="mt-2 text-sm text-primary hover:underline"
            >
              Back to events
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const soldPercentage = Math.round(
    (event.soldTickets / event.totalTickets) * 100
  )
  const isSoldOut = event.soldTickets >= event.totalTickets
  const remaining = event.totalTickets - event.soldTickets

  const handlePurchase = async () => {
    setPurchasing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setPurchased(true)
    setPurchasing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
              <Image
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute left-3 top-3 flex gap-2">
                <Badge className="border-0 bg-card/80 text-xs text-foreground backdrop-blur-sm">
                  {event.genre}
                </Badge>
                {event.loyaltyGated && (
                  <Badge className="border-0 bg-accent/90 text-xs text-accent-foreground backdrop-blur-sm">
                    <Lock className="mr-1 h-3 w-3" />
                    {event.requiredTier} tier required
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {event.title}
              </h1>
              <p className="mt-1 text-lg text-primary">{event.artist}</p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                {event.time}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                {event.venue}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tickets sold
                </span>
                <span className="text-sm font-medium text-foreground">
                  {event.soldTickets} / {event.totalTickets}
                </span>
              </div>
              <Progress value={soldPercentage} className="mt-2 h-2" />
              <div className="mt-2 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {remaining > 0 ? `${remaining} remaining` : "Sold out"}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-display text-xl font-bold text-foreground">
                  {event.price} SOL
                </span>
              </div>
            </div>

            {purchased ? (
              <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Ticket purchased!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your NFT ticket has been minted to your wallet.
                  </p>
                </div>
              </div>
            ) : connected && role === "fan" ? (
              <Button
                onClick={handlePurchase}
                disabled={purchasing || isSoldOut}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {purchasing ? (
                  "Minting Ticket..."
                ) : isSoldOut ? (
                  "Sold Out"
                ) : (
                  <>
                    <TicketIcon className="mr-2 h-5 w-5" />
                    Purchase for {event.price} SOL
                  </>
                )}
              </Button>
            ) : !connected ? (
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/select-role">
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet to Purchase
                </Link>
              </Button>
            ) : null}

            {/* Revenue split info */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Resale Revenue Split
              </p>
              <div className="flex gap-2">
                {[
                  { label: "Artist", pct: 40, color: "bg-primary" },
                  { label: "Seller", pct: 40, color: "bg-accent" },
                  { label: "Platform", pct: 20, color: "bg-muted-foreground" },
                ].map((split) => (
                  <div key={split.label} className="flex-1 text-center">
                    <div
                      className={`mx-auto h-2 rounded-full ${split.color}`}
                      style={{ width: `${split.pct}%`, minWidth: "1rem" }}
                    />
                    <p className="mt-2 text-xs font-medium text-foreground">
                      {split.pct}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {split.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
