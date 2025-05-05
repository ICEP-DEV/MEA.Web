"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  CalendarRange,
  Home,
  Hotel,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/profile", label: "Profile", icon: Users },
    { href: "/accommodations", label: "Accommodations", icon: Hotel },
    { href: "/booking", label: "Bookings", icon: CalendarRange },
    { href: "/usage", label: "Sustainability", icon: BarChart3 },
    { href: "/rewards", label: "Rewards", icon: Trophy },
  ]

  // Admin-specific navigation items
  const adminItems = [
    { href: "/admin/dashboard", label: "Admin Dashboard", icon: ShieldCheck },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/accommodations", label: "Manage Listings", icon: Hotel },
    { href: "/admin/rewards", label: "Manage Rewards", icon: Trophy },
  ]

  // Provider-specific navigation items
  const providerItems = [
    { href: "/accommodations/create", label: "Add Listing", icon: Hotel },
    { href: "/provider/bookings", label: "Manage Bookings", icon: CalendarRange },
    { href: "/provider/analytics", label: "Analytics", icon: BarChart3 },
  ]

  // Determine which additional items to show based on user role
  const roleSpecificItems = user?.role === "admin" ? adminItems : user?.role === "provider" ? providerItems : []

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2 font-bold">
            <Leaf className="h-6 w-6 text-green-600" />
            <span>STAY GREEN</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/settings">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col space-y-6 py-4">
                    <div className="flex items-center space-x-2 px-2">
                      <Leaf className="h-6 w-6 text-green-600" />
                      <span className="font-bold">STAY GREEN</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <Button
                          key={item.href}
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className="justify-start"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </Button>
                      ))}
                      {roleSpecificItems.map((item) => (
                        <Button
                          key={item.href}
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className="justify-start"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setOpen(false)
                          logout()
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[240px] flex-col border-r bg-green-50 md:flex">
          <div className="flex flex-col space-y-6 py-4">
            <div className="flex flex-col space-y-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
              {roleSpecificItems.length > 0 && (
                <div className="my-2 px-2 py-1 text-xs font-semibold text-gray-500">
                  {user?.role === "admin" ? "ADMIN CONTROLS" : "PROVIDER CONTROLS"}
                </div>
              )}
              {roleSpecificItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="px-2 mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
