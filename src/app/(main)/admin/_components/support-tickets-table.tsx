'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Eye, 
  MessageSquare, 
  Clock,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  XCircle
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type SupportTicket = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  userId: string
  assignedTo?: string
  resolution?: string
  createdAt: string
  updatedAt: string
  User: {
    name: string
    email: string
  }
  AssignedUser?: {
    name: string
    email: string
  }
  Agency?: {
    name: string
  }
}

const SupportTicketsTable = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [resolution, setResolution] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchTickets()
  }, [searchTerm, statusFilter, priorityFilter])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      
      const response = await fetch(`/api/admin/support?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setTickets(data.tickets || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch support tickets',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateTicketStatus = async (ticketId: string, status: string, resolution?: string) => {
    try {
      const response = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketId, 
          status,
          resolution 
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Ticket updated successfully'
        })
        fetchTickets()
        setSelectedTicket(null)
        setResolution('')
      } else {
        throw new Error('Failed to update ticket')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive'
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'destructive'
      case 'in_progress': return 'default'
      case 'resolved': return 'secondary'
      case 'closed': return 'outline'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return AlertCircle
      case 'in_progress': return Clock
      case 'resolved': return CheckCircle
      case 'closed': return XCircle
      default: return AlertCircle
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.User.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-tickets"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-priority-filter">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading tickets...
                  </TableCell>
                </TableRow>
              ) : filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => {
                  const StatusIcon = getStatusIcon(ticket.status)
                  
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium" data-testid={`text-ticket-title-${ticket.id}`}>
                              {ticket.title}
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {ticket.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{ticket.User.name}</div>
                            <div className="text-sm text-muted-foreground">{ticket.User.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge variant={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedTicket(ticket)}
                              data-testid={`button-view-ticket-${ticket.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Support Ticket Details</DialogTitle>
                              <DialogDescription>
                                Ticket #{selectedTicket?.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTicket && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="font-medium">Title</label>
                                    <p className="text-muted-foreground">{selectedTicket.title}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Status</label>
                                    <p>
                                      <Badge variant={getStatusColor(selectedTicket.status)}>
                                        {selectedTicket.status.replace('_', ' ')}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Priority</label>
                                    <p>
                                      <Badge variant={getPriorityColor(selectedTicket.priority)}>
                                        {selectedTicket.priority}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Category</label>
                                    <p className="text-muted-foreground">{selectedTicket.category}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="font-medium">Description</label>
                                  <p className="text-muted-foreground mt-1">{selectedTicket.description}</p>
                                </div>

                                {selectedTicket.resolution && (
                                  <div>
                                    <label className="font-medium">Resolution</label>
                                    <p className="text-muted-foreground mt-1">{selectedTicket.resolution}</p>
                                  </div>
                                )}

                                {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                                  <div className="space-y-4">
                                    <div>
                                      <label className="font-medium">Resolution</label>
                                      <Textarea
                                        placeholder="Enter resolution details..."
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        className="mt-1"
                                        data-testid="textarea-resolution"
                                      />
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                                        variant="outline"
                                        data-testid="button-mark-in-progress"
                                      >
                                        Mark In Progress
                                      </Button>
                                      <Button
                                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved', resolution)}
                                        disabled={!resolution.trim()}
                                        data-testid="button-resolve-ticket"
                                      >
                                        Resolve Ticket
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupportTicketsTable