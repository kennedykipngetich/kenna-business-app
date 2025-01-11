import AnalyticsDashboard from '@/components/features/analytics-dasboard'
import { AuthCheck } from '@/components/auth-check'

export default function AnalyticsPage() {
  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <AnalyticsDashboard />
      </div>
    </AuthCheck>
  )
}

