# Matcha Frontend Architecture Review

**Scope:** v0-generated frontend imported into this repo. Goal: understand UI/UX, routing, components, state, data models, and map to Solana + Anchor backend.

---

## 1. Frontend Inventory

### Framework & Router
- **Framework:** Next.js 16.1.6 (`package.json`), React 19.
- **Router:** App Router only. All routes live under `app/`.
- **Evidence:** `app/layout.tsx` (root layout), `app/page.tsx`, `app/events/[id]/page.tsx` (dynamic segment). No `pages/` directory.

### Routes & Pages (actual files used by router)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Home/landing: hero, features, how-it-works. Entry point. |
| `/select-role` | `app/select-role/page.tsx` | Post-connect: choose Artist or Fan; redirects to respective dashboard. |
| `/events` | `app/events/page.tsx` | Browse events: search, genre filter, grid of EventCards. |
| `/events/[id]` | `app/events/[id]/page.tsx` | Event detail: image, metadata, progress, price, purchase CTA (or connect/role gate). |
| `/dashboard/fan` | `app/dashboard/fan/page.tsx` | Fan dashboard: loyalty badge, stats, “My Tickets” tab, “Recommended” tab. |
| `/dashboard/artist` | `app/dashboard/artist/page.tsx` | Artist dashboard: stats, “Create Event” dialog, events table. |
| `/marketplace` | `app/marketplace/page.tsx` | Resale marketplace: list listings, buy listing with confirmation dialog. |

No other page files exist under `app/`. All of the above are used by the router.

### Key Components & Where Used

| Component | Location | Used In |
|-----------|----------|---------|
| **Navbar** | `components/navbar.tsx` | Every page (home, select-role, events, events/[id], dashboard/fan, dashboard/artist, marketplace). Uses `useWallet`, `useRole`; shows Connect Wallet or wallet dropdown + role; nav links (Dashboard, Events, Marketplace) only when `connected && role`. |
| **Wallet button** | Inline in Navbar | Same. Connect / disconnect and balance/short address in dropdown. |
| **EventCard** | `components/event-card.tsx` | `app/events/page.tsx` (browse grid), `app/dashboard/fan/page.tsx` (recommended events). Props: `event: Event` from `lib/mock-data`. |
| **Footer** | `components/footer.tsx` | Home, events list, event detail, fan dashboard, artist dashboard, marketplace. |
| **CreateEventForm** | Inline in Artist dashboard | `app/dashboard/artist/page.tsx`: Dialog with form (title, date, time, venue, supply, price SOL, loyalty gate Select). No separate component file; form is inside `<Dialog>` in the page. |
| **TicketCard** | Inline in Fan dashboard | `app/dashboard/fan/page.tsx`: each ticket rendered in a card (image, eventTitle, artist, date, venue, seatInfo, mintAddress link to Solscan). No `TicketCard` component file. |
| **ListingModal** | Inline in Marketplace | `app/marketplace/page.tsx`: `<Dialog>` for “Confirm Purchase” (listing summary, revenue breakdown, Buy button). No separate modal component. |

Landing-only components (used only on home):
- `components/landing/hero-section.tsx` — hero, connect CTA, “Get Started” → `/select-role`
- `components/landing/features-section.tsx` — feature bullets
- `components/landing/how-it-works-section.tsx` — how it works

**UI primitives:** `components/ui/*` (Button, Badge, Dialog, Input, Select, Tabs, Progress, etc.) — used across pages as needed. No custom TicketCard or EventList wrappers beyond `EventCard` and inline markup.

---

## 2. User Journeys

