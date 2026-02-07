# Matcha / TicketChain Frontend Architecture Review

**Scope:** Vite React frontend in `Frontend/` (v0-generated, post–repo cleanup). Goal: understand UI/UX, routing, components, state, and map to Solana + Anchor backend.

**Codebase reference:** All paths are under `Frontend/` unless noted. Conclusions cite exact files and lines.

---

## 1. Frontend Inventory

### 1.1 Framework and router
- **Framework:** Vite 6.3.5 + React 18.3 (`Frontend/package.json`). No Next.js.
- **Router:** Client-side only via **React Router DOM** (`react-router-dom`). Routes are declared in a single `<Routes>` block.
- **Where routes live:** `Frontend/src/App.tsx` lines 26–48. No file-based routing; all routes are explicit `<Route>` elements.

**Evidence:** `Frontend/package.json` has `"vite": "6.3.5"`, `"react": "^18.3.1"`, `"react-router-dom": "*"`. `Frontend/src/main.tsx` mounts `<App />` into `#root`. `Frontend/vite.config.ts` sets `server.port: 3000`, alias `'@': path.resolve(__dirname, './src')`.

### 1.2 Major pages and purpose

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/components/LandingPage.tsx` | Home: hero (“Fair Tickets. Real Fans.”), “Built on Solana”, CTAs (Browse Events → `/events`, Learn More → `/about`), stats (10K+ tickets, 40/40/20, &lt;0.001 SOL). |
| `/events` | `src/components/EventsPage.tsx` | Browse events: in-page mock list, search/filter UI (no logic), event cards. No dedicated “event detail” page; purchase is via `/purchase/:eventId`. |
| `/marketplace` | `src/components/MarketplacePage.tsx` | Resale marketplace: mock listings, 40/40/20 explainer, “Buy Now” links to `/purchase/1` (hardcoded). |
| `/about` | `src/components/AboutPage.tsx` | About Matcha: problem/solution, traditional vs Web3 comparison, technical/hackathon content. |
| `/create-event` | `src/components/CreateEventPage.tsx` | Artist flow: create event form (name, type, date, venue, description, ticket tiers, anti-scalping options). No submit/API. |
| `/purchase/:eventId` | `src/components/PurchaseTicketPage.tsx` | Checkout: reads `eventId` from `useParams()` but uses a single mock event; order summary, wallet placeholder, “Confirm Purchase” button (no handler). |
| `/list-ticket` | `src/components/ListTicketPage.tsx` | List-for-resale: mock “Your Tickets”, select ticket + set listing price, 40/40/20 breakdown, “List Ticket” button (no handler). |

**Note:** There is **no** dedicated event-detail page (e.g. `/events/:id`). Event detail is only implied on the purchase page. There is **no** dashboard or profile page; no “view my tickets” or “manage my event” screens.

### 1.3 Key components and where they are used

| Component | Location | Used in |
|------------|----------|--------|
| **Navigation** | `src/components/Navigation.tsx` | Every page: LandingPage, EventsPage, MarketplacePage, AboutPage, CreateEventPage, PurchaseTicketPage, ListTicketPage. Fixed top nav: logo “TicketChain”, links Events / Marketplace / About, “Connect Wallet” button (no `onClick` / no wallet logic). |
| **Wallet button** | Inline in `Navigation.tsx` (lines 67–74) | Same. No context or adapter; purely presentational. |
| **Event card** | Inline in `EventsPage.tsx` (lines 159–254) | Events list only. Each item is a `motion.div` with image placeholder, title, artist, date, location, available/total, status badge, loyalty badge, price, “Get Tickets” button. **Not** a separate `EventCard` component; “Get Tickets” is a `<button>` with **no** `Link` to `/purchase/:eventId` (navigation to purchase is missing). |
| **Event list** | Same inline grid in `EventsPage.tsx` (lines 156–256) | No separate `EventList` component. |
| **Create event form** | Inline in `CreateEventPage.tsx` (lines 61–316) | Single page. Form includes: event name, type (select), date, venue, description; ticket tiers (name, price SOL, quantity) with add/remove; anti-scalping (max per wallet, transfer cooldown, loyalty early access, 40/40/20); “Create Event & Mint Tickets” / “Save as Draft”. No `onSubmit` handler or API call. |
| **Ticket card (owned)** | Inline in `ListTicketPage.tsx` (lines 101–139) | “Your Tickets” list: clickable rows showing event, artist, date, tier, purchase price; selection state only. No separate `TicketCard` component. |
| **Listing row / card** | Inline in `MarketplacePage.tsx` (lines 218–341) | Each listing: event, artist, date, seller, sellerRep, original/current price, price change %, “Buy Now” `Link` to `/purchase/1`. No modal; no separate `ListingModal`. |
| **ImageWithFallback** | `src/components/figma/ImageWithFallback.tsx` | Fallback image on error. Not referenced in the main page components reviewed; may be used in `src/imports/1512WDefault.tsx` or elsewhere. |

**UI primitives:** `src/components/ui/*` (Radix-based: button, card, dialog, input, etc.) exist but are **not** used by the main flow pages above; those pages use raw HTML + Tailwind. The app’s visible flows use custom inline markup and `motion` from `motion/react`.

---

## 2. User Journeys

### 2.1 Fan flow (as implemented)

| Step | Intended flow | Actual UI | Files / data |
|------|----------------|-----------|--------------|
| 1. Connect wallet | User connects Solana wallet | “Connect Wallet” in nav does nothing (no handler). No wallet context or adapter. | `Navigation.tsx` L67–74. |
| 2. Browse events | List events | Grid of mock events with search/filter UI (non-functional). | `EventsPage.tsx` L23–108 (mock `events`), L130–151 (search/filter), L156–256 (grid). Data: id, title, artist, date, location, price, available, total, status, loyaltyRequired, image, type. |
| 3. View event | Event detail page | **No event-detail route.** User can only go to purchase; event “detail” is the purchase page summary. | N/A. |
| 4. Buy ticket | Choose event → checkout → confirm | “Get Tickets” on event cards does **not** link to purchase (`EventsPage.tsx` L251–253 is a plain button). User can reach checkout only by: (1) going to `/marketplace` and clicking “Buy Now” (goes to `/purchase/1`), or (2) manually opening `/purchase/:eventId`. Purchase page shows one mock event; `eventId` from URL is not used to load data. | `PurchaseTicketPage.tsx` L22–32 (mock `event`: title, artist, date, location, price, tier), L66–124 (summary), L218–220 (“Confirm Purchase” button, no handler). |
| 5. View tickets | “My tickets” or wallet view | **Not implemented.** No dashboard or “My tickets” page. | N/A. |
| 6. List for resale | Select owned ticket → set price → list | List page exists with mock “Your Tickets” and price input; “List Ticket” has no handler. No wallet integration. | `ListTicketPage.tsx` L23–51 (mock `ownedTickets`: id, event, artist, date, tier, purchasePrice, suggestedPrice), L102–139 (selection), L161–192 (listing price), L319–321 (“List Ticket” button). |
| 7. Buy resale | Browse marketplace → buy listing | Marketplace shows mock listings; “Buy Now” links to `/purchase/1` (hardcoded), not a “buy this listing” flow. So “buy resale” is not distinguished from “buy primary” in routing. | `MarketplacePage.tsx` L22–75 (mock `listings`), L307–312 (Link to `/purchase/1`). |

**Summary:** Fan journey is partially wired in UI only: browse (mock), purchase page (mock event, no `eventId` load, no tx), list-ticket page (mock tickets, no list tx). Connect wallet, “view my tickets,” and true “buy resale” (by listing id) are missing or stubbed.

### 2.2 Organizer flow

| Step | Intended flow | Actual UI | Files / data |
|------|----------------|----------|--------------|
| 1. Connect wallet | Same as fan | Same: no behavior. | `Navigation.tsx`. |
| 2. Create event | Form → deploy event / mint config | Create Event page with full form; no submit handler, no API, no chain. | `CreateEventPage.tsx` L22–24 (`ticketTiers` state), L61–316 (form: details, tiers, anti-scalping). Data needed: name, type, date, venue, description; tiers (name, price SOL, quantity); max per wallet, transfer cooldown, loyalty early access, 40/40/20. |
| 3. Configure sale windows / tiers | Tiers and timing | Tiers are name/price/quantity only. No sale windows or time-based phases in UI. Loyalty early access is a single checkbox (Gold 72h, Silver 48h, Bronze 24h). | `CreateEventPage.tsx` L134–218 (tiers), L264–269 (loyalty checkbox). |
| 4. View sales / manage event | Dashboard or event management | **Not implemented.** No artist dashboard, no “my events,” no sales or analytics view. | N/A. |

**Summary:** Organizer can only fill the create-event form; no backend, no event list, no sales or management UI.

---

## 3. Data Model Extraction

Inferred from mock arrays and JSX usage in the listed files. No shared `types` or `interfaces` file exists; these are the shapes the UI expects.

### Event (browse + purchase)

**Source:** `EventsPage.tsx` L23–108 (events array), `PurchaseTicketPage.tsx` L26–32 (single event).

```ts
interface Event {
  id: number;           // EventsPage
  title: string;
  artist: string;
  date: string;        // e.g. "March 15, 2026"
  location: string;    // venue/city
  price: string | number;  // "0.5 SOL" or 0.5
  available: number;
  total: number;
  status: string;      // "On Sale" | "Almost Sold Out" | "Early Access"
  loyaltyRequired: string | null;  // e.g. "Gold" or null
  image?: string;      // placeholder description
  type: string;        // "Concert" | "Sports" | "Festival" | "Comedy" | etc.
  // Purchase page also uses:
  tier?: string;       // "General Admission"
}
```

### Ticket (owned, for listing)

**Source:** `ListTicketPage.tsx` L27–46 (ownedTickets).

```ts
interface Ticket {
  id: number;
  event: string;
  artist: string;
  date: string;
  tier: string;
  purchasePrice: number;   // SOL
  suggestedPrice: number;  // SOL
}
```

For a real integration you would also have at least: `mintAddress`, `eventId`, and optionally `imageUrl`, `seatInfo`, etc.

### Listing (marketplace resale)

**Source:** `MarketplacePage.tsx` L22–75 (listings).

```ts
interface Listing {
  id: number;
  event: string;
  artist: string;
  originalPrice: number;   // SOL
  currentPrice: number;   // SOL
  seller: string;         // truncated address
  sellerRep: string;      // "Gold" | "Silver" | "Bronze"
  date: string;
  verified: boolean;
  priceChange: number;     // percent
  listingAge: string;     // "2 hours ago"
}
```

### UserProfile / identity

**Source:** No profile page or shared user type. Wallet is only suggested in UI copy (e.g. PurchaseTicketPage “9xQe...7b3K”, ListTicketPage “Tickets loaded from your connected wallet”).

```ts
// Implied from UI copy only
interface UserProfile {
  walletAddress?: string;   // truncated display
  balanceSol?: number;
  // Loyalty/seller rep referenced as Gold/Silver/Bronze
}
```

No explicit UserProfile type in codebase.

### Loyalty / tier

**Source:** EventsPage `loyaltyRequired` (“Gold”), MarketplacePage `sellerRep` (“Gold” | “Silver” | “Bronze”), CreateEventPage loyalty early-access checkbox (Gold 72h, Silver 48h, Bronze 24h).

```ts
type LoyaltyTier = "Gold" | "Silver" | "Bronze";
// UI expects: tier label, optional early-access hours, seller rep badge
```

No `LoyaltyBadge` or FanProfile interface in code; only string usage.

### Create-event form (organizer)

**Source:** `CreateEventPage.tsx` form fields and state.

- Event: name, type (select), date, venue, description.
- Tiers: `{ name: string; price: string; quantity: string }[]`.
- Anti-scalping: max tickets per wallet (number), transfer cooldown (hours), loyalty early access (boolean), 40/40/20 resale (boolean).

---

## 4. State and API Surface

### 4.1 State

- **No global store:** No React Context, Zustand, or Redux in the app.
- **Local state only:**
  - `CreateEventPage.tsx` L22–24: `ticketTiers` (array of tier objects).
  - `ListTicketPage.tsx` L24–25: `selectedTicket` (index), `listingPrice` (string).
  - UI components under `src/components/ui/` use their own `useState`/`useEffect` (e.g. sidebar, carousel, use-mobile); not used by the main pages above.
- **No wallet state:** No adapter, no connection status, no public key or balance in state.

**Evidence:** Grep for `createContext`, `useContext`, `zustand`, `redux` in `Frontend/src` returns no matches in page components. Only `useState` in CreateEventPage and ListTicketPage.

### 4.2 API calls

- **None.** No `fetch`, `axios`, or `/api` usage in the frontend. All data is in-component mock arrays or objects.

**Evidence:** Grep for `fetch(`, `axios`, `useSWR`, `useQuery`, `/api` in `Frontend/src` shows no API usage in pages or App.

### 4.3 Proposed minimal API client and endpoints

Add a small client (e.g. `Frontend/src/lib/api.ts` or `client.ts`) and use it from the pages that currently use mocks:

| Purpose | Method | Endpoint (suggestion) | Returns |
|---------|--------|----------------------|--------|
| List events | GET | `/api/events` or indexer | `Event[]` |
| Event by id | GET | `/api/events/:id` | `Event` |
| Create event | POST | `/api/events` or relay | `{ eventId }` or tx sig |
| My tickets | GET | `/api/tickets?wallet=...` or derive from wallet | `Ticket[]` |
| Marketplace listings | GET | `/api/listings` or list PDAs | `Listing[]` |
| List ticket | POST | `/api/listings` or relay | `{ listingId }` or tx sig |
| Buy primary | POST | `/api/tickets/buy` or relay | `{ mint, tx }` |
| Buy listing | POST | `/api/listings/buy` or relay | `{ tx }` |
| Loyalty / profile | GET | `/api/loyalty?wallet=...` or FanProfile PDA | Tier + progress (if needed) |

Replace in-page mocks with these calls and add loading/error handling.

---

## 5. Solana Integration Mapping (Target Architecture)

| UI action | Required data | Proposed API / relay | Solana / Anchor instruction (or flow) |
|-----------|----------------|----------------------|----------------------------------------|
| **Wallet connect** | — | N/A (client-only) | **Solana Wallet Adapter** (e.g. `@solana/wallet-adapter-react`). Add provider in `App.tsx` or root; replace “Connect Wallet” in `Navigation.tsx` with adapter connect + disconnect and display address/balance. |
| **Create event** | Form: name, type, date, venue, description, tiers (name, price SOL, quantity), anti-scalping options | POST `/api/events` or direct `program.methods.createEvent(...).accounts(...).rpc()` | **Anchor: create_event** – Create Event PDA (title, venue, date, supply per tier, price per tier, organizer pubkey, optional loyalty/anti-scalping flags). |
| **Buy ticket (primary)** | eventId, tier, wallet | POST `/api/tickets/buy` or frontend builds tx | **Anchor: buy_ticket** – Validate event/sale, transfer SOL, **mint NFT** (SPL + Metaplex metadata: event id, tier, etc.). |
| **View tickets** | wallet | GET from indexer or `/api/tickets?wallet=` | Read wallet token accounts for program mints; parse metadata → `Ticket[]`. |
| **List ticket** | mint (NFT), asking price SOL | POST `/api/listings` or frontend builds tx | **Anchor: list** – Create Listing PDA (mint, seller, asking_price), escrow or delegate NFT authority. |
| **Buy listing** | listingId, wallet | POST `/api/listings/buy` or frontend builds tx | **Anchor: buy_listing** – Transfer SOL to listing PDA; split 40% artist / 40% seller / 20% platform; transfer NFT to buyer; close listing. |
| **Loyalty update** | — | Backend/cron or post-event | **Anchor: confirm_attendance** / **update_loyalty** – Update FanProfile PDA (events_attended, tier); optional loyalty NFT. |

---

## 6. Deliverables

### 6.1 One-page architecture summary

- **Stack:** Vite 6, React 18, React Router DOM. No Next.js. Single SPA entry: `index.html` → `main.tsx` → `App.tsx`.
- **Routes:** `/`, `/events`, `/marketplace`, `/about`, `/create-event`, `/purchase/:eventId`, `/list-ticket`. All in `App.tsx`. No event-detail route, no dashboard or profile.
- **State:** No global store. Local `useState` only in CreateEventPage (ticket tiers) and ListTicketPage (selected ticket, listing price). No wallet state.
- **Data:** All mock in-component. No API layer. Events list, marketplace listings, purchase event, owned tickets are hardcoded.
- **Key components:** Navigation (shared; wallet button non-functional), inline event cards and listing rows in Events and Marketplace, inline create-event form and list-ticket flow. No shared EventCard/EventList/CreateEventForm/TicketCard/ListingModal components; all inline.
- **Gaps:** Connect wallet, event card → purchase link, fetch event by `eventId`, submit create event, submit purchase, “my tickets” view, submit list, buy-by-listing flow.

### 6.2 Table: UI action → data → endpoint → Solana instruction

| UI action | Required data | API endpoint (proposed) | Solana instruction / flow |
|-----------|----------------|--------------------------|----------------------------|
| Connect wallet | — | — | Solana Wallet Adapter in root; wire Navigation “Connect Wallet”. |
| Browse events | — | GET `/api/events` (or indexer) | Read Event PDAs or indexer. |
| View event (detail) | event id | GET `/api/events/:id` | Read Event PDA. (Optional: add `/events/:id` page.) |
| Navigate to purchase | event id | — | Fix EventsPage: “Get Tickets” → `Link` to `/purchase/${event.id}`. |
| Load purchase page | eventId (param) | GET `/api/events/:eventId` | Read Event PDA; replace mock in PurchaseTicketPage. |
| Create event | form fields + tiers | POST `/api/events` (relay) | `create_event` → Event PDA. |
| Confirm purchase | eventId, tier, wallet | POST `/api/tickets/buy` (relay) | `buy_ticket` → mint NFT, transfer SOL. |
| View my tickets | wallet | GET `/api/tickets?wallet=` | Wallet token accounts + metadata. (Add “My tickets” page or section.) |
| List ticket | mint, askingPrice | POST `/api/listings` (relay) | `list` → Listing PDA + escrow. |
| Browse marketplace | — | GET `/api/listings` | Read Listing PDAs. |
| Buy listing | listingId, wallet | POST `/api/listings/buy` (relay) | `buy_listing` → split SOL, transfer NFT. |
| Loyalty display | wallet | GET `/api/loyalty?wallet=` | Read FanProfile PDA (if used). |

### 6.3 Prioritized TODO list for integration

| Prio | Task | Where | Notes |
|------|-----|--------|------|
| **P0** | Add Solana Wallet Adapter and wire “Connect Wallet” | `Frontend/src/App.tsx` (wrap with provider), `Frontend/src/components/Navigation.tsx` (L67–74) | Install `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`, `@solana/web3.js`. Provider at root; Navigation uses adapter’s connect/disconnect and shows address/balance. |
| **P0** | Add API client and replace mocks for events | New `Frontend/src/lib/api.ts`; `EventsPage.tsx` (L23–108, L156–256); `PurchaseTicketPage.tsx` (L22–32, use `eventId` from params) | `getEvents()`, `getEvent(id)`. EventsPage fetches on mount; PurchaseTicketPage fetches by `eventId`; loading/error states. |
| **P0** | Link event cards to purchase | `Frontend/src/components/EventsPage.tsx` L251–253 | Change “Get Tickets” from `<button>` to `<Link to={\`/purchase/${event.id}\`}>Get Tickets</Link>` (or use numeric id consistently with backend). |
| **P0** | Wire “Confirm Purchase” to Anchor buy_ticket | `Frontend/src/components/PurchaseTicketPage.tsx` L218–220 | Build/sign tx (or call relay); then refresh or redirect. |
| **P0** | Wire “Create Event & Mint Tickets” to Anchor create_event | `Frontend/src/components/CreateEventPage.tsx` L297–302, form submit | Collect form values (including controlled tier state); POST or direct program call; handle success/error. |
| **P1** | Replace marketplace mock with API | `Frontend/src/components/MarketplacePage.tsx` L22–75, L218–341 | GET listings; “Buy Now” should pass listing id (e.g. `/purchase/listing/:listingId` or dedicated buy-listing flow). |
| **P1** | Wire “Buy Now” on marketplace to buy_listing | MarketplacePage + purchase/buy flow | Distinguish primary purchase vs resale; for resale call buy_listing instruction (or relay). |
| **P1** | Replace “Your Tickets” mock with wallet/indexer | `Frontend/src/components/ListTicketPage.tsx` L27–46, L101–139 | Fetch tickets by connected wallet; show real NFTs. |
| **P1** | Wire “List Ticket” to Anchor list | `Frontend/src/components/ListTicketPage.tsx` L319–321 | Build list instruction (or relay); use selected ticket’s mint and listing price. |
| **P2** | Add event detail page (optional) | New route and component, e.g. `Frontend/src/components/EventDetailPage.tsx`, route `/events/:id` | Load event by id; show full details and “Get Tickets” → `/purchase/:id`. |
| **P2** | Add “My tickets” / dashboard | New page and nav link | List tickets for connected wallet; link to list-ticket flow. |
| **P2** | Artist dashboard / manage events | New page(s) | List events by organizer; optional sales/analytics; link from CreateEventPage or nav. |
| **P3** | Loyalty tier from chain | ListTicketPage, MarketplacePage (sellerRep), EventsPage (loyaltyRequired) | GET loyalty by wallet; display tier; enforce gating if required. |

**File pointers:**  
- Routes: `Frontend/src/App.tsx`.  
- Nav + wallet: `Frontend/src/components/Navigation.tsx`.  
- Events list + cards: `Frontend/src/components/EventsPage.tsx`.  
- Purchase flow: `Frontend/src/components/PurchaseTicketPage.tsx`.  
- Create event: `Frontend/src/components/CreateEventPage.tsx`.  
- List ticket: `Frontend/src/components/ListTicketPage.tsx`.  
- Marketplace: `Frontend/src/components/MarketplacePage.tsx`.  
- No shared types file yet; add e.g. `Frontend/src/types/index.ts` with Event, Ticket, Listing, etc., and use in API client and components.

---

*All conclusions above are from the current `Frontend/` codebase; file paths and line references are to the actual implementation.*
