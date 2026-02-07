import {
  TicketIcon,
  Shield,
  Star,
  Store,
  Zap,
  Users,
} from "lucide-react"

const features = [
  {
    icon: TicketIcon,
    title: "NFT Tickets",
    description:
      "Every ticket is minted as an NFT on Solana, verifiable on-chain and stored in your wallet. No fakes, no duplicates.",
  },
  {
    icon: Star,
    title: "Loyalty Badges",
    description:
      "Earn loyalty badges by attending events. Bronze, Silver, and Gold tiers unlock early access to future ticket drops.",
  },
  {
    icon: Store,
    title: "Fair Marketplace",
    description:
      "Resale profits are split 40% artist, 40% seller, 20% platform. Scalping incentives are structurally eliminated.",
  },
  {
    icon: Shield,
    title: "Anti-Scalping",
    description:
      "On-chain cooldowns, per-address caps, and loyalty gating ensure tickets reach real fans, not bots.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Solana's sub-second finality means purchases, transfers, and resales settle immediately. No stuck transactions.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Artists manage events and track sales. Fans browse, buy, earn loyalty, and resell. Each role gets a tailored experience.",
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-t border-border bg-card px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold text-foreground md:text-4xl">
            Ticketing, reimagined
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Built from the ground up to solve the problems that plague
            traditional ticketing. Transparent, fair, and fan-first.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
