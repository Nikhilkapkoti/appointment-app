"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, User, Calendar, Settings, LogOut, Home, Shield, Stethoscope, Clock, BarChart3 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Toaster } from "sonner"

export function NavBar() {
  const { user, logout, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getNavItems = () => {
    const baseItems = [{ href: "/", label: "Home", icon: Home }]

    if (user?.role === "patient") {
      return [...baseItems, { href: "/my-bookings", label: "My Bookings", icon: Calendar }]
    } else if (user?.role === "doctor") {
      return [
        ...baseItems,
        { href: "/doctor/dashboard", label: "Dashboard", icon: Stethoscope },
        { href: "/doctor/schedule", label: "My Schedule", icon: Clock },
      ]
    } else if (user?.role === "admin") {
      return [
        ...baseItems,
        { href: "/admin/bookings", label: "Admin Panel", icon: Shield },
        { href: "/admin/schedules", label: "Schedules", icon: Clock },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const handleSignOut = async () => {
    await logout()
    window.location.href = "/"
  }

  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const MobileNav = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 text-lg font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          {loading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ) : !user ? (
            <div className="space-y-2 pt-4">
              <Button asChild className="w-full">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 pt-4">
              <div className="px-3 py-2 text-sm text-muted-foreground">Signed in as {user.name}</div>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">DocBook</span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-6">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="hidden md:flex animate-pulse">
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
              ) : !user ? (
                <div className="hidden md:flex space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center space-x-2 h-auto p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{getUserInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <MobileNav />
            </div>
          </div>
        </div>
      </header>
      <Toaster richColors position="top-right" />
    </>
  )
}
