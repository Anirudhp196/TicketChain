"use client"

import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import {
  MOCK_TICKETS,
  MOCK_BADGE,
  MOCK_EVENTS,
  shortenAddress,
  getTierColor,
  getTierBgColor,
} from "@/lib/mock-data"
import { useWallet } from "@/contexts/wallet-context"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  TicketIcon,
  Star,
  Trophy,
  Calendar,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react"

export default function FanDashboard() {
  const { balance } = useWallet()
  const badge = MOCK_BADGE
  const progressPct = Math.round(
    (badge.eventsAttended / badge.nextTierAt) * 100
  )
  const recommended = MOCK_EVENTS.filter(
    (e) => !MOCK_TICKETS.some((t) => t.eventId === e.id)
  ).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Fan Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your tickets, loyalty, and upcoming events in one place.
          </p>
        </div>

        {/* Top Row: Loyalty + Stats */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Loyalty Card */}
          <div
            className={`col-span-1 rounded-xl border p-6 ${getTierBgColor(badge.tier)}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/50">
                <Trophy className={`h-6 w-6 ${getTierColor(badge.tier)}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loyalty Tier</p>
                <p
                  className={`font-display text-xl font-bold capitalize ${getTierColor(badge.tier)}`}
                >
                  {badge.tier}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {badge.eventsAttended} events attended
                </span>
                <span className="text-muted-foreground">
                  {badge.nextTierAt} for next tier
                </span>
              </div>
              <Progress value={progressPct} className="mt-2 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                Attend {badge.nextTierAt - badge.eventsAttended} more events to
                reach{" "}
                <span className="font-medium capitalize text-foreground">
                  {badge.tier === "silver" ? "Gold" : "Silver"}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="flex-1 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TicketIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">My Tickets</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {MOCK_TICKETS.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Wallet Balance
                  </p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {balance} SOL
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="col-span-1 rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tier Benefits
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {[
                {
                  tier: "Bronze",
                  benefit: "5% resale discount",
                  unlocked: true,
                },
                {
                  tier: "Silver",
                  benefit: "Early access (24h)",
                  unlocked: true,
                },
                {
                  tier: "Gold",
                  benefit: "Priority + exclusive drops",
                  unlocked: false,
                },
              ].map((item) => (
                <div
                  key={item.tier}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${item.unlocked ? "bg-primary" : "bg-muted-foreground/30"}`}
                    />
                    <span
                      className={`text-sm ${item.unlocked ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {item.tier}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Tickets + Recommended */}
        <Tabs defaultValue="tickets" className="mt-10">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="tickets"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              My Tickets
            </TabsTrigger>
            <TabsTrigger
              value="recommended"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recommended
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="mt-6">
            {MOCK_TICKETS.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {MOCK_TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={ticket.imageUrl || "/placeholder.svg"}
                        alt={ticket.eventTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-display font-bold text-foreground">
                          {ticket.eventTitle}
                        </p>
                        <p className="text-sm text-primary">{ticket.artist}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ticket.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ticket.venue}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-secondary text-xs text-secondary-foreground"
                        >
                          {ticket.seatInfo}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <a
                        href={`https://solscan.io/token/${ticket.mintAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-primary"
                        aria-label="View on Solscan"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <p className="font-mono text-xs text-muted-foreground">
                        {shortenAddress(ticket.mintAddress)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <TicketIcon className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-foreground">No tickets yet</p>
                <p className="text-sm text-muted-foreground">
                  Browse events to purchase your first NFT ticket.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {recommended.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View all events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
