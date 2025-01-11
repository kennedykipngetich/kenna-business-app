'use client'

import { useState } from 'react'
import { Plus, Filter, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function InventoryManagement() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Widget A', quantity: 100, reorderPoint: 20 },
    { id: 2, name: 'Gadget B', quantity: 15, reorderPoint: 25 },
    { id: 3, name: 'Tool C', quantity: 50, reorderPoint: 10 },
  ])

  return (
    <div className="space-y-8">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Low Stock Alert</AlertTitle>
        <AlertDescription>
          Gadget B is below the reorder point. Consider restocking soon.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input className="max-w-sm" placeholder="Search inventory..." />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Reorder Point</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.reorderPoint}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Adjust Stock</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