### Fan flow (as implemented in UI)
1. **Connect wallet** — Navbar or Hero: `connect()` from `contexts/wallet-context.tsx` (currently mock; `app/select-role/page.tsx` L36–54, `components/navbar.tsx` L138–154).
2. **Choose role** — `/select-role`: select “Fan” → `setRole("fan")` + `router.push("/dashboard/fan")` (`app/select-role/page.tsx` L15–17, L80–101).
3. **Browse events** — `/events`: list from `MOCK_EVENTS`, filter by search + genre; each item is `<EventCard event={event} />` linking to `/events/${event.id}` (`app/events/page.tsx` L14–24, L66–70).
4. **View event** — `/events/[id]`: event from `MOCK_EVENTS.find((e) => e.id === id)`; shows image, title, artist, date, time, venue, sold/total, price, loyalty badge if any, resale split info (`app/events/[id]/page.tsx` L26–55, L82–236).
5. **Buy ticket** — Same page: “Purchase for X SOL” (only if `connected && role === "fan"`). `handlePurchase` simulates 2s then sets `purchased`; no chain call (`app/events/[id]/page.tsx` L64–69, L176–194). If not connected, button links to `/select-role`.
6. **View tickets** — `/dashboard/fan`: “My Tickets” tab shows `MOCK_TICKETS` with Solscan link per mint (`app/dashboard/fan/page.tsx` L196–266).
7. **List for resale** — **Not implemented.** Fan dashboard shows tickets but no “List” or “Sell” button; only Solscan link.
8. **Buy resale** — `/marketplace`: grid of `MOCK_MARKETPLACE`; click “Buy” opens confirmation dialog; `handleBuy(listingId)` simulates 2s then sets `bought` (`app/marketplace/page.tsx` L31–36, L163–172, L183–288).

**Relevant files per step:**  
`contexts/wallet-context.tsx`, `app/select-role/page.tsx`, `app/events/page.tsx`, `components/event-card.tsx`, `app/events/[id]/page.tsx`, `app/dashboard/fan/page.tsx`, `app/marketplace/page.tsx`, `lib/mock-data.ts`.

### Organizer (Artist) flow
1. **Connect wallet** — Same as fan (Navbar / Hero).
2. **Choose role** — `/select-role`: select “Artist” → `setRole("artist")` + `router.push("/dashboard/artist")` (`app/select-role/page.tsx` L59–77).
3. **Create event** — `/dashboard/artist`: “Create Event” opens Dialog. Form: title, date, time, venue, ticket supply, price (SOL), loyalty gate (none/bronze/silver/gold). Submit runs `handleCreate`: 1.5s delay then “Event Created!” and close. No image upload, no sale windows/tiers in UI (`app/dashboard/artist/page.tsx` L80–90, L106–236).
4. **View sales / manage event** — Same page: “Your Events” table from `artistEvents = MOCK_EVENTS.slice(0, 3)` (hardcoded). Columns: event, date, venue, sold, revenue, progress bar. No edit/cancel/withdraw UI (`app/dashboard/artist/page.tsx` L264–343).

**Data each screen needs (current source):**
- Events list/detail: `Event[]` from mock.
- Event detail + purchase: single `Event` by id; wallet `connected`, `role === "fan"`.
- Fan dashboard: `Ticket[]` (my tickets), `LoyaltyBadge`, `Event[]` (recommended), wallet `balance`.
- Artist dashboard: `Event[]` (artist’s events), create form state.
- Marketplace: `MarketplaceListing[]`; wallet `connected` for buy.

---

## 3. Data Model Extraction

Inferred from `lib/mock-data.ts` and usage in components/pages. All interfaces already defined in `lib/mock-data.ts`; below is the consolidated set the UI expects.

```ts
// Event — lib/mock-data.ts L1–16
export interface Event {
  id: string
  title: string
  artist: string
  artistAddress: string
  venue: string
  date: string       // ISO date
  time: string
  price: number     // SOL
  totalTickets: number
  soldTickets: number
  imageUrl: string
  genre: string
  loyaltyGated: boolean
  requiredTier: "none" | "bronze" | "silver" | "gold"
}

// Ticket — lib/mock-data.ts L18–29
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
  purchased: string  // date
  imageUrl: string
}

// Listing — lib/mock-data.ts L39–46
export interface MarketplaceListing {
  id: string
  ticket: Ticket
  sellerAddress: string
  askingPrice: number  // SOL
  originalPrice: number
  listedAt: string
}

// Loyalty / Tier — lib/mock-data.ts L31–37
export interface LoyaltyBadge {
  id: string
  tier: "bronze" | "silver" | "gold"
  eventsAttended: number
  nextTierAt: number   // events needed for next tier
  earnedAt: string
}
```

