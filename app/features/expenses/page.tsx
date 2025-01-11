'use client'

import { useState } from 'react'
import { Plus, Filter, Edit, Trash, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

interface Debt {
  id: number
  name: string
  amount: number
  type: 'owed' | 'owing'
  dueDate: string
}

const expenseCategories = [
  'Rent',
  'Utilities',
  'Salaries',
  'Supplies',
  'Marketing',
  'Insurance',
  'Maintenance',
  'Travel',
  'Software',
  'Taxes',
  'Miscellaneous'
]

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, description: 'Office Rent', amount: 2000.00, category: 'Rent', date: '2023-06-01' },
    { id: 2, description: 'Electricity Bill', amount: 350.50, category: 'Utilities', date: '2023-06-05' },
    { id: 3, description: 'Employee Salaries', amount: 15000.00, category: 'Salaries', date: '2023-06-15' },
    { id: 4, description: 'Office Supplies', amount: 200.75, category: 'Supplies', date: '2023-06-10' },
    { id: 5, description: 'Software Subscriptions', amount: 500.00, category: 'Software', date: '2023-06-20' },
  ])

  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'ABC Corp', amount: 5000.00, type: 'owed', dueDate: '2023-07-15' },
    { id: 2, name: 'XYZ Inc', amount: 3000.00, type: 'owing', dueDate: '2023-07-30' },
    { id: 3, name: 'John Doe', amount: 1000.00, type: 'owed', dueDate: '2023-08-05' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [newDebt, setNewDebt] = useState<Omit<Debt, 'id'>>({
    name: '',
    amount: 0,
    type: 'owed',
    dueDate: new Date().toISOString().split('T')[0]
  })

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0 && newExpense.category) {
      setExpenses([...expenses, { ...newExpense, id: expenses.length + 1 }])
      setNewExpense({
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0]
      })
      setIsAddExpenseOpen(false)
    }
  }

  const handleEditExpense = () => {
    if (editingExpense) {
      setExpenses(expenses.map(expense => 
        expense.id === editingExpense.id ? editingExpense : expense
      ))
      setEditingExpense(null)
    }
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const handleAddDebt = () => {
    if (newDebt.name && newDebt.amount > 0) {
      setDebts([...debts, { ...newDebt, id: debts.length + 1 }])
      setNewDebt({
        name: '',
        amount: 0,
        type: 'owed',
        dueDate: new Date().toISOString().split('T')[0]
      })
      setIsAddDebtOpen(false)
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalOwed = debts.filter(debt => debt.type === 'owed').reduce((sum, debt) => sum + debt.amount, 0)
  const totalOwing = debts.filter(debt => debt.type === 'owing').reduce((sum, debt) => sum + debt.amount, 0)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input 
            className="max-w-sm" 
            placeholder="Search expenses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {expenseCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details of the new expense.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(value: string) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                  {expenseCategories.map((category: string) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>
                Total Expenses: ${totalExpenses.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingExpense(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="debts">
          <Card>
            <CardHeader>
              <CardTitle>Debt Management</CardTitle>
              <CardDescription>
                Total Owed to Us: ${totalOwed.toFixed(2)} | Total We Owe: ${totalOwing.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.name}</TableCell>
                      <TableCell>${debt.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {debt.type === 'owed' ? (
                          <span className="flex items-center text-green-600">
                            <ArrowUpRight className="mr-1 h-4 w-4" /> Owed to us
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <ArrowDownRight className="mr-1 h-4 w-4" /> We owe
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{debt.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Debt
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Debt</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new debt.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="debtName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="debtName"
                        value={newDebt.name}
                        onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="debtAmount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="debtAmount"
                        type="number"
                        value={newDebt.amount}
                        onChange={(e) => setNewDebt({ ...newDebt, amount: parseFloat(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="debtType" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={newDebt.type} 
                      onValueChange={(value: 'owed' | 'owing') => setNewDebt({ ...newDebt, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owed">Owed to us</SelectItem>
                        <SelectItem value="owing">We owe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="debtDueDate" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      id="debtDueDate"
                      type="date"
                      value={newDebt.dueDate}
                      onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddDebt}>Add Debt</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Update the details of the expense.
          </DialogDescription>
        </DialogHeader>
        {editingExpense && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDescription" className="text-right">
                Description
              </Label>
              <Input
                id="editDescription"
                value={editingExpense.description}
                onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editAmount" className="text-right">
                Amount
              </Label>
              <Input
                id="editAmount"
                type="number"
                value={editingExpense.amount}
                onChange={(e) => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCategory" className="text-right">
                Category
              </Label>
                <Select 
                value={editingExpense?.category || ''} 
                onValueChange={(value: string) => setEditingExpense({ ...editingExpense, category: value })}
                >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category: string) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDate" className="text-right">
                Date
              </Label>
              <Input
                id="editDate"
                type="date"
                value={editingExpense.date}
                onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleEditExpense}>Update Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
)
}

