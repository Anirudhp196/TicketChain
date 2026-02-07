"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export type UserRole = "artist" | "fan" | null

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  clearRole: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null)

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole)
  }, [])

  const clearRole = useCallback(() => {
    setRoleState(null)
  }, [])

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
