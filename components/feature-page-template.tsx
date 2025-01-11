/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthCheck } from '@/components/auth-check'
import { Button } from '@/components/ui/button'
import { TypeIcon as type, LucideIcon } from 'lucide-react'

interface FeaturePageProps {
  title: string
  description: string
  Icon: LucideIcon
  children: React.ReactNode
}

export function FeaturePageTemplate({ title, description, Icon, children }: FeaturePageProps) {
  return (
    <AuthCheck>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          
          <p className="text-gray-600 mb-8">{description}</p>
          
          {children}
        </div>
      </div>
    </AuthCheck>
  )
}

