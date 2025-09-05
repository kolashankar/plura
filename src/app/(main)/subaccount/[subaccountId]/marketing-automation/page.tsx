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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Mail, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Calendar,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  BarChart3,
  Eye,
  MessageSquare,
  Share2,
  Globe,
  Smartphone,
  Monitor,
  GitBranch,
  Activity,
  Star,
  Copy
} from 'lucide-react'
import BlurPage from '@/components/global/blur-page'
import { useToast } from '@/hooks/use-toast'

// Email Campaigns Component
const EmailCampaigns = () => {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Welcome Series',
      type: 'automation',
      status: 'active',
      subject: 'Welcome to Our Platform!',
      recipients: 1250,
      openRate: 24.5,
      clickRate: 4.8,
      bounceRate: 1.2,
      unsubscribeRate: 0.5,
      createdAt: '2024-01-15',
      lastSent: '2 hours ago',
      revenue: 3420
    },
    {
      id: 2,
      name: 'Product Launch',
      type: 'broadcast',
      status: 'scheduled',
      subject: 'Exciting New Features Just Launched!',
      recipients: 5600,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0,
      createdAt: '2024-01-20',
      lastSent: null,
      revenue: 0
    },
    {
      id: 3,
      name: 'Weekly Newsletter',
      type: 'recurring',
      status: 'active',
      subject: 'Your Weekly Update',
      recipients: 3400,
      openRate: 31.2,
      clickRate: 7.3,
      bounceRate: 2.1,
      unsubscribeRate: 0.8,
      createdAt: '2024-01-10',
      lastSent: '3 days ago',
      revenue: 1890
    },
    {
      id: 4,
      name: 'Abandoned Cart Recovery',
      type: 'automation',
      status: 'paused',
      subject: 'Complete Your Purchase',
      recipients: 890,
      openRate: 18.7,
      clickRate: 12.4,
      bounceRate: 1.8,
      unsubscribeRate: 1.2,
      createdAt: '2024-01-05',
      lastSent: '1 week ago',
      revenue: 2340
    }
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'default'
      case 'scheduled': return 'secondary'
      case 'paused': return 'outline'
      case 'completed': return 'secondary'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'automation': return <Zap className="h-4 w-4" />
      case 'broadcast': return <Send className="h-4 w-4" />
      case 'recurring': return <Clock className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  const handleToggleCampaign = (id: number) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ))
    toast({
      title: 'Campaign Updated',
      description: 'Campaign status has been changed'
    })
  }

  const handleDuplicateCampaign = (id: number) => {
    const original = campaigns.find(c => c.id === id)
    if (original) {
      const duplicate = {
        ...original,
        id: Math.max(...campaigns.map(c => c.id)) + 1,
        name: `${original.name} (Copy)`,
        status: 'paused',
        recipients: 0,
        openRate: 0,
        clickRate: 0,
        revenue: 0
      }
      setCampaigns([...campaigns, duplicate])
      toast({
        title: 'Campaign Duplicated',
        description: 'A copy has been created'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Campaigns</h2>
          <p className="text-muted-foreground">Create and manage your email marketing campaigns</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a new email marketing campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input id="campaignName" placeholder="Enter campaign name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broadcast">One-time Broadcast</SelectItem>
                      <SelectItem value="automation">Automation Series</SelectItem>
                      <SelectItem value="recurring">Recurring Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input id="subject" placeholder="Enter email subject line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers</SelectItem>
                    <SelectItem value="new">New Subscribers</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="inactive">Inactive Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(campaigns.reduce((acc, c) => acc + c.openRate, 0) / campaigns.length)}%
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${campaigns.reduce((acc, c) => acc + c.revenue, 0).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Overview of your email marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getTypeIcon(campaign.type)}
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {campaign.openRate > 20 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      {campaign.openRate}%
                    </div>
                  </TableCell>
                  <TableCell>{campaign.clickRate}%</TableCell>
                  <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleCampaign(campaign.id)}
                      >
                        {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDuplicateCampaign(campaign.id)}
                      >
                        <Copy className="h-4 w-4" />
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

// Lead Nurturing Component
const LeadNurturing = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: 'New Lead Welcome Series',
      trigger: 'Form Submission',
      stages: 5,
      activeLeads: 234,
      completionRate: 68,
      conversionRate: 12.4,
      avgDuration: '7 days',
      status: 'active'
    },
    {
      id: 2,
      name: 'Trial User Onboarding',
      trigger: 'Trial Started',
      stages: 3,
      activeLeads: 156,
      completionRate: 78,
      conversionRate: 24.6,
      avgDuration: '14 days',
      status: 'active'
    },
    {
      id: 3,
      name: 'Re-engagement Campaign',
      trigger: 'Inactive for 30 days',
      stages: 4,
      activeLeads: 89,
      completionRate: 45,
      conversionRate: 8.3,
      avgDuration: '10 days',
      status: 'active'
    }
  ])

  const [leadScoring] = useState([
    {
      criteria: 'Email Opened',
      points: 5,
      frequency: 'Per action',
      category: 'Engagement'
    },
    {
      criteria: 'Link Clicked',
      points: 10,
      frequency: 'Per action',
      category: 'Engagement'
    },
    {
      criteria: 'Form Submitted',
      points: 25,
      frequency: 'Per action',
      category: 'Interest'
    },
    {
      criteria: 'Demo Requested',
      points: 50,
      frequency: 'Per action',
      category: 'Intent'
    },
    {
      criteria: 'Pricing Page Visit',
      points: 20,
      frequency: 'Per action',
      category: 'Intent'
    },
    {
      criteria: 'Trial Started',
      points: 75,
      frequency: 'One time',
      category: 'Intent'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Nurturing</h2>
          <p className="text-muted-foreground">Automated workflows to nurture and score leads</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nurturing Workflows</CardTitle>
            <CardDescription>Automated lead nurturing sequences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      <p className="text-sm text-muted-foreground">Trigger: {workflow.trigger}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>{workflow.stages} stages</span>
                        <span>{workflow.activeLeads} active leads</span>
                        <span>~{workflow.avgDuration}</span>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded">
                          <div 
                            className="h-full bg-blue-500 rounded transition-all duration-300"
                            style={{ width: `${workflow.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{workflow.completionRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded">
                          <div 
                            className="h-full bg-green-500 rounded transition-all duration-300"
                            style={{ width: `${workflow.conversionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{workflow.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Edit Flow
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Scoring Rules</CardTitle>
            <CardDescription>Criteria for automatically scoring leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leadScoring.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{rule.criteria}</p>
                    <p className="text-sm text-muted-foreground">{rule.frequency}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rule.category}</Badge>
                      <span className="font-bold text-lg">+{rule.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Rule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Social Media Scheduling Component
const SocialMediaScheduling = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: 'Check out our latest product update! 🚀 New features that will boost your productivity.',
      platforms: ['twitter', 'linkedin', 'facebook'],
      scheduledTime: '2024-01-25 10:00',
      status: 'scheduled',
      engagement: { likes: 0, shares: 0, comments: 0 },
      mediaType: 'text'
    },
    {
      id: 2,
      content: 'Behind the scenes at our office! Meet the amazing team building the future.',
      platforms: ['instagram', 'facebook'],
      scheduledTime: '2024-01-24 14:30',
      status: 'published',
      engagement: { likes: 234, shares: 12, comments: 8 },
      mediaType: 'image'
    },
    {
      id: 3,
      content: 'Join our upcoming webinar: "Digital Marketing Trends 2024" - Register now!',
      platforms: ['linkedin', 'twitter'],
      scheduledTime: '2024-01-23 09:00',
      status: 'published',
      engagement: { likes: 89, shares: 45, comments: 16 },
      mediaType: 'text'
    }
  ])

  const [contentCalendar] = useState([
    { date: '2024-01-25', posts: 3, platforms: ['twitter', 'linkedin', 'facebook'] },
    { date: '2024-01-26', posts: 2, platforms: ['instagram', 'facebook'] },
    { date: '2024-01-27', posts: 1, platforms: ['linkedin'] },
    { date: '2024-01-28', posts: 4, platforms: ['twitter', 'instagram', 'facebook', 'linkedin'] }
  ])

  const getPlatformIcon = (platform: string) => {
    const icons = {
      twitter: '🐦',
      linkedin: '💼',
      facebook: '📘',
      instagram: '📷'
    }
    return icons[platform as keyof typeof icons] || '📱'
  }

  const getPlatformColor = (platform: string) => {
    const colors = {
      twitter: 'bg-blue-500',
      linkedin: 'bg-blue-700',
      facebook: 'bg-blue-600',
      instagram: 'bg-pink-500'
    }
    return colors[platform as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Scheduling</h2>
          <p className="text-muted-foreground">Plan and schedule your social media content</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Social Media Post</DialogTitle>
              <DialogDescription>Create and schedule content across platforms</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <Textarea id="content" placeholder="What would you like to share?" rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['twitter', 'linkedin', 'facebook', 'instagram'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Switch id={platform} />
                      <Label htmlFor={platform} className="flex items-center gap-2">
                        <span>{getPlatformIcon(platform)}</span>
                        <span className="capitalize">{platform}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate">Schedule Date</Label>
                  <Input id="scheduleDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Schedule Time</Label>
                  <Input id="scheduleTime" type="time" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Schedule Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.status === 'scheduled').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">
                  {posts.reduce((acc, p) => acc + p.engagement.likes + p.engagement.shares + p.engagement.comments, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platforms</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>Scheduled social media content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.filter(p => p.status === 'scheduled').map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm mb-2">{post.content}</p>
                      <div className="flex items-center gap-2 mb-2">
                        {post.platforms.map((platform) => (
                          <div 
                            key={platform}
                            className={`w-6 h-6 rounded-full ${getPlatformColor(platform)} flex items-center justify-center text-white text-xs`}
                          >
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {post.scheduledTime}
                      </div>
                    </div>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Calendar</CardTitle>
            <CardDescription>Overview of scheduled content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentCalendar.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-muted-foreground">{day.posts} posts scheduled</p>
                  </div>
                  <div className="flex gap-1">
                    {day.platforms.map((platform) => (
                      <div 
                        key={platform}
                        className={`w-6 h-6 rounded-full ${getPlatformColor(platform)} flex items-center justify-center text-white text-xs`}
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
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

// A/B Testing Component
const ABTesting = () => {
  const [tests] = useState([
    {
      id: 1,
      name: 'Email Subject Line Test',
      type: 'email',
      status: 'running',
      variants: {
        A: { name: 'Original: "New Features Available"', participants: 1250, conversions: 156, rate: 12.5 },
        B: { name: 'Variant: "🚀 Exciting Updates Just Dropped!"', participants: 1300, conversions: 189, rate: 14.5 }
      },
      confidence: 85,
      winner: 'B',
      startDate: '2024-01-20',
      endDate: '2024-01-27'
    },
    {
      id: 2,
      name: 'CTA Button Color Test',
      type: 'landing_page',
      status: 'completed',
      variants: {
        A: { name: 'Blue Button', participants: 2100, conversions: 294, rate: 14.0 },
        B: { name: 'Green Button', participants: 2050, conversions: 328, rate: 16.0 }
      },
      confidence: 92,
      winner: 'B',
      startDate: '2024-01-10',
      endDate: '2024-01-17'
    },
    {
      id: 3,
      name: 'Social Media Ad Copy',
      type: 'social_ad',
      status: 'draft',
      variants: {
        A: { name: 'Feature-focused copy', participants: 0, conversions: 0, rate: 0 },
        B: { name: 'Benefit-focused copy', participants: 0, conversions: 0, rate: 0 }
      },
      confidence: 0,
      winner: null,
      startDate: '2024-01-25',
      endDate: '2024-02-01'
    }
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'running': return 'default'
      case 'completed': return 'secondary'
      case 'draft': return 'outline'
      default: return 'outline'
    }
  }

  const getWinnerBadge = (winner: string | null, variant: string) => {
    if (winner === variant) {
      return <Badge className="ml-2 bg-green-500">Winner</Badge>
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">A/B Testing</h2>
          <p className="text-muted-foreground">Test and optimize your marketing campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tests</p>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'running').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'completed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">
                  {Math.round(tests.filter(t => t.confidence > 0).reduce((acc, t) => acc + t.confidence, 0) / tests.filter(t => t.confidence > 0).length)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvements</p>
                <p className="text-2xl font-bold">
                  {tests.filter(t => t.winner === 'B').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription>
                    {test.startDate} - {test.endDate} • {test.type.replace('_', ' ')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(test.status)}>{test.status}</Badge>
                  {test.confidence > 0 && (
                    <Badge variant="outline">{test.confidence}% confidence</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Variant A</h4>
                      {getWinnerBadge(test.winner, 'A')}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{test.variants.A.name}</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="font-bold">{test.variants.A.participants.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                        <p className="font-bold">{test.variants.A.conversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rate</p>
                        <p className="font-bold">{test.variants.A.rate}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Variant B</h4>
                      {getWinnerBadge(test.winner, 'B')}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{test.variants.B.name}</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="font-bold">{test.variants.B.participants.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                        <p className="font-bold">{test.variants.B.conversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rate</p>
                        <p className="font-bold">{test.variants.B.rate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-center space-y-4">
                    {test.status === 'completed' && test.winner && (
                      <div>
                        <div className="text-4xl font-bold text-green-500">
                          +{((test.variants.B.rate - test.variants.A.rate) / test.variants.A.rate * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Improvement</p>
                      </div>
                    )}
                    
                    {test.status === 'running' && (
                      <div>
                        <div className="text-2xl font-bold">
                          {test.confidence}%
                        </div>
                        <p className="text-sm text-muted-foreground">Statistical Confidence</p>
                        <div className="w-full h-2 bg-muted rounded mt-2">
                          <div 
                            className="h-full bg-blue-500 rounded transition-all duration-300"
                            style={{ width: `${test.confidence}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 justify-center">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {test.status === 'running' && (
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-2" />
                          Stop Test
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

type Props = {
  params: { subaccountId: string }
}

const MarketingAutomationPage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState('campaigns')

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketing Automation</h1>
            <p className="text-muted-foreground">Automate and optimize your marketing campaigns</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
            <TabsTrigger value="nurturing">Lead Nurturing</TabsTrigger>
            <TabsTrigger value="social">Social Scheduling</TabsTrigger>
            <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <EmailCampaigns />
          </TabsContent>

          <TabsContent value="nurturing">
            <LeadNurturing />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaScheduling />
          </TabsContent>

          <TabsContent value="testing">
            <ABTesting />
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default MarketingAutomationPage