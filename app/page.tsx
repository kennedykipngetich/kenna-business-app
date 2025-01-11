import { Hero } from '@/components/hero'
import { FeaturesGrid } from '@/components/features-grid'
import { AuthCheck } from '@/components/auth-check'

export default function Home() {
  return (
    <AuthCheck>
      <main>
        <Hero />
        <FeaturesGrid />
      </main>
    </AuthCheck>
  )
}

