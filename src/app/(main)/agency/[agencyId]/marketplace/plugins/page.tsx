
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Download, Zap } from 'lucide-react'

const plugins = [
  { id: 1, name: 'Advanced Contact Forms', price: 19.99, rating: 4.8, downloads: 5234, category: 'Forms', description: 'Create complex forms with validation and integrations' },
  { id: 2, name: 'SEO Optimizer Pro', price: 39.99, rating: 4.9, downloads: 3567, category: 'SEO', description: 'Boost your website SEO with advanced tools' },
  { id: 3, name: 'Social Media Feed', price: 29.99, rating: 4.7, downloads: 2987, category: 'Social', description: 'Display live social media feeds on your site' },
  { id: 4, name: 'E-commerce Cart', price: 59.99, rating: 4.6, downloads: 1456, category: 'E-commerce', description: 'Full-featured shopping cart solution' },
  { id: 5, name: 'Analytics Dashboard', price: 49.99, rating: 4.8, downloads: 2876, category: 'Analytics', description: 'Track website performance and user behavior' },
  { id: 6, name: 'Live Chat Widget', price: 34.99, rating: 4.7, downloads: 4234, category: 'Communication', description: 'Real-time customer support chat' },
]

export default function PluginsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Forms', 'SEO', 'Social', 'E-commerce', 'Analytics', 'Communication']

  const filteredPlugins = plugins.filter(plugin => 
    (selectedCategory === 'All' || plugin.category === selectedCategory) &&
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Plugin Marketplace</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plugins..."
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
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">{plugin.name}</CardTitle>
                </div>
                <Badge variant="secondary">{plugin.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{plugin.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{plugin.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{plugin.downloads}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${plugin.price}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Learn More</Button>
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
