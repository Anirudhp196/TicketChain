export interface Event {
  id: string
  title: string
  artist: string
  artistAddress: string
  venue: string
  date: string
  time: string
  price: number
  totalTickets: number
  soldTickets: number
  imageUrl: string
  genre: string
  loyaltyGated: boolean
  requiredTier: "none" | "bronze" | "silver" | "gold"
}

export interface Ticket {
  id: string
  eventId: string
  eventTitle: string
  artist: string
  venue: string
  date: string
  time: string
  seatInfo: string
  mintAddress: string
  purchased: string
  imageUrl: string
}

export interface LoyaltyBadge {
  id: string
  tier: "bronze" | "silver" | "gold"
  eventsAttended: number
  nextTierAt: number
  earnedAt: string
}

export interface MarketplaceListing {
  id: string
  ticket: Ticket
  sellerAddress: string
  askingPrice: number
  originalPrice: number
  listedAt: string
}

export const MOCK_EVENTS: Event[] = [
  {
    id: "evt-001",
    title: "Midnight Frequencies",
    artist: "Luna Waves",
    artistAddress: "7xKXtg2Cw87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    venue: "The Underground",
    date: "2026-03-15",
    time: "9:00 PM",
    price: 0.5,
    totalTickets: 500,
    soldTickets: 342,
    imageUrl: "/images/event-1.jpg",
    genre: "Electronic",
    loyaltyGated: false,
    requiredTier: "none",
  },
  {
    id: "evt-002",
    title: "Acoustic Garden Sessions",
    artist: "Fern & Ivy",
    artistAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    venue: "Botanical Hall",
    date: "2026-03-22",
    time: "7:00 PM",
    price: 0.3,
    totalTickets: 200,
    soldTickets: 198,
    imageUrl: "/images/event-2.jpg",
    genre: "Acoustic",
    loyaltyGated: true,
    requiredTier: "silver",
  },
  {
    id: "evt-003",
    title: "Bass Drop Festival",
    artist: "DJ Prism",
    artistAddress: "9noXzpXnkyEcKF3AE1MNpoNEgW4MBkxtmTHmoSfivJAm",
    venue: "Riverside Arena",
    date: "2026-04-05",
    time: "8:00 PM",
    price: 1.2,
    totalTickets: 2000,
    soldTickets: 1450,
    imageUrl: "/images/event-3.jpg",
    genre: "EDM",
    loyaltyGated: false,
    requiredTier: "none",
  },
  {
    id: "evt-004",
    title: "Jazz After Dark",
    artist: "Miles Ahead Quartet",
    artistAddress: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
    venue: "Blue Note Lounge",
    date: "2026-04-12",
    time: "10:00 PM",
    price: 0.8,
    totalTickets: 150,
    soldTickets: 89,
    imageUrl: "/images/event-4.jpg",
    genre: "Jazz",
    loyaltyGated: true,
    requiredTier: "gold",
  },
  {
    id: "evt-005",
    title: "Neon Dreams Tour",
    artist: "Synthia",
    artistAddress: "3Kj9vdQf8yCmRH4GZvQaTRcfPGGm8t4vPLJxS4D8NHLY",
    venue: "Metro Hall",
    date: "2026-04-20",
    time: "8:30 PM",
    price: 0.6,
    totalTickets: 800,
    soldTickets: 612,
    imageUrl: "/images/event-5.jpg",
    genre: "Synthwave",
    loyaltyGated: false,
    requiredTier: "none",
  },
  {
    id: "evt-006",
    title: "Strings & Stories",
    artist: "Cedar Folk Collective",
    artistAddress: "BYTMr6dhUDzDxPqe2wGJYN8Mfyp4nUYpRJQN4X9g3jxq",
    venue: "Heritage Theater",
    date: "2026-05-01",
    time: "6:30 PM",
    price: 0.25,
    totalTickets: 300,
    soldTickets: 210,
    imageUrl: "/images/event-6.jpg",
    genre: "Folk",
    loyaltyGated: false,
    requiredTier: "none",
  },
]

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "tkt-001",
    eventId: "evt-001",
    eventTitle: "Midnight Frequencies",
    artist: "Luna Waves",
    venue: "The Underground",
    date: "2026-03-15",
    time: "9:00 PM",
    seatInfo: "GA Floor",
    mintAddress: "DfL5J8v7xMzRhWEnhB3n8KQ6FEkGm3mXY49RZ7pTpump",
    purchased: "2026-02-28",
    imageUrl: "/images/event-1.jpg",
  },
  {
    id: "tkt-002",
    eventId: "evt-003",
    eventTitle: "Bass Drop Festival",
    artist: "DJ Prism",
    venue: "Riverside Arena",
    date: "2026-04-05",
    time: "8:00 PM",
    seatInfo: "VIP Section B",
    mintAddress: "8xKXtg2Cw87d97TXJSDpbD5jBkheTqA83TZRuJosgBsV",
    purchased: "2026-03-01",
    imageUrl: "/images/event-3.jpg",
  },
]

