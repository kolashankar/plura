'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Download,
  FileText,
  Users,
  Database,
  Globe,
  Activity,
  RefreshCw,
  Calendar,
  Key,
  ShieldCheck
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

type SecurityAlert = {
  id: string
  type: 'authentication' | 'authorization' | 'data_breach' | 'suspicious_activity' | 'vulnerability'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  source: string
  timestamp: string
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  affectedUsers?: number
  details: {
    ipAddress?: string
    userAgent?: string
    location?: string
    method?: string
  }
}

type ComplianceReport = {
  id: string
  type: 'gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'pci_dss'
  status: 'compliant' | 'non_compliant' | 'partially_compliant'
  lastAudit: string
  nextAudit: string
  findings: number
  criticalIssues: number
  score: number
}

type DataRequest = {
  id: string
  type: 'data_export' | 'data_deletion' | 'data_rectification' | 'data_portability'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  requester: {
    name: string
    email: string
  }
  requestedAt: string
  completedAt?: string
  dataTypes: string[]
  reason: string
}

const SecurityCompliance = () => {
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([])
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      
      const [alertsResponse, complianceResponse, requestsResponse] = await Promise.all([
        fetch('/api/admin/security/alerts'),
        fetch('/api/admin/security/compliance'),
        fetch('/api/admin/security/data-requests')
      ])
      
      const [alertsData, complianceData, requestsData] = await Promise.all([
        alertsResponse.json(),
        complianceResponse.json(),
        requestsResponse.json()
      ])
      
      if (alertsResponse.ok) {
        setSecurityAlerts(alertsData.alerts)
      }
      if (complianceResponse.ok) {
        setComplianceReports(complianceData.reports)
      }
      if (requestsResponse.ok) {
        setDataRequests(requestsData.requests)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch security data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateAlertStatus = async (alertId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/security/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, status })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Alert status updated successfully'
        })
        fetchSecurityData()
      } else {
        throw new Error('Failed to update alert status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update alert status',
        variant: 'destructive'
      })
    }
  }

  const processDataRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/security/data-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Data request ${action}d successfully`
        })
        fetchSecurityData()
      } else {
        throw new Error(`Failed to ${action} data request`)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} data request`,
        variant: 'destructive'
      })
    }
  }

  const generateComplianceReport = async (type: string) => {
    try {
      const response = await fetch('/api/admin/security/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Compliance report generation started'
        })
        fetchSecurityData()
      } else {
        throw new Error('Failed to generate compliance report')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate compliance report',
        variant: 'destructive'
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'default'
      case 'investigating': return 'secondary'
      case 'open': return 'destructive'
      case 'false_positive': return 'outline'
      default: return 'outline'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'default'
      case 'partially_compliant': return 'secondary'
      case 'non_compliant': return 'destructive'
      default: return 'outline'
    }
  }

  const filteredAlerts = securityAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold">
                  {securityAlerts.filter(a => a.severity === 'critical' && a.status === 'open').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Alerts</p>
                <p className="text-2xl font-bold">{securityAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Compliance Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(complianceReports.reduce((acc, r) => acc + r.score, 0) / complianceReports.length || 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Data Requests</p>
                <p className="text-2xl font-bold">
                  {dataRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Compliance Tabs */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="data-requests">Data Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-alerts"
              />
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-severity-filter">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchSecurityData} variant="outline" data-testid="button-refresh-alerts">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Alerts ({filteredAlerts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading security alerts...
                      </TableCell>
                    </TableRow>
                  ) : filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No security alerts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium" data-testid={`text-alert-title-${alert.id}`}>
                                {alert.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {alert.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {alert.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(alert.status)}>
                            {alert.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{alert.source}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedAlert(alert)}
                                  data-testid={`button-view-alert-${alert.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Security Alert Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information about this security alert
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedAlert && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="font-medium">Type:</label>
                                        <p className="text-muted-foreground">{selectedAlert.type.replace('_', ' ')}</p>
                                      </div>
                                      <div>
                                        <label className="font-medium">Severity:</label>
                                        <Badge variant={getSeverityColor(selectedAlert.severity)} className="ml-2">
                                          {selectedAlert.severity}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="font-medium">Source:</label>
                                        <p className="text-muted-foreground">{selectedAlert.source}</p>
                                      </div>
                                      <div>
                                        <label className="font-medium">Status:</label>
                                        <Badge variant={getStatusColor(selectedAlert.status)} className="ml-2">
                                          {selectedAlert.status.replace('_', ' ')}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="font-medium">Description:</label>
                                      <p className="text-muted-foreground">{selectedAlert.description}</p>
                                    </div>
                                    
                                    {selectedAlert.details.ipAddress && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="font-medium">IP Address:</label>
                                          <p className="text-muted-foreground font-mono">{selectedAlert.details.ipAddress}</p>
                                        </div>
                                        <div>
                                          <label className="font-medium">Location:</label>
                                          <p className="text-muted-foreground">{selectedAlert.details.location || 'Unknown'}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedAlert.details.userAgent && (
                                      <div>
                                        <label className="font-medium">User Agent:</label>
                                        <p className="text-muted-foreground text-sm break-all">{selectedAlert.details.userAgent}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Select onValueChange={(value) => updateAlertStatus(alert.id, value)}>
                              <SelectTrigger className="w-[140px]" data-testid={`select-alert-status-${alert.id}`}>
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="investigating">Investigating</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="false_positive">False Positive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Compliance Reports</h3>
            <Select onValueChange={generateComplianceReport}>
              <SelectTrigger className="w-[200px]" data-testid="select-generate-report">
                <SelectValue placeholder="Generate Report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gdpr">GDPR Report</SelectItem>
                <SelectItem value="ccpa">CCPA Report</SelectItem>
                <SelectItem value="hipaa">HIPAA Report</SelectItem>
                <SelectItem value="sox">SOX Report</SelectItem>
                <SelectItem value="pci_dss">PCI DSS Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            {complianceReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium text-lg" data-testid={`text-compliance-type-${report.id}`}>
                          {report.type.toUpperCase()} Compliance
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Last audit: {new Date(report.lastAudit).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Next audit: {new Date(report.nextAudit).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={getComplianceColor(report.status)} className="mb-2">
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <div className="text-2xl font-bold">{report.score}%</div>
                      <div className="text-sm text-muted-foreground">
                        {report.findings} findings • {report.criticalIssues} critical
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="data-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Privacy Requests ({dataRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Types</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium" data-testid={`text-requester-name-${request.id}`}>
                            {request.requester.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.requester.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {request.dataTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {request.dataTypes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{request.dataTypes.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => processDataRequest(request.id, 'approve')}
                              data-testid={`button-approve-request-${request.id}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => processDataRequest(request.id, 'reject')}
                              data-testid={`button-reject-request-${request.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {request.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-download-request-${request.id}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SecurityCompliance