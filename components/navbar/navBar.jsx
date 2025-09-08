"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, User, LogOut, Settings, Home, Info, Moon, Sun, Play, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { getCurrentUser } from '@/appwrite/utils/getCurrentUser'
import { LogoutUser } from '@/appwrite/utils/logoutUser'

const NavBar = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await getCurrentUser()
        setUser(result.success ? result.user : null)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await LogoutUser()
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Navigation items
  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
  ]

  // Enhanced Mobile sheet menu component
  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="group md:hidden relative h-9 w-9 rounded-lg transition-all duration-300 hover:bg-secondary"
        >
          <Menu className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Navigation Items */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </h3>
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-secondary/50 active:bg-secondary/70"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">{item.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Separator */}
          <div className="border-t border-border"></div>
          
          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </h3>
            
            {user ? (
              <div className="space-y-3">
                {/* User Info Card */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/30">
                  <div className="h-10 w-10 rounded-full border">
                    <Avatar className="h-full w-full">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-background text-foreground font-semibold">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                {/* User Actions */}
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-secondary/50 active:bg-secondary/70"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">Settings</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-destructive/10 active:bg-destructive/20 text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-secondary/50 active:bg-secondary/70"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">Sign in</span>
                </button>
                
                <button 
                  onClick={() => router.push('/signup')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 active:bg-primary/80"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Get started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container relative flex h-16 items-center justify-between">
        {/* Enhanced Logo */}
        <Link href="/" className="group flex items-center space-x-3 transition-all duration-300">
          <div className="relative">
            <div className="relative h-10 w-10 rounded-xl border transition-all duration-300 ">
              <div className="h-full w-full rounded-lg bg-background flex items-center justify-center">
                <Play className="h-5 w-5 text-primary transition-all duration-300 group-hover:text-primary/80" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-primary transition-all duration-300">
              MediaApp
            </span>
            <span className="text-xs text-muted-foreground/80 font-medium">Create • Share • Inspire</span>
          </div>
        </Link>

        {/* Enhanced Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <item.icon className="h-4 w-4 transition-all duration-300 group-hover:text-primary" />
                <span>{item.name}</span>
              </span>
              {/* Animated background */}
              <div className="absolute inset-0 rounded-lg bg-secondary/0 opacity-0 transition-all duration-300 group-hover:bg-secondary/50 group-hover:opacity-100"></div>
              {/* Animated underline */}
              <div className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Enhanced Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="group relative hidden sm:flex h-9 w-9 rounded-full bg-secondary/50 transition-all duration-300 hover:bg-secondary"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 text-amber-500 transition-all duration-500 dark:-rotate-180 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-180 scale-0 text-blue-400 transition-all duration-500 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Enhanced Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-2">
            {loading ? (
              <div className="h-9 w-9 rounded-full bg-secondary animate-pulse">
                <div className="h-full w-full rounded-full bg-secondary/50 animate-ping"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="group relative h-9 w-9 rounded-full p-0 transition-all duration-300">
                    <div className="relative h-9 w-9 rounded-full border">
                      <Avatar className="h-full w-full">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback className="bg-background text-foreground font-semibold">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full border">
                        <Avatar className="h-full w-full">
                          <AvatarImage src="" alt={user.name} />
                          <AvatarFallback className="bg-background text-foreground font-semibold">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-primary">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={() => router.push('/profile')}
                    className="group cursor-pointer p-3 transition-all duration-200 hover:bg-secondary/50"
                  >
                    <Settings className="mr-3 h-4 w-4 transition-all duration-200 group-hover:text-primary" />
                    <span className="font-medium">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="group cursor-pointer p-3 transition-all duration-200 hover:bg-destructive/10"
                  >
                    <LogOut className="mr-3 h-4 w-4 transition-all duration-200 group-hover:text-destructive" />
                    <span className="font-medium">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/login')}
                  className="group relative overflow-hidden rounded-lg px-4 py-2 font-medium transition-all duration-300 hover:bg-secondary/50"
                >
                  <span className="relative z-10 text-muted-foreground transition-colors group-hover:text-foreground">
                    Sign in
                  </span>
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => router.push('/signup')}
                  className="group relative overflow-hidden rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Get started</span>
                  </span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default NavBar
