"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  walletName: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

function generateMockPublicKey(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  let result = ""
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  const connect = useCallback(async () => {
    setConnecting(true)
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const key = generateMockPublicKey()
    setPublicKey(key)
    setWalletName("Phantom")
    setBalance(parseFloat((Math.random() * 50 + 5).toFixed(2)))
    setConnected(true)
    setConnecting(false)
  }, [])

  const disconnect = useCallback(() => {
    setPublicKey(null)
    setWalletName(null)
    setBalance(0)
    setConnected(false)
  }, [])

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        publicKey,
        walletName,
        balance,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
