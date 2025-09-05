'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  Play,
  Pause,
  Settings,
  Plus,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import FeatureGate from '@/components/ui/feature-gate'

interface SocialPost {
  id: string
  content: string
  platforms: string[]
  scheduledTime: Date
  status: 'scheduled' | 'published' | 'failed'
  mediaUrls?: string[]
}

interface SocialMediaSchedulerProps {
  subAccountId: string
  automationId?: string
}

const SocialMediaScheduler: React.FC<SocialMediaSchedulerProps> = ({
  subAccountId,
  automationId = 'social-scheduler-default'
}) => {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    mediaUrls: [] as string[]
  })

  // Connected platforms
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    facebook: true,
    twitter: true,
    instagram: false,
    linkedin: false
  })

  useEffect(() => {
    fetchScheduledPosts()
    fetchAutomationStatus()
  }, [])

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch(`/api/automations/social-media/posts?subAccountId=${subAccountId}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const fetchAutomationStatus = async () => {
    try {
      const response = await fetch(`/api/automations/${automationId}/status?subAccountId=${subAccountId}`)
      if (response.ok) {
        const data = await response.json()
        setIsActive(data.isRunning)
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  const toggleScheduler = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/${automationId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subAccountId, 
          action: isActive ? 'pause' : 'start',
          type: 'social-media'
        })
      })
      
      if (response.ok) {
        setIsActive(!isActive)
        toast({
          title: isActive ? 'Scheduler Paused' : 'Scheduler Started',
          description: `Social media scheduler is now ${isActive ? 'paused' : 'active'}.`
        })
      }
    } catch (error) {
      console.error('Failed to toggle scheduler:', error)
      toast({
        title: "Error",
        description: "Failed to toggle scheduler. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const schedulePost = async () => {
    if (!newPost.content.trim() || newPost.platforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add content and select at least one platform.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/social-media/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          subAccountId,
          automationId
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPosts(prev => [...prev, data])
        setNewPost({
          content: '',
          platforms: [],
          scheduledTime: new Date(Date.now() + 60 * 60 * 1000),
          mediaUrls: []
        })
        toast({
          title: "Post Scheduled",
          description: "Your social media post has been scheduled successfully."
        })
      }
    } catch (error) {
      console.error('Failed to schedule post:', error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/automations/social-media/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subAccountId })
      })
      
      if (response.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId))
        toast({
          title: "Post Deleted",
          description: "Scheduled post has been removed."
        })
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      default:
        return null
    }
  }

  const togglePlatform = (platform: string) => {
    if (!connectedPlatforms[platform as keyof typeof connectedPlatforms]) {
      toast({
        title: "Platform Not Connected",
        description: `Please connect your ${platform} account first.`,
        variant: "destructive"
      })
      return
    }

    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  return (
    <FeatureGate feature="automations">
      <div className="space-y-6">
        {/* Header */}
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Social Media Scheduler
              </CardTitle>
              <CardDescription>
                Schedule and manage your social media posts across platforms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Paused"}
              </Badge>
              <Button
                size="sm"
                variant={isActive ? "destructive" : "default"}
                onClick={toggleScheduler}
                disabled={isLoading}
              >
                {isLoading ? '...' : isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Schedule New Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postContent">Post Content</Label>
            <Textarea
              id="postContent"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="What would you like to share?"
              rows={4}
              maxLength={280}
            />
            <span className="text-xs text-muted-foreground">
              {newPost.content.length}/280 characters
            </span>
          </div>

          <div className="space-y-2">
            <Label>Select Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(connectedPlatforms).map(([platform, connected]) => (
                <Button
                  key={platform}
                  variant={newPost.platforms.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform(platform)}
                  disabled={!connected}
                  className="flex items-center gap-2"
                >
                  {getPlatformIcon(platform)}
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  {!connected && <Badge variant="secondary" className="ml-1">Not Connected</Badge>}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Schedule Date & Time</Label>
              <Input
                id="scheduledTime"
                type="datetime-local"
                value={newPost.scheduledTime.toISOString().slice(0, 16)}
                onChange={(e) => setNewPost(prev => ({ 
                  ...prev, 
                  scheduledTime: new Date(e.target.value) 
                }))}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <Button 
            onClick={schedulePost} 
            disabled={isLoading || !newPost.content.trim() || newPost.platforms.length === 0}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Scheduling...' : 'Schedule Post'}
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No posts scheduled yet</p>
              <p className="text-sm">Create your first scheduled post above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{post.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {post.scheduledTime.toLocaleString()}
                        </span>
                        <Badge variant={
                          post.status === 'published' ? 'default' :
                          post.status === 'failed' ? 'destructive' : 'secondary'
                        }>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Platforms:</span>
                    <div className="flex gap-1">
                      {post.platforms.map(platform => (
                        <div key={platform} className="flex items-center gap-1">
                          {getPlatformIcon(platform)}
                          <span className="text-xs">{platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </FeatureGate>
  )
}

export default SocialMediaScheduler