
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, DollarSign, Package, TrendingUp } from 'lucide-react'

export default function SellPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <p className="text-muted-foreground">Manage and sell your themes and plugins</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </Button>
        <Button 
          variant={activeTab === 'upload' ? 'default' : 'outline'}
          onClick={() => setActiveTab('upload')}
        >
          Upload New Item
        </Button>
        <Button 
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
        >
          My Products
        </Button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,847.32</div>
              <p className="text-xs text-muted-foreground">+12.3% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">147</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 pending approval</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Item Title</Label>
              <Input id="title" placeholder="Enter item title" />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your item" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theme">Theme</SelectItem>
                    <SelectItem value="plugin">Plugin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" placeholder="29.99" />
              </div>
            </div>
            
            <div>
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop your files here</p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </div>
            
            <Button className="w-full">Submit for Review</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold">Product {item}</h3>
                  <p className="text-muted-foreground">Status: Active</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$49.99</p>
                  <p className="text-sm text-muted-foreground">23 sales</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Stats</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
