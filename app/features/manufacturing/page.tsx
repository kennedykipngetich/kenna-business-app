'use client'

import { useState } from 'react'
import { Factory, Plus, Loader2 } from 'lucide-react'
import { FeaturePageTemplate } from '@/components/feature-page-template'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ManufacturingManagement() {
  const [productionOrders, setProductionOrders] = useState([
    { id: 1, product: 'Widget A', quantity: 1000, progress: 75, status: 'In Progress' },
    { id: 2, product: 'Gadget B', quantity: 500, progress: 100, status: 'Completed' },
    { id: 3, product: 'Tool C', quantity: 250, progress: 0, status: 'Pending' },
  ])

  return (
    <FeaturePageTemplate
      title="Manufacturing Management"
      description="Track production orders from raw materials to finished goods."
      Icon={Factory}
    >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setProductionOrders([...productionOrders, { id: productionOrders.length + 1, product: 'New Product', quantity: 0, progress: 0, status: 'Pending' }])}>
            <Plus className="mr-2 h-4 w-4" /> New Production Order
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={order.progress} className="w-[60%]" />
                    <span>{order.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Loader2 className="mr-2 h-4 w-4" />
                    Update
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

