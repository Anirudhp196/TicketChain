"use client"

import React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MOCK_EVENTS } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  TicketIcon,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react"

// Simulated artist events (first 3 events belong to this artist)
const artistEvents = MOCK_EVENTS.slice(0, 3)

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ElementType
  label: string
  value: string
  subtext?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display text-xl font-bold text-foreground">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ArtistDashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [created, setCreated] = useState(false)

  const totalSold = artistEvents.reduce((s, e) => s + e.soldTickets, 0)
  const totalTickets = artistEvents.reduce((s, e) => s + e.totalTickets, 0)
  const totalRevenue = artistEvents.reduce(
    (s, e) => s + e.soldTickets * e.price,
    0
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreated(false)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCreated(true)
    setTimeout(() => {
      setDialogOpen(false)
      setCreated(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Artist Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your events, track sales, and engage with fans.
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card text-card-foreground sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">
                  Create New Event
                </DialogTitle>
              </DialogHeader>
              {created ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <p className="font-display text-lg font-bold text-foreground">
                    Event Created!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your event contract has been deployed on Solana.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title" className="text-foreground">
                      Event Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="My Concert"
                      required
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="date" className="text-foreground">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="time" className="text-foreground">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="venue" className="text-foreground">
                      Venue
                    </Label>
                    <Input
                      id="venue"
                      placeholder="The Underground"
                      required
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="supply" className="text-foreground">
                        Ticket Supply
                      </Label>
                      <Input
                        id="supply"
                        type="number"
                        placeholder="500"
                        required
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="price" className="text-foreground">
                        Price (SOL)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.5"
                        required
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="loyalty" className="text-foreground">
                      Loyalty Gate
                    </Label>
                    <Select defaultValue="none">
                      <SelectTrigger className="border-border bg-secondary text-foreground">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card text-card-foreground">
                        <SelectItem value="none">No Gate</SelectItem>
                        <SelectItem value="bronze">
                          Bronze Tier Required
                        </SelectItem>
                        <SelectItem value="silver">
                          Silver Tier Required
                        </SelectItem>
                        <SelectItem value="gold">
                          Gold Tier Required
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Deploy Event Contract
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            icon={Calendar}
            label="Active Events"
            value={String(artistEvents.length)}
          />
          <StatCard
            icon={TicketIcon}
            label="Tickets Sold"
            value={totalSold.toLocaleString()}
            subtext={`of ${totalTickets.toLocaleString()}`}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`${totalRevenue.toFixed(1)} SOL`}
          />
          <StatCard
            icon={TrendingUp}
            label="Sell-Through"
            value={`${Math.round((totalSold / totalTickets) * 100)}%`}
          />
        </div>

        {/* Events Table */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-foreground">
            Your Events
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Venue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Sold
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {artistEvents.map((event) => {
                    const pct = Math.round(
                      (event.soldTickets / event.totalTickets) * 100
                    )
                    return (
                      <tr
                        key={event.id}
                        className="border-b border-border last:border-b-0 hover:bg-card/50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.genre}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.venue}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            {event.soldTickets}/{event.totalTickets}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-display text-sm font-bold text-foreground">
                            {(event.soldTickets * event.price).toFixed(1)} SOL
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-2 w-20" />
                            <span className="text-xs text-muted-foreground">
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
