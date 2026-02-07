"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useRole } from "@/contexts/role-context"
import { shortenAddress } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Wallet,
  LogOut,
  User,
  Music,
  TicketIcon,
  Store,
  ChevronDown,
  Loader2,
} from "lucide-react"

export function Navbar() {
  const { connected, connecting, publicKey, balance, connect, disconnect } =
    useWallet()
  const { role, clearRole } = useRole()
  const pathname = usePathname()

  const handleDisconnect = () => {
    disconnect()
    clearRole()
  }

  const navLinks =
    role === "artist"
      ? [
          { href: "/dashboard/artist", label: "Dashboard", icon: Music },
          { href: "/events", label: "Events", icon: TicketIcon },
          { href: "/marketplace", label: "Marketplace", icon: Store },
        ]
      : role === "fan"
        ? [
            { href: "/dashboard/fan", label: "Dashboard", icon: User },
            { href: "/events", label: "Events", icon: TicketIcon },
            { href: "/marketplace", label: "Marketplace", icon: Store },
          ]
        : []

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-sm font-bold text-primary-foreground">
              M
            </span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Matcha
          </span>
        </Link>

        {connected && role && (
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          {connected && publicKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-border bg-secondary text-foreground"
                >
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">
                    {shortenAddress(publicKey)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {balance} SOL
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-card text-card-foreground"
              >
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground">Connected as</p>
                  <p className="font-mono text-xs text-foreground">
                    {publicKey ? shortenAddress(publicKey, 8) : ""}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {role && (
                  <DropdownMenuItem className="text-muted-foreground">
                    Role:{" "}
                    <span className="ml-1 capitalize text-primary">
                      {role}
                    </span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={connect}
              disabled={connecting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
