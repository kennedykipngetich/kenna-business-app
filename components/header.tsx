'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-provider'
import { KBAIcon } from './kba-icon'

export function Header() {
  const { user, logout, hasActiveSubscription } = useAuth()

  return (
    <header className="fixed top-0 w-full bg-white z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <KBAIcon />
          <span className="text-[#0066FF] text-2xl font-bold">Kenna</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-black">Welcome, {user.username}</span>
              {hasActiveSubscription() ? (
                <Button asChild variant="outline">
                  <Link href="/features">Features</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/subscription">Choose Plan</Link>
                </Button>
              )}
              <Button 
                onClick={logout}
                className="bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/subscription">Start Free Trial</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

