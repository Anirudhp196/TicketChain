"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, ArrowRight } from "lucide-react"

export function HeroSection() {
  const { connected, connecting, connect } = useWallet()

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4">
      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-primary">
            Built on Solana
          </span>
        </div>

        <h1 className="font-display text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          Fair Tickets.
          <br />
          <span className="text-primary">Real Fans.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Matcha is a decentralized concert ticketing platform where every
          ticket is an NFT, loyalty is rewarded, and scalpers are left behind.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          {!connected ? (
            <Button
              onClick={connect}
              disabled={connecting}
              size="lg"
              className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href="/select-role">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            className="border-border bg-transparent px-8 text-foreground hover:bg-secondary"
            asChild
          >
            <a href="#features">Learn More</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          {[
            { value: "10K+", label: "Tickets Minted" },
            { value: "40/40/20", label: "Fair Resale Split" },
            { value: "< 0.001", label: "SOL per Transaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
