"use client"

import Image from "next/image"
import Link from "next/link"
import type { Event } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Lock } from "lucide-react"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const soldPercentage = Math.round(
    (event.soldTickets / event.totalTickets) * 100
  )
  const isSoldOut = event.soldTickets >= event.totalTickets

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="border-0 bg-card/80 text-xs text-foreground backdrop-blur-sm">
              {event.genre}
            </Badge>
            {event.loyaltyGated && (
              <Badge className="border-0 bg-accent/90 text-xs text-accent-foreground backdrop-blur-sm">
                <Lock className="mr-1 h-3 w-3" />
                {event.requiredTier} tier
              </Badge>
            )}
          </div>
          {isSoldOut && (
            <div className="absolute right-3 top-3">
              <Badge
                variant="destructive"
                className="text-xs text-destructive-foreground"
              >
                Sold Out
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-display text-lg font-bold text-foreground">
              {event.title}
            </p>
            <p className="text-sm text-muted-foreground">{event.artist}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {soldPercentage}%
              </span>
            </div>
            <p className="font-display text-sm font-bold text-foreground">
              {event.price} SOL
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
