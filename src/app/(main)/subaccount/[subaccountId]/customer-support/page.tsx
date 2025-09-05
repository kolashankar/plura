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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Phone,
  Mail,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Headphones,
  FileText,
  Zap,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Settings,
  BookOpen,
  HelpCircle,
  Smile,
  Frown,
  Meh
} from 'lucide-react'
import BlurPage from '@/components/global/blur-page'
import { useToast } from '@/hooks/use-toast'

// Live Chat Component
const LiveChat = () => {
  const { toast } = useToast()
  const [conversations, setConversations] = useState([
    {
      id: 1,
      customer: 'John Smith',
      email: 'john@example.com',
      status: 'active',
      priority: 'high',
      lastMessage: 'I need help with billing',
      lastMessageTime: '2 min ago',
      agent: 'Sarah Wilson',
      waitTime: '1m 30s',
      messages: [
        { sender: 'customer', message: 'Hi, I have a billing question', time: '10:30 AM' },
        { sender: 'agent', message: 'Hello! I\'d be happy to help with your billing question. What specifically do you need assistance with?', time: '10:31 AM' },
        { sender: 'customer', message: 'I need help with billing', time: '10:32 AM' }
      ]
    },
    {
      id: 2,
      customer: 'Emma Davis',
      email: 'emma@example.com',
      status: 'waiting',
      priority: 'medium',
      lastMessage: 'How do I reset my password?',
      lastMessageTime: '5 min ago',
      agent: null,
      waitTime: '5m 12s',
      messages: [
        { sender: 'customer', message: 'How do I reset my password?', time: '10:25 AM' }
      ]
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'resolved',
      priority: 'low',
      lastMessage: 'Thank you for your help!',
      lastMessageTime: '1 hour ago',
      agent: 'Alex Brown',
      waitTime: '2m 45s',
      messages: [
        { sender: 'customer', message: 'I can\'t access my dashboard', time: '9:15 AM' },
        { sender: 'agent', message: 'Let me help you with that. Can you try clearing your browser cache?', time: '9:16 AM' },
        { sender: 'customer', message: 'That worked! Thank you for your help!', time: '9:20 AM' }
      ]
    }
  ])

  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'default'
      case 'waiting': return 'secondary'
      case 'resolved': return 'outline'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedConversation = {
        ...selectedConversation,
        messages: [
          ...selectedConversation.messages,
          { sender: 'agent', message: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }
      setSelectedConversation(updatedConversation)
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      ))
      setNewMessage('')
    }
  }

  const handleAssignToMe = () => {
    const updatedConversation = { ...selectedConversation, agent: 'You', status: 'active' }
    setSelectedConversation(updatedConversation)
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    ))
    toast({
      title: 'Conversation Assigned',
      description: 'You have been assigned to this conversation'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Chat</h2>
          <p className="text-muted-foreground">Real-time customer support conversations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Chat Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Chats</p>
                <p className="text-2xl font-bold">{conversations.filter(c => c.status === 'active').length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waiting</p>
                <p className="text-2xl font-bold">{conversations.filter(c => c.status === 'waiting').length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">2m 15s</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Active and waiting conversations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation.id === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {conversation.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{conversation.customer}</p>
                          <Badge variant={getPriorityColor(conversation.priority)} className="text-xs">
                            {conversation.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(conversation.status)} className="text-xs">
                            {conversation.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {conversation.agent && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {conversation.agent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedConversation.customer}</CardTitle>
                <CardDescription>{selectedConversation.email}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(selectedConversation.status)}>
                  {selectedConversation.status}
                </Badge>
                {!selectedConversation.agent && (
                  <Button size="sm" onClick={handleAssignToMe}>
                    Assign to Me
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {selectedConversation.messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs p-3 rounded-lg ${
                        message.sender === 'agent' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'agent' ? 'text-blue-100' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Ticket Management Component
const TicketManagement = () => {
  const { toast } = useToast()
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      title: 'Cannot access billing dashboard',
      customer: 'John Smith',
      email: 'john@example.com',
      priority: 'high',
      status: 'open',
      category: 'billing',
      assignee: 'Sarah Wilson',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      description: 'User reports being unable to access the billing dashboard after recent update.'
    },
    {
      id: 'TKT-002',
      title: 'Feature request: Dark mode',
      customer: 'Emma Davis',
      email: 'emma@example.com',
      priority: 'low',
      status: 'in_progress',
      category: 'feature_request',
      assignee: 'Mike Johnson',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-21',
      description: 'Customer requesting dark mode option for better user experience.'
    },
    {
      id: 'TKT-003',
      title: 'Password reset not working',
      customer: 'Alex Brown',
      email: 'alex@example.com',
      priority: 'medium',
      status: 'resolved',
      category: 'technical',
      assignee: 'Lisa Chen',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19',
      description: 'Password reset emails not being received by the user.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'destructive'
      case 'in_progress': return 'default'
      case 'resolved': return 'secondary'
      case 'closed': return 'outline'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'billing': return <FileText className="h-4 w-4" />
      case 'technical': return <Settings className="h-4 w-4" />
      case 'feature_request': return <Star className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : ticket
    ))
    toast({
      title: 'Ticket Updated',
      description: `Ticket status changed to ${newStatus}`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ticket Management</h2>
          <p className="text-muted-foreground">Track and manage customer support requests</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>Create a support ticket for a customer</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input id="customerEmail" type="email" placeholder="Enter email address" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketTitle">Ticket Title</Label>
                <Input id="ticketTitle" placeholder="Brief description of the issue" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Wilson</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                      <SelectItem value="lisa">Lisa Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Detailed description of the issue" rows={4} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'in_progress').length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold">2.3 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tickets..." 
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.id}</p>
                      <p className="text-sm text-muted-foreground">{ticket.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.customer}</p>
                      <p className="text-sm text-muted-foreground">{ticket.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={ticket.status} 
                      onValueChange={(value) => handleStatusChange(ticket.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(ticket.category)}
                      <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>{ticket.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
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

// Knowledge Base Component
const KnowledgeBase = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Getting Started Guide',
      category: 'Getting Started',
      views: 2847,
      helpful: 94,
      lastUpdated: '2024-01-20',
      author: 'Support Team',
      tags: ['onboarding', 'basics', 'setup'],
      status: 'published'
    },
    {
      id: 2,
      title: 'How to Reset Your Password',
      category: 'Account Management',
      views: 1523,
      helpful: 87,
      lastUpdated: '2024-01-18',
      author: 'Sarah Wilson',
      tags: ['password', 'security', 'account'],
      status: 'published'
    },
    {
      id: 3,
      title: 'Billing and Subscription FAQ',
      category: 'Billing',
      views: 1234,
      helpful: 91,
      lastUpdated: '2024-01-15',
      author: 'Mike Johnson',
      tags: ['billing', 'subscription', 'payments'],
      status: 'published'
    },
    {
      id: 4,
      title: 'Advanced Features Overview',
      category: 'Features',
      views: 856,
      helpful: 89,
      lastUpdated: '2024-01-12',
      author: 'Lisa Chen',
      tags: ['features', 'advanced', 'tools'],
      status: 'draft'
    }
  ])

  const [categories] = useState([
    { name: 'Getting Started', count: 12, color: 'bg-blue-500' },
    { name: 'Account Management', count: 8, color: 'bg-green-500' },
    { name: 'Billing', count: 6, color: 'bg-purple-500' },
    { name: 'Features', count: 15, color: 'bg-orange-500' },
    { name: 'Troubleshooting', count: 10, color: 'bg-red-500' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">Self-service support articles and documentation</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
              <DialogDescription>Add a new article to your knowledge base</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="articleTitle">Article Title</Label>
                <Input id="articleTitle" placeholder="Enter article title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" placeholder="Article author" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="tag1, tag2, tag3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Article Content</Label>
                <Textarea id="content" placeholder="Write your article content here..." rows={6} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Article</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{articles.filter(a => a.status === 'published').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{articles.reduce((acc, a) => acc + a.views, 0).toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Helpfulness</p>
                <p className="text-2xl font-bold">
                  {Math.round(articles.reduce((acc, a) => acc + a.helpful, 0) / articles.length)}%
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Article categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                All Articles ({articles.length})
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category.name}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mr-2">{article.category}</Badge>
                        by {article.author}
                      </CardDescription>
                    </div>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-bold">{article.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Helpful</p>
                        <p className="font-bold">{article.helpful}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Updated</p>
                        <p className="font-bold">{article.lastUpdated}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Customer Satisfaction Component
const CustomerSatisfaction = () => {
  const satisfactionData = {
    overallRating: 4.6,
    totalResponses: 1247,
    ratings: [
      { score: 5, count: 687, percentage: 55 },
      { score: 4, count: 374, percentage: 30 },
      { score: 3, count: 125, percentage: 10 },
      { score: 2, count: 37, percentage: 3 },
      { score: 1, count: 24, percentage: 2 }
    ]
  }

  const [recentFeedback] = useState([
    {
      id: 1,
      customer: 'John Smith',
      rating: 5,
      comment: 'Excellent support! Quick response and very helpful.',
      category: 'live_chat',
      agent: 'Sarah Wilson',
      date: '2024-01-22'
    },
    {
      id: 2,
      customer: 'Emma Davis',
      rating: 4,
      comment: 'Good service, but took a bit longer than expected.',
      category: 'ticket',
      agent: 'Mike Johnson',
      date: '2024-01-21'
    },
    {
      id: 3,
      customer: 'Alex Brown',
      rating: 5,
      comment: 'Perfect! Found exactly what I needed in the knowledge base.',
      category: 'self_service',
      agent: null,
      date: '2024-01-20'
    }
  ])

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <Smile className="h-5 w-5 text-green-500" />
    if (rating === 3) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Frown className="h-5 w-5 text-red-500" />
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500'
    if (rating === 3) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customer Satisfaction</h2>
        <p className="text-muted-foreground">Monitor customer feedback and satisfaction metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
                <p className="text-2xl font-bold">{satisfactionData.overallRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Responses</p>
                <p className="text-2xl font-bold">{satisfactionData.totalResponses.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive Ratings</p>
                <p className="text-2xl font-bold">
                  {Math.round((satisfactionData.ratings.slice(0, 2).reduce((acc, r) => acc + r.count, 0) / satisfactionData.totalResponses) * 100)}%
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of customer satisfaction ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {satisfactionData.ratings.map((rating) => (
                <div key={rating.score} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    <span className="font-medium">{rating.score}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-muted rounded">
                      <div 
                        className="h-full bg-blue-500 rounded transition-all duration-300"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {rating.count} ({rating.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest customer satisfaction responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feedback.customer}</span>
                      {getRatingIcon(feedback.rating)}
                      <span className={`font-bold ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}/5
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feedback.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feedback.comment}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{feedback.date}</span>
                    {feedback.agent && <span>Agent: {feedback.agent}</span>}
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

const CustomerSupportPage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Support</h1>
            <p className="text-muted-foreground">Comprehensive customer support management system</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <LiveChat />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketManagement />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="satisfaction">
            <CustomerSatisfaction />
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default CustomerSupportPage