import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthCheck } from '@/components/auth-check'

export default function Trial() {
  return (
    <AuthCheck>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Start Your Free Trial</h1>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" type="text" placeholder="Acme Inc." />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <Button type="submit" className="w-full">Start Free Trial</Button>
            </form>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}

