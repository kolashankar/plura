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
  Package,
  Download,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Palette,
  Puzzle
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type MarketplaceItem = {
  id: string
  name: string
  description: string
  type: 'theme' | 'plugin'
  version: string
  price: number
  status: 'pending' | 'approved' | 'rejected'
  downloads: number
  rating: number
  reviews: number
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  previewImages?: string[]
  tags: string[]
  category: string
  features: string[]
  compatibility: string[]
}

const ThemesPluginsManager = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [reviewData, setReviewData] = useState({
    status: '',
    feedback: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [searchTerm, statusFilter, typeFilter, categoryFilter])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      
      const response = await fetch(`/api/admin/themes-plugins?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setItems(data.items || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch marketplace items',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const reviewItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/admin/themes-plugins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemId, 
          status: reviewData.status,
          feedback: reviewData.feedback
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item reviewed successfully'
        })
        setReviewDialog(false)
        setReviewData({ status: '', feedback: '' })
        fetchItems()
      } else {
        throw new Error('Failed to review item')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to review item',
        variant: 'destructive'
      })
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/admin/themes-plugins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully'
        })
        fetchItems()
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'pending': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'outline'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theme': return 'default'
      case 'plugin': return 'secondary'
      default: return 'outline'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold">
                  {items.filter(item => item.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">
                  {items.filter(item => item.status === 'approved').length}
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
                  {items.reduce((acc, item) => acc + item.downloads, 0)}
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
            placeholder="Search themes & plugins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-items"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="theme">Themes</SelectItem>
            <SelectItem value="plugin">Plugins</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="landing">Landing Page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading marketplace items...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {item.type === 'theme' ? 
                            <Palette className="h-5 w-5 text-primary" /> :
                            <Puzzle className="h-5 w-5 text-primary" />
                          }
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`text-item-name-${item.id}`}>
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            v{item.version} • {item.category}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            By: {item.createdBy.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {item.price === 0 ? 'Free' : formatCurrency(item.price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>{item.downloads.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{item.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({item.reviews})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
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
                              onClick={() => setSelectedItem(item)}
                              data-testid={`button-view-item-${item.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{selectedItem?.name}</DialogTitle>
                              <DialogDescription>
                                Detailed information about this marketplace item
                              </DialogDescription>
                            </DialogHeader>
                            {selectedItem && (
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="overview">Overview</TabsTrigger>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="features">Features</TabsTrigger>
                                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Basic Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div>
                                          <span className="text-sm font-medium">Name:</span>
                                          <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Description:</span>
                                          <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Version:</span>
                                          <p className="text-sm text-muted-foreground">{selectedItem.version}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">Category:</span>
                                          <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Performance</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Downloads:</span>
                                          <span className="text-sm font-medium">{selectedItem.downloads.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Rating:</span>
                                          <span className="text-sm font-medium">{selectedItem.rating.toFixed(1)}/5</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Reviews:</span>
                                          <span className="text-sm font-medium">{selectedItem.reviews}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Price:</span>
                                          <span className="text-sm font-medium">
                                            {selectedItem.price === 0 ? 'Free' : formatCurrency(selectedItem.price)}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Tags</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedItem.tags.map((tag, index) => (
                                          <Badge key={index} variant="outline">{tag}</Badge>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Compatibility</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {selectedItem.compatibility.map((comp, index) => (
                                          <Badge key={index} variant="secondary">{comp}</Badge>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="features" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Features</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <ul className="space-y-2">
                                        {selectedItem.features.map((feature, index) => (
                                          <li key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="analytics" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <Download className="h-5 w-5 text-blue-500" />
                                          <div>
                                            <p className="text-sm font-medium">Total Downloads</p>
                                            <p className="text-2xl font-bold">{selectedItem.downloads}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardContent className="p-6">
                                        <div className="flex items-center gap-2">
                                          <Star className="h-5 w-5 text-yellow-500" />
                                          <div>
                                            <p className="text-sm font-medium">Average Rating</p>
                                            <p className="text-2xl font-bold">{selectedItem.rating.toFixed(1)}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {item.status === 'pending' && (
                          <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item)
                                  setReviewDialog(true)
                                }}
                                data-testid={`button-review-item-${item.id}`}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Item</DialogTitle>
                                <DialogDescription>
                                  Approve or reject this marketplace item
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="status">Review Decision</Label>
                                  <Select value={reviewData.status} onValueChange={(value) => setReviewData({ ...reviewData, status: value })}>
                                    <SelectTrigger data-testid="select-review-status">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="approved">Approve</SelectItem>
                                      <SelectItem value="rejected">Reject</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="feedback">Feedback</Label>
                                  <Textarea
                                    id="feedback"
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                                    placeholder="Provide feedback to the creator"
                                    data-testid="textarea-review-feedback"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setReviewDialog(false)}>
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => selectedItem && reviewItem(selectedItem.id)}
                                    data-testid="button-submit-review"
                                  >
                                    Submit Review
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          data-testid={`button-delete-item-${item.id}`}
                        >
                          <XCircle className="h-4 w-4" />
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

export default ThemesPluginsManager