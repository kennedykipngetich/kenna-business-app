'use client'

import { useState } from 'react'
import { Plus, Filter, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  reorderPoint: number;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Widget A', quantity: 100, reorderPoint: 20 },
    { id: 2, name: 'Gadget B', quantity: 15, reorderPoint: 25 },
    { id: 3, name: 'Tool C', quantity: 50, reorderPoint: 10 },
    { id: 4, name: 'Device D', quantity: 0, reorderPoint: 5 },
  ])
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 0, reorderPoint: 0 })

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = 
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && item.quantity > item.reorderPoint) ||
      (stockFilter === 'low-stock' && item.quantity > 0 && item.quantity <= item.reorderPoint) ||
      (stockFilter === 'out-of-stock' && item.quantity === 0)
    return matchesSearch && matchesFilter
  })

  const lowStockItems = inventory.filter(item => item.quantity > 0 && item.quantity <= item.reorderPoint)

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity >= 0 && newItem.reorderPoint >= 0) {
      setInventory([...inventory, { ...newItem, id: inventory.length + 1 }])
      setNewItem({ name: '', quantity: 0, reorderPoint: 0 })
      setIsAddItemOpen(false)
    } else {
      alert('Please fill all fields correctly')
    }
  }

  return (
    <div className="space-y-8">
      {lowStockItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {lowStockItems.length} item(s) are below the reorder point. Consider restocking soon.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input 
            className="max-w-sm" 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Label htmlFor="stockFilter">Stock Filter</Label>
          <select
            id="stockFilter"
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory. Fill in all the required fields.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorderPoint" className="text-right">
                  Reorder Point
                </Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  value={newItem.reorderPoint}
                  onChange={(e) => setNewItem({ ...newItem, reorderPoint: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Reorder Point</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.reorderPoint}</TableCell>
              <TableCell>
                {item.quantity === 0 ? 'Out of Stock' : 
                 item.quantity <= item.reorderPoint ? 'Low Stock' : 'In Stock'}
              </TableCell>
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

