'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Megaphone, 
  Plus, 
  Edit,
  Trash2,
  Search,
  Send,
  Calendar
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Announcement = {
  id: string
  title: string
  content: string
  type: string
  priority: string
  targetType: string
  targetIds?: string
  isPublished: boolean
  publishAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'normal',
    targetType: 'all',
    publishAt: '',
    expiresAt: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/announcements')
      const data = await response.json()
      
      if (response.ok) {
        setAnnouncements(data.announcements || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch announcements',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createAnnouncement = async () => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement created successfully'
        })
        setShowCreateDialog(false)
        setNewAnnouncement({
          title: '',
          content: '',
          type: 'info',
          priority: 'normal',
          targetType: 'all',
          publishAt: '',
          expiresAt: ''
        })
        fetchAnnouncements()
      } else {
        throw new Error('Failed to create announcement')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive'
      })
    }
  }

  const publishAnnouncement = async (announcementId: string) => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          announcementId, 
          action: 'publish'
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement published successfully'
        })
        fetchAnnouncements()
      } else {
        throw new Error('Failed to publish announcement')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish announcement',
        variant: 'destructive'
      })
    }
  }

  const deleteAnnouncement = async (announcementId: string) => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementId })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement deleted successfully'
        })
        fetchAnnouncements()
      } else {
        throw new Error('Failed to delete announcement')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive'
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'default'
      case 'warning': return 'secondary'
      case 'success': return 'outline'
      case 'error': return 'destructive'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'normal': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-announcements"
          />
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-announcement">
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create a new platform-wide announcement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title"
                  data-testid="input-announcement-title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Announcement content"
                  className="min-h-[120px]"
                  data-testid="textarea-announcement-content"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newAnnouncement.type} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}>
                    <SelectTrigger data-testid="select-announcement-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}>
                    <SelectTrigger data-testid="select-announcement-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="targetType">Target Audience</Label>
                <Select value={newAnnouncement.targetType} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, targetType: value })}>
                  <SelectTrigger data-testid="select-target-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="agencies">Agencies Only</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createAnnouncement} data-testid="button-save-announcement">
                  Create Announcement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements ({filteredAnnouncements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading announcements...
                  </TableCell>
                </TableRow>
              ) : filteredAnnouncements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No announcements found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium" data-testid={`text-announcement-title-${announcement.id}`}>
                            {announcement.title}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {announcement.content}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{announcement.targetType}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={announcement.isPublished ? 'default' : 'secondary'}>
                        {announcement.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!announcement.isPublished && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => publishAnnouncement(announcement.id)}
                            data-testid={`button-publish-${announcement.id}`}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAnnouncement(announcement)}
                          data-testid={`button-edit-announcement-${announcement.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAnnouncement(announcement.id)}
                          data-testid={`button-delete-announcement-${announcement.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnnouncementsManager