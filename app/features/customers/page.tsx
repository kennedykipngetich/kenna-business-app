'use client'

import { useState } from 'react'
import { Users, Plus, Search, Mail } from 'lucide-react'
import { FeaturePageTemplate } from '@/components/feature-page-template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function CustomerManagement() {
  const [customers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', totalPurchases: 1500.00 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', totalPurchases: 2200.50 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', totalPurchases: 750.25 },
  ])

  return (
    <FeaturePageTemplate
      title="Customer Management"
      description="Build strong customer relationships and manage all their information efficiently."
      Icon={Users}
    >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Input className="max-w-sm" placeholder="Search customers..." />
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Purchases</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{customer.name.split(' ').map(c => c[0]).join('')}</AvatarFallback>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${customer.name}`} />
                  </Avatar>
                  <span>{customer.name}</span>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>${customer.totalPurchases.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FeaturePageTemplate>
  )
}

