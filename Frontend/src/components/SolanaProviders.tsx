import { useMemo, useEffect, useState, type ReactNode } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

export function SolanaProviders({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const [wallets, setWallets] = useState<WalletAdapter[] | null>(null);

  useEffect(() => {
    async function loadAdapters() {
      const { PhantomWalletAdapter, SolflareWalletAdapter } = await import(
        '@solana/wallet-adapter-wallets'
      );
      setWallets([new PhantomWalletAdapter(), new SolflareWalletAdapter()]);
    }
    loadAdapters();
  }, []);

  if (wallets === null) {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <div className="min-h-screen flex items-center justify-center bg-[#090b0b] text-[#87928e]">
          Loading wallets…
        </div>
      </ConnectionProvider>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
