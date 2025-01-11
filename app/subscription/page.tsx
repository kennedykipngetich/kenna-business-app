'use client'

import { useState, useEffect, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'

const packages = [
  { name: 'Free Trial', price: 0, duration: '30' },
  { name: 'Daily', price: 5, duration: '1' },
  { name: 'Weekly', price: 25, duration: '7' },
  { name: 'Monthly', price: 80, duration: '30' },
  { name: 'Yearly', price: 800, duration: '365' },
]

export default function SubscriptionPage() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const router = useRouter()
  const { startTrial, updateSubscription, trialEnds, hasActiveSubscription } = useAuth()

  useEffect(() => {
    if (hasActiveSubscription()) {
      router.push('/features')
    }
  }, [hasActiveSubscription, router])

  const handlePackageSelection = (pkg: SetStateAction<null>) => {
    setSelectedPackage(pkg)
  }

  const handleConfirmation = async () => {
    if (!selectedPackage) return

    if (selectedPackage.name === 'Free Trial') {
      if (!trialEnds) {
        await startTrial()
      } else {
        alert('You have already used your free trial.')
        return
      }
    } else {
      await updateSubscription(selectedPackage)
    }

    router.push('/features')
  }

  if (hasActiveSubscription()) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Choose Your Package</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card 
            key={pkg.name} 
            className={`cursor-pointer ${selectedPackage === pkg ? 'border-blue-500 border-2' : ''}`}
          >
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>{pkg.duration} days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${pkg.price}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePackageSelection(pkg)}
                variant={selectedPackage === pkg ? "default" : "outline"}
                className="w-full"
              >
                Select
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button 
          onClick={handleConfirmation} 
          disabled={!selectedPackage}
          className="w-full max-w-md"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  )
}