**UserProfile (identity):** No explicit UserProfile type. Identity is implied by:
- Wallet: `publicKey`, `walletName`, `balance` from `contexts/wallet-context.tsx` (L11–18).
- Role: `role: "artist" | "fan" | null` from `contexts/role-context.tsx` (L11–16).
- Loyalty: `LoyaltyBadge` used on fan dashboard; no profile “page” or dedicated type.

**Additional UI expectations:**
- Event: `imageUrl` optional in practice (fallback `/placeholder.svg` in `app/events/[id]/page.tsx` L87, `components/event-card.tsx` L24).
- Event detail shows “Resale Revenue Split” (40/40/20) and optional `loyaltyGated` + `requiredTier` badge.
- Ticket: `mintAddress` for Solscan link (`app/dashboard/fan/page.tsx` L237–248).
- Listing: `ticket`, `askingPrice`, `originalPrice`, `sellerAddress` for card and modal.

---

## 4. State + API Surface

### State
- **React Context (no Zustand/Redux):**
  - **Wallet:** `contexts/wallet-context.tsx` — `connected`, `connecting`, `publicKey`, `walletName`, `balance`, `connect()`, `disconnect()`. All mock (random key, Phantom label, random balance).
  - **Role:** `contexts/role-context.tsx` — `role`, `setRole()`, `clearRole()`. In-memory only; cleared on disconnect in Navbar (`components/navbar.tsx` L32–35).
- **Component state:** Local `useState` for:
  - Events page: `search`, `selectedGenre` (`app/events/page.tsx` L14–15).
  - Event detail: `purchasing`, `purchased` (`app/events/[id]/page.tsx` L34–35).
  - Fan dashboard: none beyond context.
  - Artist dashboard: `dialogOpen`, `created` (`app/dashboard/artist/page.tsx` L70–71).
  - Marketplace: `buying`, `bought`, `selectedListing` (`app/marketplace/page.tsx` L27–29).
- **Data source:** All list/detail data from `lib/mock-data.ts` (`MOCK_EVENTS`, `MOCK_TICKETS`, `MOCK_BADGE`, `MOCK_MARKETPLACE`). No persistence, no server.

### API
- **No API layer.** No `fetch`/`axios`/`useSWR`/`useQuery` for app data (only Embla `api` in carousel). No `/api/*` routes or `next.config` rewrites to a backend.
- **Proposed minimal API client and endpoints** (for a future backend or RPC/read layer):

| Purpose | Method | Endpoint (suggestion) | Returns |
|---------|--------|------------------------|---------|
| List events | GET | `/api/events` or read from chain/indexer | `Event[]` |
| Event by id | GET | `/api/events/[id]` or PDA read | `Event` |
| Create event | POST | `/api/events` or relay to Anchor | `{ eventId }` or tx sig |
| My tickets | GET | `/api/tickets?wallet=...` or derive from wallet NFTs | `Ticket[]` |
| My loyalty | GET | `/api/loyalty?wallet=...` or FanProfile PDA | `LoyaltyBadge` |
| Marketplace listings | GET | `/api/listings` or Listings PDAs | `MarketplaceListing[]` |
| List ticket | POST | `/api/listings` or relay | `{ listingId }` or tx sig |
| Buy primary | POST | `/api/tickets/buy` or relay | `{ mint, tx }` |
| Buy listing | POST | `/api/listings/buy` or relay | `{ tx }` |

Implement in e.g. `lib/api.ts` or `lib/client.ts`, and replace `MOCK_*` usage with these calls (with loading/error handling).

---

## 5. Solana Integration Mapping (Target Architecture)

