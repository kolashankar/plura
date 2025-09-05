'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag,
  Globe,
  Image as ImageIcon,
  Video,
  Music,
  FileArchive,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Upload,
  Download,
  Copy,
  Share2,
  BookOpen,
  Layout,
  Settings,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare
} from 'lucide-react'
import BlurPage from '@/components/global/blur-page'
import { useToast } from '@/hooks/use-toast'

// Content Library Component
const ContentLibrary = () => {
  const { toast } = useToast()
  const [content, setContent] = useState([
    {
      id: 1,
      title: 'How to Build Landing Pages',
      type: 'article',
      status: 'published',
      category: 'Tutorial',
      author: 'John Doe',
      views: 1247,
      likes: 89,
      comments: 23,
      publishDate: '2024-01-15',
      lastModified: '2024-01-20',
      featured: true
    },
    {
      id: 2,
      title: 'E-commerce Best Practices',
      type: 'article',
      status: 'draft',
      category: 'Guide',
      author: 'Sarah Smith',
      views: 0,
      likes: 0,
      comments: 0,
      publishDate: null,
      lastModified: '2024-01-22',
      featured: false
    },
    {
      id: 3,
      title: 'Product Demo Video',
      type: 'video',
      status: 'published',
      category: 'Demo',
      author: 'Mike Johnson',
      views: 3456,
      likes: 234,
      comments: 67,
      publishDate: '2024-01-10',
      lastModified: '2024-01-10',
      featured: true
    },
    {
      id: 4,
      title: 'Brand Guidelines',
      type: 'document',
      status: 'published',
      category: 'Resources',
      author: 'Design Team',
      views: 892,
      likes: 45,
      comments: 12,
      publishDate: '2024-01-05',
      lastModified: '2024-01-18',
      featured: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'archived': return 'outline'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'document': return <BookOpen className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleDeleteContent = (id: number) => {
    setContent(content.filter(c => c.id !== id))
    toast({
      title: 'Content Deleted',
      description: 'Content has been successfully removed'
    })
  }

  const handleDuplicateContent = (id: number) => {
    const original = content.find(c => c.id === id)
    if (original) {
      const duplicate = {
        ...original,
        id: Math.max(...content.map(c => c.id)) + 1,
        title: `${original.title} (Copy)`,
        status: 'draft',
        publishDate: null,
        views: 0,
        likes: 0,
        comments: 0
      }
      setContent([...content, duplicate])
      toast({
        title: 'Content Duplicated',
        description: 'A copy has been created in drafts'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Library</h2>
          <p className="text-muted-foreground">Manage all your content in one place</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
              <DialogDescription>Add new content to your library</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter content title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" placeholder="Content author" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Brief description of the content" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Create & Publish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{content.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{content.filter(c => c.status === 'published').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{content.filter(c => c.status === 'draft').length}</p>
              </div>
              <Edit className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{content.reduce((acc, c) => acc + c.views, 0).toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search content..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.title}</p>
                          {item.featured && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      {item.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {item.comments}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.lastModified}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDuplicateContent(item.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteContent(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Publishing Workflow Component
const PublishingWorkflow = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: 'Blog Post Review',
      description: 'Standard review process for blog posts',
      stages: ['Draft', 'Editorial Review', 'SEO Review', 'Final Approval', 'Published'],
      currentItems: 12,
      avgCompletionTime: '3 days',
      status: 'active'
    },
    {
      id: 2,
      name: 'Video Content Pipeline',
      description: 'Video production and publishing workflow',
      stages: ['Script', 'Production', 'Editing', 'Review', 'Published'],
      currentItems: 5,
      avgCompletionTime: '7 days',
      status: 'active'
    },
    {
      id: 3,
      name: 'Social Media Approval',
      description: 'Quick approval process for social media content',
      stages: ['Created', 'Review', 'Scheduled', 'Published'],
      currentItems: 23,
      avgCompletionTime: '1 day',
      status: 'active'
    }
  ])

  const [contentInWorkflow] = useState([
    {
      id: 1,
      title: 'New Feature Announcement',
      workflow: 'Blog Post Review',
      currentStage: 'Editorial Review',
      assignee: 'Sarah Smith',
      dueDate: '2024-01-25',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Tutorial: Advanced Analytics',
      workflow: 'Video Content Pipeline',
      currentStage: 'Production',
      assignee: 'Mike Johnson',
      dueDate: '2024-01-28',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Weekly Tips #23',
      workflow: 'Social Media Approval',
      currentStage: 'Review',
      assignee: 'Alex Brown',
      dueDate: '2024-01-23',
      priority: 'low'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Publishing Workflow</h2>
          <p className="text-muted-foreground">Streamline your content publication process</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
            <CardDescription>Your content publication pipelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                    <span>{workflow.currentItems} items in progress</span>
                    <span>Avg: {workflow.avgCompletionTime}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {workflow.stages.map((stage, index) => (
                      <div key={index} className="flex-1 h-2 bg-muted rounded">
                        <div 
                          className="h-full bg-blue-500 rounded transition-all duration-300"
                          style={{ width: `${((index + 1) / workflow.stages.length) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content in Progress</CardTitle>
            <CardDescription>Items currently in workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentInWorkflow.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.workflow}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.currentStage}
                        </Badge>
                        <Badge 
                          variant={
                            item.priority === 'high' ? 'destructive' : 
                            item.priority === 'medium' ? 'default' : 
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Due</p>
                      <p className="font-medium">{item.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.assignee}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// SEO Optimization Component
const SEOOptimization = () => {
  const [seoData] = useState([
    {
      id: 1,
      title: 'How to Build Landing Pages',
      url: '/blog/build-landing-pages',
      metaTitle: 'How to Build Landing Pages - Complete Guide 2024',
      metaDescription: 'Learn how to create high-converting landing pages with our comprehensive guide. Includes templates, best practices, and expert tips.',
      focusKeyword: 'build landing pages',
      seoScore: 85,
      issues: 1,
      recommendations: ['Add alt text to images', 'Optimize meta description length'],
      lastAnalyzed: '2024-01-20'
    },
    {
      id: 2,
      title: 'E-commerce Best Practices',
      url: '/blog/ecommerce-best-practices',
      metaTitle: 'E-commerce Best Practices for 2024',
      metaDescription: 'Discover proven e-commerce strategies to boost sales and improve customer experience.',
      focusKeyword: 'ecommerce best practices',
      seoScore: 72,
      issues: 3,
      recommendations: ['Improve title length', 'Add internal links', 'Optimize images'],
      lastAnalyzed: '2024-01-19'
    },
    {
      id: 3,
      title: 'Product Demo Video',
      url: '/videos/product-demo',
      metaTitle: 'Product Demo - See Our Platform in Action',
      metaDescription: 'Watch our comprehensive product demo to see how our platform can transform your business.',
      focusKeyword: 'product demo',
      seoScore: 91,
      issues: 0,
      recommendations: ['Consider adding schema markup'],
      lastAnalyzed: '2024-01-18'
    }
  ])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Optimization</h2>
          <p className="text-muted-foreground">Optimize your content for search engines</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Analyze All Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg SEO Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(seoData.reduce((acc, item) => acc + item.seoScore, 0) / seoData.length)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Performing</p>
                <p className="text-2xl font-bold">{seoData.filter(item => item.seoScore >= 80).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold">{seoData.filter(item => item.seoScore < 80).length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold">{seoData.reduce((acc, item) => acc + item.issues, 0)}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Analysis Results</CardTitle>
          <CardDescription>Content optimization recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seoData.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.url}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.focusKeyword}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Analyzed {item.lastAnalyzed}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className={`w-12 h-12 rounded-full ${getScoreBg(item.seoScore)} flex items-center justify-center text-white font-bold text-sm`}>
                        {item.seoScore}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.issues} {item.issues === 1 ? 'issue' : 'issues'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Meta Title</p>
                    <p className="text-sm text-muted-foreground">{item.metaTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Meta Description</p>
                    <p className="text-sm text-muted-foreground">{item.metaDescription}</p>
                  </div>
                  {item.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Recommendations</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Re-analyze
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Optimize
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Content Analytics Component
const ContentAnalytics = () => {
  const analyticsData = {
    totalViews: 45892,
    uniqueVisitors: 23156,
    avgTimeOnPage: '3:24',
    bounceRate: '42%',
    topPerformingContent: [
      { title: 'How to Build Landing Pages', views: 12457, engagement: '8.5%' },
      { title: 'Product Demo Video', views: 8934, engagement: '12.3%' },
      { title: 'E-commerce Best Practices', views: 6723, engagement: '6.8%' },
      { title: 'Brand Guidelines', views: 4521, engagement: '4.2%' }
    ],
    contentPerformance: [
      { type: 'Articles', count: 45, avgViews: 1247, engagement: '7.2%' },
      { type: 'Videos', count: 23, avgViews: 3456, engagement: '11.8%' },
      { type: 'Images', count: 156, avgViews: 892, engagement: '3.4%' },
      { type: 'Documents', count: 34, avgViews: 567, engagement: '5.1%' }
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Analytics</h2>
        <p className="text-muted-foreground">Track content performance and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{analyticsData.avgTimeOnPage}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{analyticsData.bounceRate}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Your most viewed content pieces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPerformingContent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <Badge variant="outline">{item.engagement}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Performance by Type</CardTitle>
            <CardDescription>Engagement metrics by content type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.contentPerformance.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.type}</span>
                    <div className="text-sm text-muted-foreground">
                      {item.count} items • {item.engagement} engagement
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded">
                      <div 
                        className="h-full bg-blue-500 rounded transition-all duration-300"
                        style={{ width: `${(item.avgViews / 4000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-16">
                      {item.avgViews.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type Props = {
  params: { subaccountId: string }
}

const ContentManagementPage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState('library')

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">Comprehensive content creation and management system</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="library">Content Library</TabsTrigger>
            <TabsTrigger value="workflow">Publishing Workflow</TabsTrigger>
            <TabsTrigger value="seo">SEO Optimization</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <ContentLibrary />
          </TabsContent>

          <TabsContent value="workflow">
            <PublishingWorkflow />
          </TabsContent>

          <TabsContent value="seo">
            <SEOOptimization />
          </TabsContent>

          <TabsContent value="analytics">
            <ContentAnalytics />
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default ContentManagementPage