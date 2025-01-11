'use client'

import { SetStateAction, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function MultiCurrencySupport() {
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [amount, setAmount] = useState(100)
  const [exchangeRates] = useState<{ [key: string]: number }>({
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.14,
    CAD: 1.25,
  })

  const handleCurrencyChange = (currency: SetStateAction<string>) => {
    setBaseCurrency(currency)
  }

  const handleAmountChange = (e: { target: { value: string } }) => {
    setAmount(parseFloat(e.target.value) || 0)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={baseCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(exchangeRates).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-[180px]"
            />
          </div>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Converted Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(exchangeRates).map(([currency, rate]) => (
                <TableRow key={currency}>
                  <TableCell>{currency}</TableCell>
                  <TableCell>{rate}</TableCell>
                  <TableCell>
                    {((amount / exchangeRates[baseCurrency]) * rate).toFixed(2)} {currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-06-01</TableCell>
                <TableCell>International Payment</TableCell>
                <TableCell>1000.00</TableCell>
                <TableCell>USD</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-02</TableCell>
                <TableCell>Product Purchase</TableCell>
                <TableCell>750.00</TableCell>
                <TableCell>EUR</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-03</TableCell>
                <TableCell>Service Fee</TableCell>
                <TableCell>500.00</TableCell>
                <TableCell>GBP</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Exchange Rates
        </Button>
      </div>
    </div>
  )
}

