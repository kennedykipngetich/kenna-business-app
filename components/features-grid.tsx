import { ShoppingCart, DollarSign, ShoppingBag, Package, Users, Calculator, Factory, Terminal, Globe, BarChart } from 'lucide-react'
import { FeatureCard } from './feature-card'

const features = [
  {
    title: 'Sales Management',
    description: 'Easily manage orders, track payments, and handle invoices in real-time.',
    icon: ShoppingCart,
    href: '/features/sales',
  },
  {
    title: 'Expense Management',
    description: 'Control your costs and categorize every expense with full visibility.',
    icon: DollarSign,
    href: '/features/expenses',
  },
  {
    title: 'Purchase Management',
    description: 'Keep track of purchase orders and manage suppliers/vendors in one place.',
    icon: ShoppingBag,
    href: '/features/purchases',
  },
  {
    title: 'Inventory Management',
    description: 'Maintain optimal stock levels with predictive analytics and automated alerts.',
    icon: Package,
    href: '/features/inventory',
  },
  {
    title: 'Customer Management',
    description: 'Build strong customer relationships and manage all their information efficiently.',
    icon: Users,
    href: '/features/customers',
  },
  {
    title: 'Simplified Accounting',
    description: 'Streamline your finances with our easy-to-use accounting system.',
    icon: Calculator,
    href: '/features/accounting',
  },
  {
    title: 'Manufacturing Management',
    description: 'Track production orders from raw materials to finished goods.',
    icon: Factory,
    href: '/features/manufacturing',
  },
  {
    title: 'Point of Sale (POS)',
    description: 'Manage sales and track inventory in real-time with our POS system.',
    icon: Terminal,
    href: '/features/pos',
  },
  {
    title: 'Multi-Currency Support',
    description: 'Handle transactions in different currencies without manual conversions.',
    icon: Globe,
    href: '/features/multi-currency',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Gain insights into your business performance with interactive charts and reports.',
    icon: BarChart,
    href: '/analytics',
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

