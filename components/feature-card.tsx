import Link from 'next/link'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TypeIcon as type, LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export function FeatureCard({ title, description, icon: Icon, href }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

