'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  Users,
  Building2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  BarChart3
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

type Subscription = {
  id: string
  customerId: string
  priceId: string
  status: string
  plan: string
  amount: number
  currency: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd?: string
  customer: {
    name: string
    email: string
    type: 'agency' | 'individual'
  }
  agency?: {
    name: string
    id: string
  }
  createdAt: string
  updatedAt: string
}

type Transaction = {
  id: string
  type: 'payment' | 'refund' | 'chargeback'
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  description: string
  customer: {
    name: string
    email: string
  }
  subscription?: {
    id: string
    plan: string
  }
  createdAt: string
  stripePaymentIntentId?: string
}

type FinancialMetrics = {
  totalRevenue: number
  monthlyRevenue: number
  activeSubscriptions: number
  churnRate: number
  averageRevenuePerUser: number
  lifetimeValue: number
  pendingPayments: number
  failedPayments: number
  refunds: number
  chargebacks: number
}

const FinancialManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [activeTab, setActiveTab] = useState('subscriptions')
  const { toast } = useToast()

  useEffect(() => {
    fetchFinancialData()
  }, [searchTerm, statusFilter, planFilter])

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (planFilter !== 'all') params.append('plan', planFilter)
      
      const [subscriptionsResponse, transactionsResponse, metricsResponse] = await Promise.all([
        fetch(`/api/admin/financial/subscriptions?${params}`),
        fetch(`/api/admin/financial/transactions?${params}`),
        fetch('/api/admin/financial/metrics')
      ])
      
      const [subscriptionsData, transactionsData, metricsData] = await Promise.all([
        subscriptionsResponse.json(),
        transactionsResponse.json(),
        metricsResponse.json()
      ])
      
      if (subscriptionsResponse.ok) {
        setSubscriptions(subscriptionsData.subscriptions || [])
      }
      if (transactionsResponse.ok) {
        setTransactions(transactionsData.transactions || [])
      }
      if (metricsResponse.ok) {
        setMetrics(metricsData.metrics)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch financial data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/admin/financial/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, action: 'cancel' })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Subscription cancelled successfully'
        })
        fetchFinancialData()
      } else {
        throw new Error('Failed to cancel subscription')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive'
      })
    }
  }

  const refundPayment = async (transactionId: string, amount?: number) => {
    try {
      const response = await fetch('/api/admin/financial/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, action: 'refund', amount })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Refund processed successfully'
        })
        fetchFinancialData()
      } else {
        throw new Error('Failed to process refund')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process refund',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'past_due': return 'secondary'
      case 'canceled': return 'destructive'
      case 'trialing': return 'outline'
      case 'succeeded': return 'default'
      case 'pending': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'outline'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'secondary'
      case 'pro': return 'default'
      case 'unlimited': return 'outline'
      default: return 'destructive'
    }
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100) // Stripe amounts are in cents
  }

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.agency && sub.agency.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredTransactions = transactions.filter(txn =>
    txn.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Financial Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{metrics.activeSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Churn Rate</p>
                  <p className="text-2xl font-bold">{metrics.churnRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Metrics */}
      {metrics && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">ARPU</p>
                  <p className="text-2xl font-bold">{formatCurrency(metrics.averageRevenuePerUser)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Failed Payments</p>
                  <p className="text-2xl font-bold">{metrics.failedPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Refunds</p>
                  <p className="text-2xl font-bold">{metrics.refunds}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Chargebacks</p>
                  <p className="text-2xl font-bold">{metrics.chargebacks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-financial"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-plan-filter">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="unlimited">Unlimited</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={fetchFinancialData} variant="outline" data-testid="button-refresh-financial">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Tabs for Subscriptions and Transactions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading subscriptions...
                      </TableCell>
                    </TableRow>
                  ) : filteredSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {subscription.customer.type === 'agency' ? 
                                <Building2 className="h-5 w-5 text-primary" /> :
                                <Users className="h-5 w-5 text-primary" />
                              }
                            </div>
                            <div>
                              <div className="font-medium" data-testid={`text-customer-name-${subscription.id}`}>
                                {subscription.customer.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {subscription.customer.email}
                              </div>
                              {subscription.agency && (
                                <div className="text-xs text-muted-foreground">
                                  Agency: {subscription.agency.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPlanColor(subscription.plan)}>
                            {subscription.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(subscription.status)}>
                              {subscription.status}
                            </Badge>
                            {subscription.cancelAtPeriodEnd && (
                              <Badge variant="destructive" className="text-xs">
                                Canceling
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatCurrency(subscription.amount, subscription.currency)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              /month
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {new Date(subscription.currentPeriodStart).toLocaleDateString()} - 
                              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </div>
                            {subscription.trialEnd && (
                              <div className="text-xs text-muted-foreground">
                                Trial ends: {new Date(subscription.trialEnd).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {new Date(subscription.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedSubscription(subscription)}
                                  data-testid={`button-view-subscription-${subscription.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Subscription Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information about this subscription
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedSubscription && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="font-medium">Customer:</label>
                                        <p className="text-muted-foreground">{selectedSubscription.customer.name}</p>
                                      </div>
                                      <div>
                                        <label className="font-medium">Email:</label>
                                        <p className="text-muted-foreground">{selectedSubscription.customer.email}</p>
                                      </div>
                                      <div>
                                        <label className="font-medium">Plan:</label>
                                        <Badge variant={getPlanColor(selectedSubscription.plan)}>
                                          {selectedSubscription.plan}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="font-medium">Status:</label>
                                        <Badge variant={getStatusColor(selectedSubscription.status)}>
                                          {selectedSubscription.status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="font-medium">Amount:</label>
                                        <p className="text-muted-foreground">
                                          {formatCurrency(selectedSubscription.amount, selectedSubscription.currency)}/month
                                        </p>
                                      </div>
                                      <div>
                                        <label className="font-medium">Stripe Customer ID:</label>
                                        <p className="text-muted-foreground font-mono text-sm">
                                          {selectedSubscription.customerId}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => cancelSubscription(subscription.id)}
                                data-testid={`button-cancel-subscription-${subscription.id}`}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium" data-testid={`text-transaction-customer-${transaction.id}`}>
                              {transaction.customer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.customer.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {transaction.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transaction.status === 'succeeded' && transaction.type === 'payment' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refundPayment(transaction.id)}
                                data-testid={`button-refund-transaction-${transaction.id}`}
                              >
                                Refund
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FinancialManagement