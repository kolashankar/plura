
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Download } from 'lucide-react'

const themes = [
  { id: 1, name: 'Modern Portfolio', price: 49.99, rating: 4.8, downloads: 1234, category: 'Portfolio', preview: '/api/placeholder/400/300' },
  { id: 2, name: 'E-commerce Pro', price: 89.99, rating: 4.9, downloads: 2567, category: 'E-commerce', preview: '/api/placeholder/400/300' },
  { id: 3, name: 'Agency Landing', price: 39.99, rating: 4.7, downloads: 987, category: 'Landing Page', preview: '/api/placeholder/400/300' },
  { id: 4, name: 'Blog Minimal', price: 29.99, rating: 4.6, downloads: 3456, category: 'Blog', preview: '/api/placeholder/400/300' },
  { id: 5, name: 'Restaurant Deluxe', price: 59.99, rating: 4.8, downloads: 1876, category: 'Restaurant', preview: '/api/placeholder/400/300' },
  { id: 6, name: 'SaaS Dashboard', price: 99.99, rating: 4.9, downloads: 2234, category: 'Dashboard', preview: '/api/placeholder/400/300' },
]

export default function ThemesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Portfolio', 'E-commerce', 'Landing Page', 'Blog', 'Restaurant', 'Dashboard']

  const filteredThemes = themes.filter(theme => 
    (selectedCategory === 'All' || theme.category === selectedCategory) &&
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Theme Marketplace</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                <Badge variant="secondary">{theme.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{theme.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{theme.downloads}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${theme.price}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Preview</Button>
                  <Button size="sm">Purchase</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
