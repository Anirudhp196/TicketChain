"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { MOCK_EVENTS } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const genres = ["All", "Electronic", "Acoustic", "EDM", "Jazz", "Synthwave", "Folk"]

export default function EventsPage() {
  const [search, setSearch] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")

  const filtered = MOCK_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.artist.toLowerCase().includes(search.toLowerCase())
    const matchesGenre =
      selectedGenre === "All" || event.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Events
          </h1>
          <p className="text-muted-foreground">
            Browse upcoming concerts and secure your NFT tickets.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events or artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-lg font-medium text-foreground">
              No events found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or filter.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
