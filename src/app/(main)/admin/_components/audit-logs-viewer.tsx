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
  Filter,
  FileText,
  User,
  Calendar,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type AuditLog = {
  id: string
  action: string
  entity: string
  entityId?: string
  oldValues?: string
  newValues?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  AdminUser: {
    User: {
      name: string
      email: string
    }
  }
}

const AuditLogsViewer = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAuditLogs()
  }, [searchTerm, entityFilter])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (entityFilter !== 'all') params.append('entity', entityFilter)
      params.append('limit', '100')
      
      const response = await fetch(`/api/admin/audit-logs?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setAuditLogs(data.auditLogs || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch audit logs',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'default'
    if (action.includes('UPDATE')) return 'secondary'
    if (action.includes('DELETE') || action.includes('SUSPEND')) return 'destructive'
    if (action.includes('VIEW')) return 'outline'
    return 'default'
  }

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.AdminUser.User.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-logs"
          />
        </div>
        
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-entity-filter">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="User">Users</SelectItem>
            <SelectItem value="Agency">Agencies</SelectItem>
            <SelectItem value="FeatureFlag">Feature Flags</SelectItem>
            <SelectItem value="SupportTicket">Support Tickets</SelectItem>
            <SelectItem value="SystemConfig">System Config</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={fetchAuditLogs} variant="outline" data-testid="button-refresh-logs">
          <Filter className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading audit logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Badge variant={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.entity}</span>
                        {log.entityId && (
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            {log.entityId.slice(0, 8)}...
                          </code>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{log.AdminUser.User.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.AdminUser.User.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {log.ipAddress || 'unknown'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                            data-testid={`button-view-log-${log.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about this audit log entry
                            </DialogDescription>
                          </DialogHeader>
                          {selectedLog && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="font-medium">Action</label>
                                  <p>
                                    <Badge variant={getActionColor(selectedLog.action)}>
                                      {selectedLog.action}
                                    </Badge>
                                  </p>
                                </div>
                                <div>
                                  <label className="font-medium">Entity</label>
                                  <p className="text-muted-foreground">{selectedLog.entity}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Entity ID</label>
                                  <p className="text-muted-foreground font-mono text-sm">
                                    {selectedLog.entityId || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <label className="font-medium">IP Address</label>
                                  <p className="text-muted-foreground font-mono text-sm">
                                    {selectedLog.ipAddress || 'unknown'}
                                  </p>
                                </div>
                                <div>
                                  <label className="font-medium">Admin User</label>
                                  <p className="text-muted-foreground">
                                    {selectedLog.AdminUser.User.name} ({selectedLog.AdminUser.User.email})
                                  </p>
                                </div>
                                <div>
                                  <label className="font-medium">Date</label>
                                  <p className="text-muted-foreground">
                                    {new Date(selectedLog.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              
                              {selectedLog.oldValues && (
                                <div>
                                  <label className="font-medium">Previous Values</label>
                                  <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                                    {JSON.stringify(JSON.parse(selectedLog.oldValues), null, 2)}
                                  </pre>
                                </div>
                              )}
                              
                              {selectedLog.newValues && (
                                <div>
                                  <label className="font-medium">New Values</label>
                                  <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                                    {JSON.stringify(JSON.parse(selectedLog.newValues), null, 2)}
                                  </pre>
                                </div>
                              )}
                              
                              {selectedLog.userAgent && (
                                <div>
                                  <label className="font-medium">User Agent</label>
                                  <p className="text-muted-foreground text-sm break-all">
                                    {selectedLog.userAgent}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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

export default AuditLogsViewer