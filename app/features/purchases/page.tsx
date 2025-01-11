'use client'

import { useState } from 'react'
import { ShoppingBag, Plus, Filter } from 'lucide-react'
import { FeaturePageTemplate } from '@/components/feature-page-template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PurchaseManagement() {
  const [purchases] = useState([
    { id: 1, supplier: 'ABC Corp', amount: 1500.00, status: 'Received' },
    { id: 2, supplier: 'XYZ Inc', amount: 2000.50, status: 'Pending' },
    { id: 3, supplier: '123 Distributors', amount: 750.25, status: 'Ordered' },
  ])

  return (
    <FeaturePageTemplate
      title="Purchase Management"
      description="Keep track of purchase orders and manage suppliers/vendors in one place."
      Icon={ShoppingBag}
    >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Input className="max-w-sm" placeholder="Search purchases..." />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Purchase Order
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.id}</TableCell>
                <TableCell>{purchase.supplier}</TableCell>
                <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                <TableCell>{purchase.status}</TableCell>
                <TableCell>
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