| UI action | Required data | Proposed API/relay | Solana / Anchor instruction (or flow) |
|-----------|----------------|--------------------|----------------------------------------|
| **Wallet connect** | — | N/A (client-only) | **Solana Wallet Adapter** (e.g. `@solana/wallet-adapter-react`). Replace mock in `contexts/wallet-context.tsx` with adapter’s `useWallet`, balance from `connection.getBalance(publicKey)`. |
| **Create event** | title, date, time, venue, supply, price, loyalty tier | POST `/api/events` or direct `program.methods.createEvent(...).accounts(...).rpc()` | **Anchor: create_event** — Create Event PDA (title, venue, date/time, supply, price, organizer pubkey, required_tier); optionally emit event for indexer. |
| **Buy ticket** | eventId, wallet | POST `/api/tickets/buy` or frontend builds tx | **Anchor: buy_ticket** — Validate event/sale, transfer SOL to event/treasury, **mint NFT** (SPL Token + Metaplex metadata: event id, seat/serial, image URI). |
| **View tickets** | wallet | GET from indexer or `/api/tickets?wallet=` | Read **wallet’s token accounts** for program’s mint authority / NFT collection; parse Metaplex metadata → `Ticket[]`. |
| **List ticket** | mint (NFT), asking price | POST `/api/listings` or frontend builds tx | **Anchor: list** — Create Listing PDA (mint, seller, asking_price, event_id), **escrow**: transfer NFT to PDA or delegate authority so listing can transfer on sale. |
| **Buy listing** | listingId, wallet | POST `/api/listings/buy` or frontend builds tx | **Anchor: buy_listing** — Transfer buyer SOL to listing PDA; split 40% artist / 40% seller / 20% platform; **transfer NFT** from escrow to buyer; close listing PDA. |
| **Loyalty update** | — | Backend or cron after event | **Anchor: confirm_attendance** or **update_loyalty** — Verify proof (e.g. NFT held or scan), update **FanProfile PDA** (events_attended, tier); optionally issue loyalty NFT/badge. |

**Relay flow:** If backend holds keys for splits/platform, “API” can mean: frontend sends params → backend builds and signs partial tx or full tx → returns tx for wallet to sign (e.g. only user’s signature) and submit. Alternatively, frontend builds full tx with Anchor and only user signs.

---

## 6. Deliverables

### 6.1 One-Page Architecture Summary

- **Stack:** Next.js 16 (App Router), React 19, Tailwind, Radix UI primitives.
- **Routes:** `/` (home), `/select-role`, `/events`, `/events/[id]`, `/dashboard/fan`, `/dashboard/artist`, `/marketplace`. All under `app/`.
- **State:** Two React contexts — Wallet (mock) and Role; no global store. All list/detail data from `lib/mock-data.ts`.
- **Key components:** Navbar (wallet + role-aware nav), EventCard (events + recommended), Footer; Create Event (dialog in artist page); Ticket list and Listing modal inline in Fan dashboard and Marketplace.
- **Data:** Event, Ticket, MarketplaceListing, LoyaltyBadge (and wallet/role) drive the UI; no API yet.

### 6.2 Table: UI Action → Data → Endpoint → Solana Instruction

| UI action | Required data | API endpoint (proposed) | Solana instruction / flow |
|-----------|----------------|--------------------------|----------------------------|
| Connect wallet | — | — | Solana Wallet Adapter in `wallet-context.tsx` |
| Select role | — | — | Client state only (`role-context`) |
| Browse events | — | GET `/api/events` (or indexer) | Read Event PDAs or indexer |
| View event | `id` | GET `/api/events/[id]` | Read Event PDA |
| Create event | form: title, date, time, venue, supply, price, loyalty tier | POST `/api/events` (relay) | `create_event` → Event PDA |
| Buy ticket (primary) | eventId, wallet | POST `/api/tickets/buy` (relay) | `buy_ticket` → mint NFT, transfer SOL |
| View my tickets | wallet | GET `/api/tickets?wallet=` | Wallet token accounts + metadata |
| List for resale | mint, askingPrice | POST `/api/listings` (relay) | `list` → Listing PDA + escrow/delegate |
| Browse marketplace | — | GET `/api/listings` | Read Listing PDAs |
| Buy listing | listingId, wallet | POST `/api/listings/buy` (relay) | `buy_listing` → split SOL, transfer NFT |
| Fan loyalty display | wallet | GET `/api/loyalty?wallet=` | Read FanProfile PDA |
| Confirm attendance | — | Backend/cron | `confirm_attendance` / `update_loyalty` → FanProfile PDA |

