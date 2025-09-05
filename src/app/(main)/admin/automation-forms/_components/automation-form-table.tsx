'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  Edit2, 
  Eye, 
  Copy, 
  Trash2, 
  ExternalLink,
  BarChart3,
  Settings,
  Users,
  Mail
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface AutomationForm {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  automationType: string
  category?: string
  icon?: string
  workflowUrl?: string
  webhookUrl?: string
  isPublic: boolean
  restrictToAgency: boolean
  restrictToIndividual: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  subAccountId?: string
  individualId?: string
  _count: {
    submissions: number
    automations: number
  }
  SubAccount?: {
    id: string
    name: string
  }
  Individual?: {
    id: string
    name: string
    email: string
  }
}

interface AutomationFormTableProps {
  forms: AutomationForm[]
  loading: boolean
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  onRefresh: () => void
  onPageChange: (offset: number) => void
}

export function AutomationFormTable({
  forms,
  loading,
  pagination,
  onRefresh,
  onPageChange
}: AutomationFormTableProps) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const variants = {
      PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
      DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return variants[status as keyof typeof variants] || variants.DRAFT
  }

  const getAccountInfo = (form: AutomationForm) => {
    if (form.SubAccount) {
      return {
        type: 'Sub Account',
        name: form.SubAccount.name,
        icon: <Users size={14} className=\"text-blue-600\" />
      }
    }
    if (form.Individual) {
      return {
        type: 'Individual',
        name: form.Individual.name,
        icon: <Mail size={14} className=\"text-purple-600\" />
      }
    }
    return {
      type: 'System',
      name: 'System Admin',
      icon: <Settings size={14} className=\"text-gray-600\" />
    }
  }

  const handleCopyWebhookUrl = (webhookUrl: string) => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl)
      // You could add a toast notification here
    }
  }

  const handleDeleteForm = async (formId: string) => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/automation-forms/${formId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          onRefresh()
        }
      } catch (error) {
        console.error('Error deleting form:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className=\"space-y-4\">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className=\"p-4\">
              <div className=\"flex items-center space-x-4\">
                <Skeleton className=\"h-4 w-[200px]\" />
                <Skeleton className=\"h-4 w-[100px]\" />
                <Skeleton className=\"h-4 w-[150px]\" />
                <Skeleton className=\"h-4 w-[80px]\" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className=\"p-8 text-center\">
          <Mail className=\"mx-auto h-12 w-12 text-gray-400 mb-4\" />
          <h3 className=\"text-lg font-medium text-gray-900 dark:text-white mb-2\">
            No automation forms found
          </h3>
          <p className=\"text-gray-600 dark:text-gray-300 mb-4\">
            Get started by creating your first automation form.
          </p>
          <Button>Create Your First Form</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className=\"space-y-4\">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className=\"text-right\">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => {
            const accountInfo = getAccountInfo(form)
            
            return (
              <TableRow key={form.id} className=\"hover:bg-gray-50 dark:hover:bg-gray-800\">
                <TableCell>
                  <div>
                    <div className=\"font-medium text-gray-900 dark:text-white\">
                      {form.name}
                    </div>
                    {form.description && (
                      <div className=\"text-sm text-gray-600 dark:text-gray-300 mt-1\">
                        {form.description.length > 50
                          ? `${form.description.substring(0, 50)}...`
                          : form.description
                        }
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className=\"flex items-center gap-2\">
                    {form.icon && <span className=\"text-lg\">{form.icon}</span>}
                    <div>
                      <div className=\"text-sm font-medium\">
                        {form.automationType.replace('_', ' ').toLowerCase().replace(/^\\w/, c => c.toUpperCase())}
                      </div>
                      {form.category && (
                        <div className=\"text-xs text-gray-500\">{form.category}</div>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className=\"flex items-center gap-2\">
                    {accountInfo.icon}
                    <div>
                      <div className=\"text-sm font-medium\">{accountInfo.name}</div>
                      <div className=\"text-xs text-gray-500\">{accountInfo.type}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className={getStatusBadge(form.status)}>
                    {form.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className=\"flex flex-wrap gap-1\">
                    {form.isPublic && (
                      <Badge variant=\"outline\" className=\"text-xs bg-blue-50 text-blue-700 border-blue-200\">
                        Public
                      </Badge>
                    )}
                    {form.restrictToAgency && (
                      <Badge variant=\"outline\" className=\"text-xs bg-purple-50 text-purple-700 border-purple-200\">
                        Agency
                      </Badge>
                    )}
                    {form.restrictToIndividual && (
                      <Badge variant=\"outline\" className=\"text-xs bg-green-50 text-green-700 border-green-200\">
                        Individual
                      </Badge>
                    )}
                    {!form.isPublic && !form.restrictToAgency && !form.restrictToIndividual && (
                      <Badge variant=\"outline\" className=\"text-xs bg-gray-50 text-gray-700 border-gray-200\">
                        Private
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className=\"flex items-center gap-1\">
                    <BarChart3 size={14} className=\"text-gray-400\" />
                    <span className=\"font-medium\">{form._count.submissions}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className=\"text-sm\">
                    {format(new Date(form.createdAt), 'MMM dd, yyyy')}
                  </div>
                  <div className=\"text-xs text-gray-500\">
                    {format(new Date(form.createdAt), 'h:mm a')}
                  </div>
                </TableCell>

                <TableCell className=\"text-right\">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant=\"ghost\" size=\"sm\">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align=\"end\" className=\"w-48\">
                      <DropdownMenuItem>
                        <Eye size={14} className=\"mr-2\" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 size={14} className=\"mr-2\" />
                        Edit Form
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 size={14} className=\"mr-2\" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {form.webhookUrl && (
                        <DropdownMenuItem onClick={() => handleCopyWebhookUrl(form.webhookUrl!)}>
                          <Copy size={14} className=\"mr-2\" />
                          Copy Webhook URL
                        </DropdownMenuItem>
                      )}
                      {form.workflowUrl && (
                        <DropdownMenuItem onClick={() => handleCopyWebhookUrl(form.workflowUrl!)}>
                          <ExternalLink size={14} className=\"mr-2\" />
                          Copy Workflow URL
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <ExternalLink size={14} className=\"mr-2\" />
                        Preview Form
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className=\"text-red-600\"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        <Trash2 size={14} className=\"mr-2\" />
                        Delete Form
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className=\"flex items-center justify-between pt-4\">
          <div className=\"text-sm text-gray-600 dark:text-gray-300\">
            Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} forms
          </div>
          
          <div className=\"flex gap-2\">
            <Button
              variant=\"outline\"
              size=\"sm\"
              disabled={pagination.offset === 0}
              onClick={() => onPageChange(Math.max(0, pagination.offset - pagination.limit))}
            >
              Previous
            </Button>
            <Button
              variant=\"outline\"
              size=\"sm\"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.offset + pagination.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy,
  Users,
  User,
  Calendar,
  BarChart3
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AutomationForm {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  webhookUrl?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  subAccountId?: string
  individualId?: string
  _count: {
    submissions: number
    automations: number
  }
  SubAccount?: {
    id: string
    name: string
  }
  Individual?: {
    id: string
    name: string
    email: string
  }
}

interface AutomationFormTableProps {
  forms: AutomationForm[]
  loading: boolean
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  onRefresh: () => void
  onPageChange: (offset: number) => void
}

export function AutomationFormTable({
  forms,
  loading,
  pagination,
  onRefresh,
  onPageChange
}: AutomationFormTableProps) {
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccountInfo = (form: AutomationForm) => {
    if (form.SubAccount) {
      return {
        type: 'Sub Account',
        name: form.SubAccount.name,
        icon: <Users size={14} className="text-blue-600" />
      }
    }
    if (form.Individual) {
      return {
        type: 'Individual',
        name: form.Individual.name,
        icon: <User size={14} className="text-green-600" />
      }
    }
    return {
      type: 'Unknown',
      name: 'N/A',
      icon: <User size={14} className="text-gray-400" />
    }
  }

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copied!',
      description: 'Webhook URL copied to clipboard'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading forms...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Name</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Automations</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No automation forms found
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => {
              const accountInfo = getAccountInfo(form)
              
              return (
                <TableRow key={form.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{form.name}</div>
                      {form.description && (
                        <div className="text-sm text-muted-foreground">
                          {form.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {accountInfo.icon}
                      <div>
                        <div className="font-medium">{accountInfo.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {accountInfo.type}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(form.status)}>
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span>{form._count.submissions}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>{form._count.automations}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {form.webhookUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyWebhookUrl(form.webhookUrl!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} forms
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.offset === 0}
              onClick={() => onPageChange(Math.max(0, pagination.offset - pagination.limit))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.offset + pagination.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
