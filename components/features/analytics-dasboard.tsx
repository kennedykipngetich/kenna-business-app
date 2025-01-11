'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, BarChart, PieChart } from '@/components/ui/charts'

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  items: { name: string; quantity: number; price: number }[];
  timestamp: string;
}

export default function AnalyticsDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  const filterOrdersByTimeRange = (days: number) => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return orders.filter(order => new Date(order.timestamp) >= pastDate)
  }

  const filteredOrders = filterOrdersByTimeRange(timeRange === '7d' ? 7 : 30)

  const calculateTotalSales = () => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0)
  }

  const calculateAverageOrderValue = () => {
    return filteredOrders.length > 0 ? calculateTotalSales() / filteredOrders.length : 0
  }

  const getTopSellingProducts = () => {
    const productSales = {}
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.name]) {
          productSales[item.name] += item.quantity
        } else {
          productSales[item.name] = item.quantity
        }
      })
    })
    return Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  const getSalesByDay = () => {
    const salesByDay = {}
    filteredOrders.forEach(order => {
      const date = new Date(order.timestamp).toISOString().split('T')[0]
      if (salesByDay[date]) {
        salesByDay[date] += order.total
      } else {
        salesByDay[date] = order.total
      }
    })
    return Object.entries(salesByDay).sort((a, b) => a[0].localeCompare(b[0]))
  }

  const getOrderStatusDistribution = () => {
    const statusCount = {}
    filteredOrders.forEach(order => {
      if (statusCount[order.status]) {
        statusCount[order.status]++
      } else {
        statusCount[order.status] = 1
      }
    })
    return Object.entries(statusCount)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalSales().toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateAverageOrderValue().toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="status">Order Status</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={getSalesByDay()} 
                xAxis="Date" 
                yAxis="Sales ($)"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={getTopSellingProducts()} 
                xAxis="Product" 
                yAxis="Units Sold"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart 
                data={getOrderStatusDistribution()} 
                labelKey="Status" 
                valueKey="Count"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

