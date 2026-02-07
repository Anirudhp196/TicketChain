export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Connect Your Wallet",
      description:
        "Link your Solana wallet (Phantom, Solflare, or any compatible wallet) to get started.",
    },
    {
      step: "02",
      title: "Choose Your Role",
      description:
        "Select Artist to create events and sell tickets, or Fan to browse and buy.",
    },
    {
      step: "03",
      title: "Buy or Create Events",
      description:
        "Artists set up events with ticket supply and pricing. Fans purchase NFT tickets instantly.",
    },
    {
      step: "04",
      title: "Earn & Unlock",
      description:
        "Attend events to earn loyalty badges. Higher tiers unlock early access to future drops.",
    },
  ]

  return (
    <section className="border-t border-border px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold text-foreground md:text-4xl">
            From wallet to front row
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-8 bg-border lg:block" style={{ right: '-1rem' }} />
              )}
              <div className="font-display text-4xl font-bold text-primary/20">
                {item.step}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
