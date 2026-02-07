import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  walletName: string | null;
  balance: number;
  walletsReady: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const {
    connected,
    connecting,
    publicKey: solanaPublicKey,
    wallet,
    disconnect: adapterDisconnect,
    connect: adapterConnect,
  } = useSolanaWallet();
  const { connection } = useConnection();
  const { visible, setVisible } = useWalletModal();
  const [balance, setBalance] = useState(0);
  const wasModalOpenRef = useRef(false);

  const walletsReady = true; // In Vite we load adapters in useEffect; could expose from SolanaProviders if needed
  const publicKey = solanaPublicKey ? solanaPublicKey.toBase58() : null;
  const walletName = wallet?.adapter.name ?? null;

  useEffect(() => {
    if (visible) {
      wasModalOpenRef.current = true;
      return;
    }
    if (!wasModalOpenRef.current) return;
    wasModalOpenRef.current = false;
    if (wallet && !connected && !connecting) {
      adapterConnect().catch(() => {});
    }
  }, [visible, wallet, connected, connecting, adapterConnect]);

  useEffect(() => {
    if (!solanaPublicKey) {
      setBalance(0);
      return;
    }
    let cancelled = false;
    connection.getBalance(solanaPublicKey).then((lamports) => {
      if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
    });
    return () => { cancelled = true; };
  }, [connection, solanaPublicKey]);

  const connect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const disconnect = useCallback(() => {
    adapterDisconnect();
  }, [adapterDisconnect]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        publicKey,
        walletName,
        balance: Math.round(balance * 100) / 100,
        walletsReady,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (ctx === undefined) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

export function shortenAddress(address: string, chars = 4) {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
