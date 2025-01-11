'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Eye, Download, ArrowUpDown, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/toaster'

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  items: { name: string; quantity: number; price: number }[];
  timestamp: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function SalesManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' })
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id' | 'timestamp'>>({
    customer: '',
    total: 0,
    status: 'Pending',
    items: []
  })
  const { toast } = useToast()

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }

    // Load customers from localStorage (in a real app, this would come from a database)
    const storedCustomers = localStorage.getItem('customers')
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    } else {
      // Initialize with some dummy data if no customers exist
      const dummyCustomers: Customer[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
      ]
      setCustomers(dummyCustomers)
      localStorage.setItem('customers', JSON.stringify(dummyCustomers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  const filteredOrders = orders.filter(order => 
    (order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  )

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleNewOrder = () => {
    if (newOrder.customer && newOrder.total > 0 && newOrder.items.length > 0) {
      const order: Order = {
        ...newOrder,
        id: `ORD-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
      setOrders([order, ...orders])
      setNewOrder({
        customer: '',
        total: 0,
        status: 'Pending',
        items: []
      })
      setIsNewOrderDialogOpen(false)
      toast({
        title: "Order Created",
        description: `New order ${order.id} has been created successfully.`,
      })
    } else {
      toast({
        title: "Invalid Order",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
    }
  }

  const addItemToNewOrder = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: '', quantity: 1, price: 0 }]
    })
  }

  const updateNewOrderItem = (index: number, field: string, value: string | number) => {
    const updatedItems = newOrder.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setNewOrder({
      ...newOrder,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
    })
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    })
  }

  const handleExportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Total', 'Status', 'Date'],
      ...sortedOrders.map(order => [
        order.id,
        order.customer,
        order.total.toFixed(2),
        order.status,
        new Date(order.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `sales_report_${new Date().toISOString()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const calculateTotalSales = () => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  const calculateAverageOrderValue = () => {
    return orders.length > 0 ? calculateTotalSales() / orders.length : 0
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            className="max-w-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Select 
                    value={newOrder.customer} 
                    onValueChange={(value) => setNewOrder({ ...newOrder, customer: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.name}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select 
                    value={newOrder.status} 
                    onValueChange={(value) => setNewOrder({ ...newOrder, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`item-${index}`} className="text-right">
                      Item {index + 1}
                    </Label>
                    <Input
                      id={`item-${index}`}
                      value={item.name}
                      onChange={(e) => updateNewOrderItem(index, 'name', e.target.value)}
                      className="col-span-3"
                      placeholder="Item name"
                    />
                    <Label htmlFor={`quantity-${index}`} className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateNewOrderItem(index, 'quantity', parseInt(e.target.value))}
                      className="col-span-3"
                    />
                    <Label htmlFor={`price-${index}`} className="text-right">
                      Price
                    </Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      value={item.price}
                      onChange={(e) => updateNewOrderItem(index, 'price', parseFloat(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                ))}
                <Button onClick={addItemToNewOrder} variant="outline">
                  Add Item
                </Button>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Total</Label>
                  <div className="col-span-3">${newOrder.total.toFixed(2)}</div>
                </div>
              </div>
              <Button onClick={handleNewOrder}>Create Order</Button>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExportOrders}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalSales().toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateAverageOrderValue().toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
              Order ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('customer')}>
              Customer {sortConfig.key === 'customer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('total')}>
              Total {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('timestamp')}>
              Date {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{new Date(order.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewOrder(order)}>View details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'Paid')}>Mark as Paid</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}>Mark as Shipped</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}>Cancel Order</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Order ID</Label>
                <div className="col-span-3">{selectedOrder.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Customer</Label>
                <div className="col-span-3">{selectedOrder.customer}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">{selectedOrder.status}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <div className="col-span-3">{new Date(selectedOrder.timestamp).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Items</Label>
                <div className="col-span-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index}>
                      {item.name} - Qty: {item.quantity} - ${item.price.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Total</Label>
                <div className="col-span-3">${selectedOrder.total.toFixed(2)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

