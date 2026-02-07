export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-xs font-bold text-primary-foreground">
              M
            </span>
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            Matcha
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Fair concert ticketing on Solana. Built by fans, for fans.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Docs
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            GitHub
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}
