import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/header'
import { AuthCheck } from '@/components/auth-check'
import { FeaturesGrid } from '@/components/features-grid'
import { SubscriptionStatus } from '@/components/subscription-status'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kenna Business App',
  description: 'Manage every aspect of your business effortlessly',
}
export default function FeaturesPage() {
  return (
    <AuthCheck>
    <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Features Dashboard</h1>
        <SubscriptionStatus />
        <FeaturesGrid />
        
      </div>
    </AuthCheck>
  )
}

