import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { AuthProvider } from '@/components/auth-provider'
import { TrialExpirationCheck } from '@/components/trial-expiration-check'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kenna Business App',
  description: 'Manage every aspect of your business effortlessly',
  icons: {
    icon: {
      url: "/icon.svg",
      type: "image/svg+xml",
    },
    shortcut: { url: "/icon.svg", type: "image/svg+xml" },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="pt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h1 className="text-[64px] font-bold mb-4 tracking-tight">{metadata.title}</h1>
                <p className="text-xl text-gray-600 tracking-wide">{metadata.description}</p>
              </div>
              <TrialExpirationCheck>
                {children}
              </TrialExpirationCheck>
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