### 6.3 Prioritized TODO List for Integration

| Prio | Task | Where | Notes |
|------|-----|--------|--------|
| **P0** | Replace mock wallet with Solana Wallet Adapter | `contexts/wallet-context.tsx` | Use `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`; wrap app in `WalletProvider`; get balance via `connection.getBalance(publicKey)`. |
| **P0** | Implement API client and replace mock events | `lib/api.ts` (new), `app/events/page.tsx`, `app/events/[id]/page.tsx` | Add `getEvents()`, `getEvent(id)`; call from pages; loading/error states. Point to backend or RPC/indexer. |
| **P0** | Wire “Purchase” to Anchor buy_ticket | `app/events/[id]/page.tsx` L64–69, L176–194 | Build/sign tx (or call relay), then refresh event + user tickets. |
| **P0** | Wire “Create Event” to Anchor create_event | `app/dashboard/artist/page.tsx` L80–90, L129–232 | Submit form to program; get event id / PDA; optionally upload image (IPFS/Arweave) and pass URI. |
| **P1** | Fetch “My tickets” from chain/indexer | `app/dashboard/fan/page.tsx` L198–266 | Replace `MOCK_TICKETS` with API or wallet NFT fetch; map to `Ticket[]`. |
| **P1** | Fetch marketplace listings from chain | `app/marketplace/page.tsx` L68–179 | Replace `MOCK_MARKETPLACE` with GET listings; show loading. |
| **P1** | Wire “Buy” listing to Anchor buy_listing | `app/marketplace/page.tsx` L31–36, L273–281 | Build/sign buy_listing tx (or relay); refresh listings and “my tickets”. |
| **P2** | Add “List for resale” on Fan dashboard | `app/dashboard/fan/page.tsx` (ticket cards) | Per-ticket “List” button → modal (asking price) → call list instruction or POST `/api/listings`. |
| **P2** | Fetch loyalty badge from FanProfile PDA | `app/dashboard/fan/page.tsx` L36–94 | Replace `MOCK_BADGE` with GET loyalty; show tier and progress. |
| **P2** | Artist events from chain/indexer | `app/dashboard/artist/page.tsx` L38, L265–343 | Replace `artistEvents = MOCK_EVENTS.slice(0,3)` with events by `organizer = wallet.publicKey`. |
| **P3** | Create event: image upload + sale windows/tiers | `app/dashboard/artist/page.tsx` (Create Event form) | Optional: image URL or upload (IPFS/Arweave); multiple sale windows or price tiers if Anchor supports. |
| **P3** | Confirm attendance / update loyalty | Backend or post-event flow | Call `confirm_attendance` / `update_loyalty` when fan proves attendance; refresh loyalty on fan dashboard. |

**File pointers:**
- Wallet: `contexts/wallet-context.tsx` (entire file).
- Role: `contexts/role-context.tsx` (no change for Solana; keep as-is).
- Events data: `lib/mock-data.ts` (MOCK_EVENTS) → replace with `lib/api.ts` or chain reads in `app/events/page.tsx`, `app/events/[id]/page.tsx`.
- Purchase: `app/events/[id]/page.tsx` `handlePurchase`, purchase button block.
- Create event: `app/dashboard/artist/page.tsx` Dialog form and `handleCreate`.
- Tickets list: `app/dashboard/fan/page.tsx` MOCK_TICKETS and ticket card map.
- Marketplace: `app/marketplace/page.tsx` MOCK_MARKETPLACE, `handleBuy`, Buy button and dialog.
- List for resale: not present; add in fan dashboard ticket card + new modal or page.

---

*All conclusions above are from the current codebase; file paths and line references point to the actual implementation.*
