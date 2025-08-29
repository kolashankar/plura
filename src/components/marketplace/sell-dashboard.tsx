'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, DollarSign, Package, TrendingUp, Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface SellDashboardProps {
  agencyId?: string
  subAccountId?: string
}

const SellDashboard: React.FC<SellDashboardProps> = ({ agencyId, subAccountId }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [uploadedProducts, setUploadedProducts] = useState([
    {
      id: '1',
      name: 'Modern Agency Theme',
      type: 'theme',
      price: 79,
      earnings: 1580,
      sales: 20,
      status: 'published',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Advanced Contact Forms',
      type: 'plugin',
      price: 39,
      earnings: 780,
      sales: 20,
      status: 'published',
      rating: 4.7,
    },
  ])

  const totalEarnings = uploadedProducts.reduce((sum, product) => sum + product.earnings, 0)
  const totalSales = uploadedProducts.reduce((sum, product) => sum + product.sales, 0)

  const handleUploadProduct = async (formData: FormData) => {
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Product uploaded successfully!')
      setActiveTab('products')
    } catch (error) {
      toast.error('Failed to upload product')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <p className="text-muted-foreground">Manage and sell your themes and plugins</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="upload">Upload New Item</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uploadedProducts.length}</div>
                <p className="text-xs text-muted-foreground">2 pending review</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Your latest product sales and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${product.price} • {product.sales} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.earnings}</p>
                      <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Product
              </CardTitle>
              <CardDescription>
                Upload your theme or plugin to the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleUploadProduct(formData)
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" name="productName" placeholder="Enter product name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Select name="productType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theme">Theme</SelectItem>
                        <SelectItem value="plugin">Plugin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" name="price" type="number" placeholder="0.00" min="0" step="0.01" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="forms">Forms</SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    placeholder="Describe your product..." 
                    rows={4}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productFile">Product File</Label>
                  <Input id="productFile" name="productFile" type="file" accept=".zip,.rar" required />
                  <p className="text-sm text-muted-foreground">
                    Upload your theme or plugin as a ZIP file
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="previewImage">Preview Image</Label>
                  <Input id="previewImage" name="previewImage" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">
                    Upload a preview image for your product
                  </p>
                </div>
                
                <Button type="submit" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Products</h3>
            <Button onClick={() => setActiveTab('upload')}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>
                        {product.type === 'theme' ? 'Theme' : 'Plugin'}
                      </CardDescription>
                    </div>
                    <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sales</p>
                        <p className="font-semibold">{product.sales}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Earnings</p>
                        <p className="font-semibold">${product.earnings}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-semibold">{product.rating} ⭐</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SellDashboard