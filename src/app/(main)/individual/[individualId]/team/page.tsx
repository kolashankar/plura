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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Paperclip, 
  MoreHorizontal,
  Calendar,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Bell,
  Activity,
  Target,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import BlurPage from '@/components/global/blur-page'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

// Project Sharing Component
const ProjectSharing = () => {
  const { toast } = useToast()
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Website Redesign',
      description: 'Complete redesign of the main e-commerce platform',
      collaborators: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
      status: 'active',
      progress: 75,
      dueDate: '2024-02-15',
      sharedWith: 12,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native mobile app for iOS and Android',
      collaborators: ['Alice Brown', 'Bob Wilson', 'Carol Davis'],
      status: 'in-review',
      progress: 45,
      dueDate: '2024-03-01',
      sharedWith: 8,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'Marketing Campaign Assets',
      description: 'Design assets for Q1 marketing campaign',
      collaborators: ['David Lee', 'Emma Taylor'],
      status: 'completed',
      progress: 100,
      dueDate: '2024-01-30',
      sharedWith: 5,
      lastActivity: '3 days ago'
    }
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500'
      case 'in-review': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const handleShareProject = (projectId: number) => {
    toast({
      title: 'Project Shared',
      description: 'Project sharing link has been copied to clipboard'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Sharing</h2>
          <p className="text-muted-foreground">Share and collaborate on projects with your team</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Set up a new collaborative project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" placeholder="Enter project name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your project" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collaborators">Add Collaborators</Label>
                <Input id="collaborators" placeholder="Enter email addresses separated by commas" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: project.id * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Due: {project.dueDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{project.sharedWith} collaborators</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {project.collaborators.slice(0, 3).map((collaborator, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="text-xs">
                            {collaborator.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.collaborators.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs">+{project.collaborators.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleShareProject(project.id)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Messaging Component
const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState('team-general')
  const [newMessage, setNewMessage] = useState('')
  const [chats] = useState([
    {
      id: 'team-general',
      name: 'General',
      type: 'channel',
      unread: 3,
      lastMessage: 'Great work on the latest update!',
      lastMessageTime: '2:30 PM'
    },
    {
      id: 'project-ecommerce',
      name: 'E-commerce Project',
      type: 'channel',
      unread: 1,
      lastMessage: 'The mockups are ready for review',
      lastMessageTime: '1:45 PM'
    },
    {
      id: 'dm-sarah',
      name: 'Sarah Smith',
      type: 'direct',
      unread: 0,
      lastMessage: 'Thanks for the feedback',
      lastMessageTime: '12:30 PM'
    }
  ])
  
  const [messages] = useState([
    {
      id: 1,
      user: 'John Doe',
      message: 'Hey team! Just finished the new analytics dashboard. Would love to get your feedback.',
      time: '2:30 PM',
      avatar: 'JD'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      message: 'Looks amazing! The new charts are much more intuitive.',
      time: '2:32 PM',
      avatar: 'SS'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      message: 'Agreed! The real-time data visualization is exactly what we needed.',
      time: '2:35 PM',
      avatar: 'MJ'
    }
  ])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('')
    }
  }

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden">
      {/* Chat List */}
      <div className="w-1/3 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Messages</h3>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-10" />
          </div>
        </div>
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedChat === chat.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {chat.type === 'channel' ? '#' : chat.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{chat.name}</p>
                      {chat.unread > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {chats.find(c => c.id === selectedChat)?.name}
            </h3>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.user}</span>
                  <span className="text-xs text-muted-foreground">{message.time}</span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button size="sm" variant="outline" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Activity Feeds Component
const ActivityFeeds = () => {
  const [activities] = useState([
    {
      id: 1,
      user: 'Sarah Smith',
      action: 'completed task',
      target: 'Homepage Redesign',
      time: '2 minutes ago',
      type: 'task',
      avatar: 'SS'
    },
    {
      id: 2,
      user: 'John Doe',
      action: 'shared project',
      target: 'Mobile App Mockups',
      time: '15 minutes ago',
      type: 'share',
      avatar: 'JD'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'commented on',
      target: 'E-commerce Dashboard',
      time: '1 hour ago',
      type: 'comment',
      avatar: 'MJ'
    },
    {
      id: 4,
      user: 'Alice Brown',
      action: 'uploaded file',
      target: 'Design Assets.zip',
      time: '2 hours ago',
      type: 'upload',
      avatar: 'AB'
    },
    {
      id: 5,
      user: 'Bob Wilson',
      action: 'created milestone',
      target: 'Beta Release',
      time: '3 hours ago',
      type: 'milestone',
      avatar: 'BW'
    }
  ])

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'task': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'share': return <Share2 className="h-4 w-4 text-blue-500" />
      case 'comment': return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'upload': return <FolderOpen className="h-4 w-4 text-orange-500" />
      case 'milestone': return <Target className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">Stay updated with team activities and progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getActivityIcon(activity.type)}
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Projects</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Tasks</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team Members</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Files Shared</span>
                  <span className="font-bold">89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Smith', tasks: 23, avatar: 'SS' },
                  { name: 'John Doe', tasks: 19, avatar: 'JD' },
                  { name: 'Mike Johnson', tasks: 15, avatar: 'MJ' }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{contributor.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{contributor.name}</span>
                    </div>
                    <Badge variant="secondary">{contributor.tasks}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Member Management Component
const MemberManagement = () => {
  const { toast } = useToast()
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'Admin',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: '2 minutes ago',
      projects: 8,
      avatar: 'SS'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Developer',
      status: 'active',
      joinDate: '2023-02-20',
      lastActive: '1 hour ago',
      projects: 6,
      avatar: 'JD'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Designer',
      status: 'away',
      joinDate: '2023-03-10',
      lastActive: '1 day ago',
      projects: 4,
      avatar: 'MJ'
    }
  ])

  const handleInviteMember = () => {
    toast({
      title: 'Invitation Sent',
      description: 'Team member invitation has been sent successfully'
    })
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-500'
      case 'away': return 'text-yellow-500'
      case 'offline': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-muted-foreground">Manage team members and their permissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to a new team member</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Welcome Message (Optional)</Label>
                <Textarea id="message" placeholder="Add a personal welcome message" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleInviteMember}>Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{members.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Projects</p>
                <p className="text-2xl font-bold">{Math.round(members.reduce((acc, m) => acc + m.projects, 0) / members.length)}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{member.name}</h4>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status).replace('text-', 'bg-')}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">Joined {member.joinDate}</span>
                      <span className="text-xs text-muted-foreground">{member.projects} projects</span>
                      <span className="text-xs text-muted-foreground">Last active {member.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{member.role}</Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
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

type Props = {
  params: { IndividualId: string }
}

const TeamCollaborationPage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <BlurPage>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Collaboration</h1>
            <p className="text-muted-foreground">Collaborate effectively with your team members</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Project Sharing</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectSharing />
          </TabsContent>

          <TabsContent value="messaging">
            <Messaging />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeeds />
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </BlurPage>
  )
}

export default TeamCollaborationPage