'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, ShoppingCart, Receipt, CreditCard, Wallet, DollarSign, Printer, X, Phone, AlertTriangle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { initiateMpesaPayment, checkMpesaPaymentStatus, simulateMpesaPrompt } from '@/lib/mpesa-api'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

interface PaymentDetails {
  method: string
  amount: number
  reference: string
  itemCount: number
  timestamp: string
}

const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: DollarSign },
  { id: 'card', name: 'Card', icon: CreditCard },
  { id: 'wallet', name: 'E-Wallet', icon: Wallet },
  { id: 'mpesa', name: 'M-Pesa', icon: Phone },
]

const LOW_STOCK_THRESHOLD = 10

export default function PointOfSale() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Widget A', price: 10.00, category: 'Widgets', stock: 50 },
    { id: 2, name: 'Gadget B', price: 15.50, category: 'Gadgets', stock: 30 },
    { id: 3, name: 'Tool C', price: 20.00, category: 'Tools', stock: 25 },
    { id: 4, name: 'Device D', price: 25.99, category: 'Devices', stock: 15 },
    { id: 5, name: 'Widget E', price: 12.99, category: 'Widgets', stock: 40 },
  ])

  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [lastPayment, setLastPayment] = useState<PaymentDetails | null>(null)
  const [change, setChange] = useState<number>(0)
  const [transactionRecords, setTransactionRecords] = useState<PaymentDetails[]>([])
  const [lowStockItems, setLowStockItems] = useState<Product[]>([])
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [mpesaName, setMpesaName] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isMpesaPromptOpen, setIsMpesaPromptOpen] = useState(false)
  const [mpesaTransactionId, setMpesaTransactionId] = useState('')

  const { toast } = useToast()

  useEffect(() => {
    updateLowStockItems()
    
    const storedTransactions = localStorage.getItem('transactions')
    if (storedTransactions) {
      setTransactionRecords(JSON.parse(storedTransactions))
    }
  }, [])

  useEffect(() => {
    updateLowStockItems()
  }, [products])

  const updateLowStockItems = () => {
    const lowStock = products.filter(product => product.stock <= LOW_STOCK_THRESHOLD)
    setLowStockItems(lowStock)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id)
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id && item.quantity < product.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId)
    if (!product || newQuantity > product.stock) return

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, newQuantity) }
        : item
    ))
  }

  const updateInventory = () => {
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePayment = async () => {
    setIsProcessingPayment(true)
    try {
      if (paymentMethod === 'cash' && paymentAmount < total) {
        toast({
          title: "Insufficient Payment",
          description: "The payment amount is less than the total.",
          variant: "destructive"
        })
        setIsProcessingPayment(false)
        return
      }

      if (paymentMethod === 'mpesa') {
        if (!mpesaPhone || !mpesaName) {
          toast({
            title: "Missing Information",
            description: "Please provide both phone number and name for M-Pesa payment.",
            variant: "destructive"
          })
          setIsProcessingPayment(false)
          return
        }

        try {
          const transactionId = await initiateMpesaPayment(mpesaPhone, total)
          setMpesaTransactionId(transactionId)
          setIsMpesaPromptOpen(true)

          toast({
            title: "M-Pesa Request Sent",
            description: "Please check your phone for the M-Pesa prompt and enter your PIN.",
          })

          const pinEntered = await simulateMpesaPrompt()

          if (!pinEntered) {
            throw new Error("M-Pesa PIN entry timed out or was cancelled.")
          }

          let paymentStatus = await checkMpesaPaymentStatus(transactionId)
          
          while (paymentStatus === 'pending') {
            await new Promise(resolve => setTimeout(resolve, 5000)) // Wait for 5 seconds before checking again
            paymentStatus = await checkMpesaPaymentStatus(transactionId)
          }

          if (paymentStatus === 'failed') {
            throw new Error("M-Pesa payment failed. Please try again.")
          }

          setIsMpesaPromptOpen(false)
        } catch (error) {
          setIsMpesaPromptOpen(false)
          toast({
            title: "M-Pesa Payment Failed",
            description: (error as Error).message,
            variant: "destructive"
          })
          setIsProcessingPayment(false)
          return
        }
      }

      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
      const payment: PaymentDetails = {
        method: paymentMethod,
        amount: total,
        reference: paymentMethod === 'mpesa' ? mpesaTransactionId : `POS-${Date.now()}`,
        itemCount,
        timestamp: new Date().toISOString(),
      }

      setLastPayment(payment)
      setChange(paymentMethod === 'cash' ? paymentAmount - total : 0)
      setIsPaymentOpen(false)
      setIsReceiptOpen(true)
      
      const updatedTransactions = [payment, ...transactionRecords]
      setTransactionRecords(updatedTransactions)
      
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions))

      const newOrder = {
        id: payment.reference,
        customer: mpesaName || 'Walk-in Customer',
        total: payment.amount,
        status: 'Paid',
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        timestamp: payment.timestamp,
        paymentType: paymentMethod,
        paymentAmount: paymentMethod === 'cash' ? paymentAmount : total,
        changeAmount: paymentMethod === 'cash' ? paymentAmount - total : 0
      }

      const storedOrders = localStorage.getItem('orders')
      const orders = storedOrders ? JSON.parse(storedOrders) : []
      localStorage.setItem('orders', JSON.stringify([newOrder, ...orders]))

      updateInventory()
      setCart([])
      setPaymentAmount(0)
      setMpesaPhone('')
      setMpesaName('')

      toast({
        title: "Sale Completed",
        description: `Transaction ${payment.reference} has been processed successfully.`,
      })
    } catch {
      toast({
        title: "Payment Error",
        description: "An error occurred while processing the payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const downloadTransactionRecords = () => {
    const headers = ['Time', 'Payment Method', 'Amount', 'Items', 'Reference']
    const csvContent = [
      headers.join(','),
      ...transactionRecords.map(record => [
        new Date(record.timestamp).toLocaleString(),
        record.method,
        formatCurrency(record.amount),
        record.itemCount,
        record.reference
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `transaction_records_${new Date().toISOString()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const Receipt = () => (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="font-bold">Kenna Business</h3>
        <p className="text-sm text-gray-500">Receipt #{lastPayment?.reference}</p>
        <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
      </div>
      
      <div className="border-t border-b py-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment ({lastPayment?.method})</span>
          <span>{formatCurrency(lastPayment?.amount || 0)}</span>
        </div>
        {change > 0 && (
          <div className="flex justify-between">
            <span>Change</span>
            <span>{formatCurrency(change)}</span>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500 pt-4">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {lowStockItems.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>The following items are low in stock:</p>
            <ul className="list-disc list-inside mt-2">
              {lowStockItems.map(item => (
                <li key={item.id}>{item.name} - Current stock: {item.stock}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0 || cart.find(item => item.id === product.id)?.quantity === product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity === item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => setCart([])}
                variant="destructive"
                disabled={cart.length === 0}
              >
                Clear Cart
              </Button>
              <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex-1"
                    disabled={cart.length === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pay
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          variant={paymentMethod === method.id ? "default" : "outline"}
                          className="flex items-center justify-center"
                        >
                          <method.icon className="mr-2 h-4 w-4" />
                          {method.name}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Amount to Pay: {formatCurrency(total)}</Label>
                      {paymentMethod === 'cash' && (
                        <div className="space-y-2">
                          <Label>Amount Received</Label>
                          <Input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          />
                          {paymentAmount > total && (
                            <Alert>
                              <AlertDescription>
                                Change to return: {formatCurrency(paymentAmount - total)}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                      {paymentMethod === 'mpesa' && (
                        <div className="space-y-2">
                          <Label>M-Pesa Phone Number</Label>
                          <Input
                            placeholder="Enter M-Pesa number"
                            type="tel"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                          />
                          <Label>Customer Name</Label>
                          <Input
                            placeholder="Enter customer name"
                            type="text"
                            value={mpesaName}
                            onChange={(e) => setMpesaName(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button onClick={handlePayment} disabled={isProcessingPayment}>
                    {isProcessingPayment ? 'Processing...' : 'Complete Payment'}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Transaction Records
            <Button onClick={downloadTransactionRecords} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{record.method}</TableCell>
                    <TableCell>{formatCurrency(record.amount)}</TableCell>
                    <TableCell>{record.itemCount}</TableCell>
                    <TableCell>{record.reference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Receipt
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </DialogTitle>
          </DialogHeader>
          <Receipt />
        </DialogContent>
      </Dialog>

      <Dialog open={isMpesaPromptOpen} onOpenChange={setIsMpesaPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>M-Pesa Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>A payment request has been sent to your phone ({mpesaPhone}).</p>
            <p>Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
            <div className="flex justify-center">
              <Phone className="h-16 w-16 text-blue-500 animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

