"use client"

import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useRole } from "@/contexts/role-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Music, Heart, ArrowRight, Wallet, Loader2 } from "lucide-react"

export default function SelectRolePage() {
  const router = useRouter()
  const { connected, connecting, connect } = useWallet()
  const { setRole } = useRole()

  const handleSelectRole = (role: "artist" | "fan") => {
    setRole(role)
    router.push(role === "artist" ? "/dashboard/artist" : "/dashboard/fan")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl">
            {connected ? "Choose Your Role" : "Connect to Continue"}
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            {connected
              ? "Are you here to perform or to experience? Each role gets a tailored dashboard."
              : "Connect your Solana wallet to access the Matcha platform."}
          </p>
        </div>

        {!connected ? (
          <div className="mt-12">
            <Button
              onClick={connect}
              disabled={connecting}
              size="lg"
              className="bg-primary px-10 text-primary-foreground hover:bg-primary/90"
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
          </div>
        ) : (
          <div className="mt-12 grid w-full max-w-xl gap-6 md:grid-cols-2">
            {/* Artist Card */}
            <button
              type="button"
              onClick={() => handleSelectRole("artist")}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Music className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-foreground">
                Artist
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Create events, sell NFT tickets, manage your shows, and track
                revenue.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                Enter as Artist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Fan Card */}
            <button
              type="button"
              onClick={() => handleSelectRole("fan")}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-foreground">
                Fan
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Browse events, purchase tickets, earn loyalty badges, and access
                the marketplace.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                Enter as Fan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
