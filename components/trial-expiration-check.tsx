'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function TrialExpirationCheck({ children }: { children: React.ReactNode }) {
  const { user, trialEnds, subscriptionEnds } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && trialEnds && new Date() > new Date(trialEnds) && !subscriptionEnds) {
      router.push('/subscription')
    }
  }, [user, trialEnds, subscriptionEnds, router])

  if (user && trialEnds && new Date() < new Date(trialEnds) && !subscriptionEnds) {
    const daysLeft = Math.ceil((new Date(trialEnds).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return (
      <>
        <Alert>
          <AlertTitle>Trial Period</AlertTitle>
          <AlertDescription>
            Your free trial ends in {daysLeft} days. Choose a subscription package to continue using Kenna.
            <Button asChild className="ml-4">
              <a href="/subscription">Choose Package</a>
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </>
    )
  }

  return <>{children}</>
}

