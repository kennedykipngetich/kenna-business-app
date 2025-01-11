'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './auth-provider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

export function SubscriptionStatus() {
  const { user, trialEnds, subscriptionEnds } = useAuth()
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [progress, setProgress] = useState<number>(100)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const endDate = trialEnds ? new Date(trialEnds) : (subscriptionEnds ? new Date(subscriptionEnds) : null)
      if (!endDate || !user) return

      const startDate = new Date(user.subscriptionStartDate)
      const totalDuration = endDate.getTime() - startDate.getTime()
      const timeLeft = endDate.getTime() - now.getTime()
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

      const calculatedProgress = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100))
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
      setProgress(calculatedProgress)
    }

    if (user && (trialEnds || subscriptionEnds)) {
      updateTimer()
      const timer = setInterval(updateTimer, 60000) // Update every minute
      return () => clearInterval(timer)
    }
  }, [user, trialEnds, subscriptionEnds])

  if (!user || (!trialEnds && !subscriptionEnds)) return null

  return (
    <Alert variant="default" className="mb-4">
      <AlertTitle>
        {trialEnds ? 'Free Trial' : 'Subscription'} Status
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <div>User: {user.username}</div>
        <div>Time Remaining: {timeRemaining}</div>
        <Progress value={progress} />
      </AlertDescription>
    </Alert>
  )
}

