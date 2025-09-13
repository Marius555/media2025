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
  const [isHydrated, setIsHydrated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [lastCookieState, setLastCookieState] = useState(null)
  const [lastAppCookieState, setLastAppCookieState] = useState(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Cookie monitoring utilities
  const getLocalSessionCookie = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'localSession') {
        return value || null
      }
    }
    return null
  }

  const getAppSessionCookie = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'appSession') {
        return value || null
      }
    }
    return null
  }

  const deleteCookie = (name) => {
    if (typeof document === 'undefined') return
    // Delete with multiple path configurations to ensure deletion
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  }

  // Synchronize cookies - if one exists without the other, delete both
  const syncCookies = () => {
    const localCookie = getLocalSessionCookie()
    const appCookie = getAppSessionCookie()
    
    // Both should exist together or both should be missing
    const localExists = localCookie !== null
    const appExists = appCookie !== null
    
    if (localExists !== appExists) {
      console.log('Cookie mismatch detected:', { localExists, appExists })
      
      // Delete both cookies to maintain consistency
      if (localExists) {
        console.log('Deleting localSession cookie due to missing appSession')
        deleteCookie('localSession')
      }
      if (appExists) {
        console.log('Deleting appSession cookie due to missing localSession')
        deleteCookie('appSession')
      }
      
      return true // Indicates cookies were out of sync
    }
    
    return false // Cookies are in sync
  }

  // Check if either cookie was deleted or if they're out of sync
  const checkCookieDeletion = () => {
    const currentLocalCookie = getLocalSessionCookie()
    const currentAppCookie = getAppSessionCookie()
    
    const localWasDeleted = lastCookieState !== null && currentLocalCookie === null
    const appWasDeleted = lastAppCookieState !== null && currentAppCookie === null
    const cookiesOutOfSync = syncCookies()
    
    setLastCookieState(currentLocalCookie)
    setLastAppCookieState(currentAppCookie)
    
    return localWasDeleted || appWasDeleted || cookiesOutOfSync
  }

  // Track hydration status
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Check authentication status
  const checkAuthStatus = async (skipLoadingState = false) => {
    if (isCheckingAuth) return // Prevent multiple simultaneous checks
    
    try {
      if (!skipLoadingState) setIsCheckingAuth(true)
      
      // Check both cookies and sync them
      const currentLocalCookie = getLocalSessionCookie()
      const currentAppCookie = getAppSessionCookie()
      setLastCookieState(currentLocalCookie)
      setLastAppCookieState(currentAppCookie)
      
      // Synchronize cookies first
      syncCookies()
      
      // After sync, check if both cookies exist
      const finalLocalCookie = getLocalSessionCookie()
      const finalAppCookie = getAppSessionCookie()
      
      if (!finalLocalCookie || !finalAppCookie) {
        // Either cookie is missing, user should be logged out
        if (user) {
          console.log('Authentication cookies missing or invalid:', { 
            localSession: !!finalLocalCookie, 
            appSession: !!finalAppCookie 
          })
        }
        setUser(null)
        setLoading(false)
        return
      }
      
      // Both cookies exist, check with Appwrite
      const result = await getCurrentUser()
      setUser(result.success ? result.user : null)
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
      if (!skipLoadingState) setIsCheckingAuth(false)
    }
  }

  // Initial authentication check on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Add window focus and visibility change listeners for auth sync
  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        // Check for cookie deletion first, then full auth if needed
        if (checkCookieDeletion() && user) {
          console.log('Cookie deleted detected on focus, logging out user')
          setUser(null)
        } else {
          checkAuthStatus(true) // Skip loading state for background checks
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check for cookie deletion first, then full auth if needed
        if (checkCookieDeletion() && user) {
          console.log('Cookie deleted detected on visibility change, logging out user')
          setUser(null)
        } else {
          checkAuthStatus(true)
        }
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isCheckingAuth, user, lastCookieState, lastAppCookieState])

  // Cookie-specific polling (every 5 seconds when user is logged in)
  useEffect(() => {
    if (!user) return // Only poll when user is logged in
    
    const cookieInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        if (checkCookieDeletion()) {
          console.log('Cookie deletion/mismatch detected via polling, logging out user')
          setUser(null)
        }
      }
    }, 5000) // 5 seconds - more frequent for cookie detection

    return () => clearInterval(cookieInterval)
  }, [user, lastCookieState, lastAppCookieState])

  // Periodic authentication check (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && !loading) {
        checkAuthStatus(true)
      }
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [loading, isCheckingAuth])

  // Handle logout
  const handleLogout = async () => {
    try {
      await LogoutUser()
      
      // Also delete cookies client-side to ensure immediate cleanup
      deleteCookie('localSession')
      deleteCookie('appSession')
      
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      
      // Even if server logout fails, clean up client-side
      deleteCookie('localSession')
      deleteCookie('appSession')
      setUser(null)
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
  const MobileMenu = () => {
    // Don't render interactive elements until hydrated
    if (!isHydrated) {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="group md:hidden relative h-9 w-9 rounded-lg transition-all duration-300 hover:bg-secondary"
          disabled
        >
          <Menu className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )
    }

    return (
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
        <SheetContent 
          side="right" 
          className="w-80 bg-background/95 backdrop-blur-xl border-l border-border/50"
          aria-labelledby="mobile-menu-title"
          aria-describedby="mobile-menu-description"
        >
        <SheetHeader>
          <SheetTitle id="mobile-menu-title" className="sr-only">Navigation Menu</SheetTitle>
          <p id="mobile-menu-description" className="sr-only">Mobile navigation menu with account options</p>
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
  }

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
          <div suppressHydrationWarning>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
