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
  Building2,
  Users,
  DollarSign,
  Eye,
  UserMinus,
  UserCheck,
  Calendar,
  TrendingUp,
  CreditCard,
  Globe,
  Settings,
  BarChart3,
  Activity,
  FileText,
  Package,
  Zap
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

type Agency = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  zipCode?: string
  state?: string
  country?: string
  agencyLogo?: string
  companyEmail?: string
  connectAccountId?: string
  goal: number
  createdAt: string
  updatedAt: string
  User: {
    name: string
    email: string
  }
  SubAccount: {
    id: string
    name: string
    createdAt: string
  }[]
  Subscription?: {
    id: string
    plan: string
    active: boolean
    priceId: string
  }
  _count?: {
    SubAccount: number
    User: number
  }
  monthlyRevenue?: number
  totalRevenue?: number
  activeWebsites?: number
  lastLoginAt?: string
}

const EnhancedAgenciesManager = () => {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAgencies()
  }, [searchTerm, statusFilter, planFilter])

  const fetchAgencies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (planFilter !== 'all') params.append('plan', planFilter)
      
      const response = await fetch(`/api/admin/agencies?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setAgencies(data.agencies || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch agencies',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const suspendAgency = async (agencyId: string) => {
    try {
      const response = await fetch('/api/admin/agencies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId, action: 'suspend' })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Agency suspended successfully'
        })
        fetchAgencies()
      } else {
        throw new Error('Failed to suspend agency')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to suspend agency',
        variant: 'destructive'
      })
    }
  }

  const activateAgency = async (agencyId: string) => {
    try {
      const response = await fetch('/api/admin/agencies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId, action: 'activate' })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Agency activated successfully'
        })
        fetchAgencies()
      } else {
        throw new Error('Failed to activate agency')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate agency',
        variant: 'destructive'
      })
    }
  }

  const getPlanColor = (plan?: string) => {
    switch (plan) {
      case 'starter': return 'secondary'
      case 'pro': return 'default'
      case 'unlimited': return 'outline'
      default: return 'destructive'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.User.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-agencies"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
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
      </div>

      {/* Agencies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agencies ({filteredAgencies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Sub-Accounts</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Goal Progress</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading agencies...
                  </TableCell>
                </TableRow>
              ) : filteredAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No agencies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`text-agency-name-${agency.id}`}>
                            {agency.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agency.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Owner: {agency.User.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanColor(agency.Subscription?.plan)}>
                        {agency.Subscription?.plan || 'No Plan'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{agency._count?.SubAccount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-sm font-medium">
                            {formatCurrency(agency.monthlyRevenue || 0)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total: {formatCurrency(agency.totalRevenue || 0)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{formatCurrency(agency.totalRevenue || 0)}</span>
                          <span>{formatCurrency(agency.goal)}</span>
                        </div>
                        <Progress 
                          value={((agency.totalRevenue || 0) / agency.goal) * 100} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {agency.lastLoginAt 
                            ? new Date(agency.lastLoginAt).toLocaleDateString()
                            : 'Never'
                          }
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
                              onClick={() => setSelectedAgency(agency)}
                              data-testid={`button-view-agency-${agency.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Agency Details: {selectedAgency?.name}</DialogTitle>
                              <DialogDescription>
                                Comprehensive agency information and analytics
                              </DialogDescription>
                            </DialogHeader>
                            {selectedAgency && (
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="overview">Overview</TabsTrigger>
                                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                                  <TabsTrigger value="subaccounts">Sub-Accounts</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Contact Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div>
                                          <span className="text-sm font-medium">Email:</span>
                                          <p className="text-sm text-muted-foreground">{selectedAgency.email}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Phone:</span>
                                          <p className="text-sm text-muted-foreground">{selectedAgency.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Address:</span>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedAgency.address ? 
                                              `${selectedAgency.address}, ${selectedAgency.city}, ${selectedAgency.state} ${selectedAgency.zipCode}` 
                                              : 'N/A'
                                            }
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Agency Stats</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Sub-Accounts:</span>
                                          <span className="text-sm font-medium">{selectedAgency._count?.SubAccount || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Active Websites:</span>
                                          <span className="text-sm font-medium">{selectedAgency.activeWebsites || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Created:</span>
                                          <span className="text-sm font-medium">
                                            {new Date(selectedAgency.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="analytics" className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <TrendingUp className="h-5 w-5 text-green-500" />
                                          <div>
                                            <p className="text-sm font-medium">Monthly Revenue</p>
                                            <p className="text-2xl font-bold">
                                              {formatCurrency(selectedAgency.monthlyRevenue || 0)}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="h-5 w-5 text-blue-500" />
                                          <div>
                                            <p className="text-sm font-medium">Total Revenue</p>
                                            <p className="text-2xl font-bold">
                                              {formatCurrency(selectedAgency.totalRevenue || 0)}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <BarChart3 className="h-5 w-5 text-purple-500" />
                                          <div>
                                            <p className="text-sm font-medium">Goal Progress</p>
                                            <p className="text-2xl font-bold">
                                              {Math.round(((selectedAgency.totalRevenue || 0) / selectedAgency.goal) * 100)}%
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="subscription" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Subscription Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {selectedAgency.Subscription ? (
                                        <div className="space-y-3">
                                          <div className="flex justify-between">
                                            <span>Plan:</span>
                                            <Badge variant={getPlanColor(selectedAgency.Subscription.plan)}>
                                              {selectedAgency.Subscription.plan}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Status:</span>
                                            <Badge variant={selectedAgency.Subscription.active ? 'default' : 'destructive'}>
                                              {selectedAgency.Subscription.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Price ID:</span>
                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                              {selectedAgency.Subscription.priceId}
                                            </code>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-muted-foreground">No active subscription</p>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="subaccounts" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Sub-Accounts ({selectedAgency.SubAccount.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {selectedAgency.SubAccount.length > 0 ? (
                                        <div className="space-y-2">
                                          {selectedAgency.SubAccount.map((subAccount) => (
                                            <div key={subAccount.id} className="flex items-center justify-between p-3 border rounded-lg">
                                              <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                  <p className="font-medium">{subAccount.name}</p>
                                                  <p className="text-sm text-muted-foreground">
                                                    Created: {new Date(subAccount.createdAt).toLocaleDateString()}
                                                  </p>
                                                </div>
                                              </div>
                                              <Badge variant="outline">Active</Badge>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-muted-foreground">No sub-accounts found</p>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => suspendAgency(agency.id)}
                          data-testid={`button-suspend-agency-${agency.id}`}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => activateAgency(agency.id)}
                          data-testid={`button-activate-agency-${agency.id}`}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedAgenciesManager