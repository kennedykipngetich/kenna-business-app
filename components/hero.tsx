'use client'

import { useAuth } from './auth-provider'

export function Hero() {
  const { user } = useAuth()

  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Welcome{user ? `, ${user.username}` : ''}!
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Effortlessly <span className="text-blue-600">Manage Every Aspect</span> Of Your Business
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          POWER YOUR BUSINESS WITH KENNA&apos;S CORE FEATURES
        </p>
      </div>
    </section>
  )
}

