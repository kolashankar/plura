'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Store, 
  DollarSign, 
  TrendingUp, 
  Eye,
  ShoppingBag, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Crown,
  Users,
  BarChart3,
  Palette,
  Image,
  Upload,
  Settings,
  Tag,
  Globe,
  Award
} from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ThemeMarketplaceCardProps {
  funnelId: string
  subaccountId: string
  funnelName: string
}

interface ThemeData {
  id: string
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  preview_url: string
  thumbnail: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  sales: number
  earnings: number
  rating: number
  views: number
}

const ThemeMarketplaceCard: React.FC<ThemeMarketplaceCardProps> = ({ 
  funnelId, 
  subaccountId,
  funnelName
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('publish')
  
  const [themeData, setThemeData] = useState<Partial<ThemeData>>({
    name: funnelName,
    description: '',
    price: 49,
    category: 'business',
    tags: [],
    status: 'draft'
  })

  // Mock theme analytics data
  const [publishedTheme] = useState<ThemeData>({
    id: '1',
    name: 'Professional Business Funnel',
    description: 'Modern business funnel with conversion optimization',
    price: 49,
    category: 'business',
    tags: ['business', 'modern', 'conversion'],
    preview_url: '#',
    thumbnail: '/placeholder-theme.jpg',
    status: 'published',
    sales: 127,
    earnings: 6230,
    rating: 4.8,
    views: 2456
  })

  const categories = [
    { value: 'business', label: 'Business & Corporate' },
    { value: 'ecommerce', label: 'E-commerce & Shopping' },
    { value: 'portfolio', label: 'Portfolio & Creative' },
    { value: 'landing', label: 'Landing Pages' },
    { value: 'blog', label: 'Blog & Content' },
    { value: 'education', label: 'Education & Courses' }
  ]

  const handlePublishTheme = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Validate required fields
      if (!themeData.name || !themeData.description || !themeData.price) {
        throw new Error('Please fill in all required fields')
      }

      toast.success('Theme submitted for review! You\'ll be notified once it\'s approved.')
      setActiveTab('analytics')
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish theme')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTheme = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Theme updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update theme')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card className="flex-1 border-l-4 border-l-purple-500">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Theme Marketplace</CardTitle>
            <CardDescription>
              Monetize your funnel by selling it as a premium theme
            </CardDescription>
          </div>
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Publish
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium">Publish as Premium Theme</h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme-name">Theme Name *</Label>
                    <Input
                      id="theme-name"
                      placeholder="Professional Business Funnel"
                      value={themeData.name}
                      onChange={(e) => setThemeData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="49"
                      value={themeData.price}
                      onChange={(e) => setThemeData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your theme's features, design, and target audience..."
                    rows={3}
                    value={themeData.description}
                    onChange={(e) => setThemeData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={themeData.category} 
                      onValueChange={(value) => setThemeData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="business, modern, conversion"
                      onChange={(e) => setThemeData(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()) 
                      }))}
                    />
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Theme Preview</span>
                  </div>
                  <p className="text-xs text-purple-700 mb-3">
                    Upload a high-quality preview image (1920x1080 recommended)
                  </p>
                  <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Preview
                  </Button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handlePublishTheme}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Store className="h-4 w-4 mr-2" />
                    )}
                    Submit for Review
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium">Theme Performance</h4>
              </div>

              {publishedTheme ? (
                <div className="space-y-4">
                  {/* Theme Status */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{publishedTheme.name}</h5>
                      <Badge className={getStatusColor(publishedTheme.status)}>
                        {publishedTheme.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {publishedTheme.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{publishedTheme.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${publishedTheme.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {publishedTheme.rating}
                      </span>
                    </div>
                  </div>

                  {/* Analytics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Earnings</p>
                            <p className="text-lg font-bold text-green-600">
                              ${publishedTheme.earnings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Sales</p>
                            <p className="text-lg font-bold text-blue-600">
                              {publishedTheme.sales}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Eye className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Views</p>
                            <p className="text-lg font-bold text-purple-600">
                              {publishedTheme.views.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Conversion</p>
                            <p className="text-lg font-bold text-orange-600">
                              {((publishedTheme.sales / publishedTheme.views) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-3">Recent Sales</h5>
                    <div className="space-y-2">
                      {[1, 2, 3].map((sale, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Theme Purchase</p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">+${publishedTheme.price}</p>
                            <p className="text-xs text-gray-500">Earning</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg">
                  <Store className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No published themes yet</h3>
                  <p className="text-xs text-gray-500 mb-4">Publish your first theme to start earning!</p>
                  <Button onClick={() => setActiveTab('publish')} variant="outline" size="sm">
                    <Store className="h-4 w-4 mr-2" />
                    Publish Theme
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Marketplace Settings
              </h4>
              
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-approve Updates</Label>
                    <p className="text-xs text-gray-500">Automatically publish theme updates without review</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Get notified about sales and reviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Public Profile</Label>
                    <p className="text-xs text-gray-500">Show your profile in the marketplace</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              {/* Update Theme */}
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-3">Update Published Theme</h5>
                <p className="text-sm text-gray-600 mb-4">
                  Make changes to your published theme. Updates may require review.
                </p>
                <Button
                  onClick={handleUpdateTheme}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Update Theme
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Marketplace Benefits */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-purple-900">Marketplace Benefits</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="h-4 w-4" />
              70% Revenue Share
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="h-4 w-4" />
              Global Marketplace
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="h-4 w-4" />
              Marketing Support
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="h-4 w-4" />
              Customer Support
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ThemeMarketplaceCard