export const MOCK_BADGE: LoyaltyBadge = {
  id: "badge-001",
  tier: "silver",
  eventsAttended: 7,
  nextTierAt: 10,
  earnedAt: "2026-01-15",
}

export const MOCK_MARKETPLACE: MarketplaceListing[] = [
  {
    id: "listing-001",
    ticket: {
      id: "tkt-m001",
      eventId: "evt-002",
      eventTitle: "Acoustic Garden Sessions",
      artist: "Fern & Ivy",
      venue: "Botanical Hall",
      date: "2026-03-22",
      time: "7:00 PM",
      seatInfo: "Row C Seat 14",
      mintAddress: "5zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncEV",
      purchased: "2026-02-10",
      imageUrl: "/images/event-2.jpg",
    },
    sellerAddress: "FkL2T8v7xMzRhWEnhB3n8KQ6FEkGm3mXY49RZ7pTqump",
    askingPrice: 0.45,
    originalPrice: 0.3,
    listedAt: "2026-03-01",
  },
  {
    id: "listing-002",
    ticket: {
      id: "tkt-m002",
      eventId: "evt-005",
      eventTitle: "Neon Dreams Tour",
      artist: "Synthia",
      venue: "Metro Hall",
      date: "2026-04-20",
      time: "8:30 PM",
      seatInfo: "GA Floor",
      mintAddress: "Aj9vdQf8yCmRH4GZvQaTRcfPGGm8t4vPLJxS4D8NHMY",
      purchased: "2026-02-20",
      imageUrl: "/images/event-5.jpg",
    },
    sellerAddress: "9noXzpXnkyEcKF3AE1MNpoNEgW4MBkxtmTHmoSfivJBn",
    askingPrice: 0.9,
    originalPrice: 0.6,
    listedAt: "2026-03-05",
  },
  {
    id: "listing-003",
    ticket: {
      id: "tkt-m003",
      eventId: "evt-003",
      eventTitle: "Bass Drop Festival",
      artist: "DJ Prism",
      venue: "Riverside Arena",
      date: "2026-04-05",
      time: "8:00 PM",
      seatInfo: "GA Floor",
      mintAddress: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWSI",
      purchased: "2026-02-15",
      imageUrl: "/images/event-3.jpg",
    },
    sellerAddress: "BYTMr6dhUDzDxPqe2wGJYN8Mfyp4nUYpRJQN4X9g3kxr",
    askingPrice: 1.5,
    originalPrice: 1.2,
    listedAt: "2026-03-08",
  },
]

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case "gold":
      return "text-yellow-400"
    case "silver":
      return "text-gray-300"
    case "bronze":
      return "text-orange-400"
    default:
      return "text-muted-foreground"
  }
}

export function getTierBgColor(tier: string): string {
  switch (tier) {
    case "gold":
      return "bg-yellow-400/10 border-yellow-400/30"
    case "silver":
      return "bg-gray-300/10 border-gray-300/30"
    case "bronze":
      return "bg-orange-400/10 border-orange-400/30"
    default:
      return "bg-muted border-border"
  }
}
