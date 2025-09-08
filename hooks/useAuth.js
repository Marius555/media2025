"use client"
import { useState, useEffect, createContext, useContext } from 'react'
import { getCurrentUser } from '@/appwrite/utils/getCurrentUser'
import { LogoutUser } from '@/appwrite/utils/logoutUser'

const AuthContext = createContext({})

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser)
  const [loading, setLoading] = useState(!initialUser)
  const [error, setError] = useState(null)

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getCurrentUser()
      
      if (result.success) {
        setUser(result.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      setError(err.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await LogoutUser()
      setUser(null)
      // Optionally redirect or refresh the page
      window.location.href = '/'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
  }

  useEffect(() => {
    // Only check auth status if we don't have initial user data
    if (!initialUser) {
      checkAuthStatus()
    }
  }, [initialUser])

  const value = {
    user,
    loading,
    error,
    isLoggedIn: !!user,
    login,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Simple hook for components that don't need the full context
export function useAuthStatus() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser()
        setUser(result.success ? result.user : null)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, loading, isLoggedIn: !!user }
}