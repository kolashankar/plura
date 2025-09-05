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
  Store,
  DollarSign,
  TrendingUp,
  Eye,
  User,
  Calendar,
  Package,
  Star,
  Download,
  CreditCard,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users
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

type Seller = {
  id: string
  name: string
  email: string
  company?: string
  status: 'active' | 'suspended' | 'pending'
  verificationStatus: 'verified' | 'pending' | 'rejected'
  totalRevenue: number
  monthlyRevenue: number
  totalItems: number
  totalDownloads: number
  averageRating: number
  joinedAt: string
  lastActive: string
  payoutInfo: {
    method: string
    details: string
  }
  items: {
    id: string
    name: string
    type: string
    price: number
    downloads: number
    revenue: number
  }[]
  revenueHistory: {
    month: string
    revenue: number
  }[]
}

const MarketplaceSellersManager = () => {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [verificationFilter, setVerificationFilter] = useState<string>('all')
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSellers()
  }, [searchTerm, statusFilter, verificationFilter])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (verificationFilter !== 'all') params.append('verification', verificationFilter)
      
      const response = await fetch(`/api/admin/marketplace-sellers?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setSellers(data.sellers || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sellers',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSellerStatus = async (sellerId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/marketplace-sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, status })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Seller status updated successfully'
        })
        fetchSellers()
      } else {
        throw new Error('Failed to update seller status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update seller status',
        variant: 'destructive'
      })
    }
  }

  const verifySeller = async (sellerId: string, verified: boolean) => {
    try {
      const response = await fetch('/api/admin/marketplace-sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sellerId, 
          verificationStatus: verified ? 'verified' : 'rejected'
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Seller ${verified ? 'verified' : 'rejected'} successfully`
        })
        fetchSellers()
      } else {
        throw new Error('Failed to update verification status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'suspended': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'default'
      case 'pending': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'outline'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (seller.company && seller.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Sellers</p>
                <p className="text-2xl font-bold">{sellers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Verified Sellers</p>
                <p className="text-2xl font-bold">
                  {sellers.filter(s => s.verificationStatus === 'verified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(sellers.reduce((acc, s) => acc + s.totalRevenue, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold">
                  {sellers.reduce((acc, s) => acc + s.totalItems, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-sellers"
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
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-verification-filter">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verification</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sellers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Sellers ({filteredSellers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading sellers...
                  </TableCell>
                </TableRow>
              ) : filteredSellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No sellers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`text-seller-name-${seller.id}`}>
                            {seller.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {seller.email}
                          </div>
                          {seller.company && (
                            <div className="text-xs text-muted-foreground">
                              {seller.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(seller.status)}>
                        {seller.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getVerificationColor(seller.verificationStatus)}>
                        {seller.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-sm font-medium">
                            {formatCurrency(seller.monthlyRevenue)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total: {formatCurrency(seller.totalRevenue)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{seller.totalItems}</div>
                        <div className="text-xs text-muted-foreground">
                          {seller.totalDownloads} downloads
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{seller.averageRating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {new Date(seller.joinedAt).toLocaleDateString()}
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
                              onClick={() => setSelectedSeller(seller)}
                              data-testid={`button-view-seller-${seller.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Seller Details: {selectedSeller?.name}</DialogTitle>
                              <DialogDescription>
                                Comprehensive seller information and performance analytics
                              </DialogDescription>
                            </DialogHeader>
                            {selectedSeller && (
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="overview">Overview</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                                  <TabsTrigger value="payout">Payout</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Seller Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div>
                                          <span className="text-sm font-medium">Name:</span>
                                          <p className="text-sm text-muted-foreground">{selectedSeller.name}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Email:</span>
                                          <p className="text-sm text-muted-foreground">{selectedSeller.email}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Company:</span>
                                          <p className="text-sm text-muted-foreground">{selectedSeller.company || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Status:</span>
                                          <Badge variant={getStatusColor(selectedSeller.status)} className="ml-2">
                                            {selectedSeller.status}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Performance Metrics</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Total Revenue:</span>
                                          <span className="text-sm font-medium">{formatCurrency(selectedSeller.totalRevenue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Monthly Revenue:</span>
                                          <span className="text-sm font-medium">{formatCurrency(selectedSeller.monthlyRevenue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Total Items:</span>
                                          <span className="text-sm font-medium">{selectedSeller.totalItems}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Average Rating:</span>
                                          <span className="text-sm font-medium">{selectedSeller.averageRating.toFixed(1)}/5</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="items" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Seller Items ({selectedSeller.items.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        {selectedSeller.items.map((item) => (
                                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                              <Package className="h-4 w-4 text-muted-foreground" />
                                              <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                  {item.type} • {formatCurrency(item.price)}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-sm font-medium">{item.downloads} downloads</p>
                                              <p className="text-sm text-muted-foreground">
                                                {formatCurrency(item.revenue)} revenue
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="revenue" className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="h-5 w-5 text-green-500" />
                                          <div>
                                            <p className="text-sm font-medium">Total Revenue</p>
                                            <p className="text-2xl font-bold">
                                              {formatCurrency(selectedSeller.totalRevenue)}
                                            </p>
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
                                            <p className="text-2xl font-bold">
                                              {formatCurrency(selectedSeller.monthlyRevenue)}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <Download className="h-5 w-5 text-purple-500" />
                                          <div>
                                            <p className="text-sm font-medium">Total Downloads</p>
                                            <p className="text-2xl font-bold">
                                              {selectedSeller.totalDownloads.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="payout" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Payout Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <span className="text-sm font-medium">Payment Method:</span>
                                        <p className="text-sm text-muted-foreground">{selectedSeller.payoutInfo.method}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Payment Details:</span>
                                        <p className="text-sm text-muted-foreground">{selectedSeller.payoutInfo.details}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {seller.verificationStatus === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => verifySeller(seller.id, true)}
                              data-testid={`button-verify-seller-${seller.id}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => verifySeller(seller.id, false)}
                              data-testid={`button-reject-seller-${seller.id}`}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Select onValueChange={(value) => updateSellerStatus(seller.id, value)}>
                          <SelectTrigger className="w-[120px]" data-testid={`select-seller-status-${seller.id}`}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
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

export default MarketplaceSellersManager