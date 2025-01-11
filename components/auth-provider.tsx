'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: {
    username: string;
    subscriptionStartDate: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  startTrial: () => void;
  updateSubscription: (subscription: { duration: string }) => void;
  trialEnds: string | null;
  subscriptionEnds: string | null;
  hasActiveSubscription: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [trialEnds, setTrialEnds] = useState<string | null>(null)
  const [subscriptionEnds, setSubscriptionEnds] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedTrialEnds = localStorage.getItem('trialEnds')
      const storedSubscriptionEnds = localStorage.getItem('subscriptionEnds')
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser)
        }
      }
      if (storedTrialEnds) setTrialEnds(storedTrialEnds)
      if (storedSubscriptionEnds) setSubscriptionEnds(storedSubscriptionEnds)
    } catch (error) {
      console.error('Error parsing stored data:', error)
      // Clear potentially corrupted data
      localStorage.removeItem('user')
      localStorage.removeItem('trialEnds')
      localStorage.removeItem('subscriptionEnds')
    }
  }, [])

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      const newUser = { 
        username, 
        subscriptionStartDate:  new Date().toISOString()
      }
      setUser(newUser)
      try {
        localStorage.setItem('user', JSON.stringify(newUser))
      } catch (error) {
        console.error('Error storing user data:', error)
      }
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setTrialEnds(null)
    setSubscriptionEnds(null)
    localStorage.removeItem('user')
    localStorage.removeItem('trialEnds')
    localStorage.removeItem('subscriptionEnds')
    router.push('/login')
  }

  const startTrial = () => {
    if (trialEnds) return

    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 30)
    const trialEndsString = trialEndDate.toISOString()
    setTrialEnds(trialEndsString)
    localStorage.setItem('trialEnds', trialEndsString)
  }

  const updateSubscription = (subscription: {duration: string}) => {
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + parseInt(subscription.duration))
    const subscriptionEndsString = subscriptionEndDate.toISOString()
    setSubscriptionEnds(subscriptionEndsString)
    setTrialEnds(null)
    localStorage.setItem('subscriptionEnds', subscriptionEndsString)
    localStorage.removeItem('trialEnds')
  }

  const hasActiveSubscription = () => {
    const now = new Date()
    return (trialEnds !== null && now < new Date(trialEnds)) || 
           (subscriptionEnds !== null && now < new Date(subscriptionEnds))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      startTrial, 
      updateSubscription, 
      trialEnds, 
      subscriptionEnds,
      hasActiveSubscription
    }}>
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

