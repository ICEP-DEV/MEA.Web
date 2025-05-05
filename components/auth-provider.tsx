"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "tourist" | "provider" | "admin"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "tourist" | "provider") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Simple route protection
    if (!isLoading) {
      const publicRoutes = ["/", "/login", "/register"]
      const adminRoutes = ["/admin"]
      const providerRoutes = ["/accommodations/create", "/accommodations/edit"]

      if (!user && !publicRoutes.some((route) => pathname.startsWith(route))) {
        router.push("/login")
      }

      if (user && user.role !== "admin" && adminRoutes.some((route) => pathname.startsWith(route))) {
        router.push("/dashboard")
      }

      if (user && user.role !== "provider" && providerRoutes.some((route) => pathname.startsWith(route))) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser = {
        id: "user-1",
        name: "John Doe",
        email,
        role: email.includes("admin") ? "admin" : email.includes("provider") ? "provider" : "tourist",
      } as User

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: "tourist" | "provider") => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
