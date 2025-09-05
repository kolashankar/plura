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
  Mail,
  Play,
  Pause,
  Share
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
import { useToast } from '@/hooks/use-toast'

interface AutomationForm {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  webhookUrl?: string
  createdAt: string
  updatedAt: string
  _count: {
    submissions: number
    automations: number
  }
}

interface UserFormTableProps {
  forms: AutomationForm[]
  loading: boolean
  onRefresh: () => void
  subaccountId: string
}

export function UserFormTable({
  forms,
  loading,
  onRefresh,
  subaccountId
}: UserFormTableProps) {
  const { toast } = useToast()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const variants = {
      PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
      DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return variants[status as keyof typeof variants] || variants.DRAFT
  }

  const handleCopyWebhookUrl = async (webhookUrl: string) => {
    if (webhookUrl) {
      try {
        await navigator.clipboard.writeText(webhookUrl)
        toast({
          title: 'Copied!',
          description: 'Webhook URL copied to clipboard',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to copy webhook URL',
          variant: 'destructive'
        })
      }
    }
  }

  const handleToggleStatus = async (formId: string, currentStatus: string) => {
    try {
      setActionLoading(formId)
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      
      const response = await fetch(`/api/automation-forms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: `Form ${newStatus.toLowerCase()} successfully`,
        })
        onRefresh()
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update form status',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteForm = async (formId: string, formName: string) => {
    if (confirm(`Are you sure you want to delete \"${formName}\"? This action cannot be undone.`)) {
      try {
        setActionLoading(formId)
        const response = await fetch(`/api/automation-forms/${formId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          toast({
            title: 'Form Deleted',
            description: 'Form has been permanently deleted',
          })
          onRefresh()
        } else {
          throw new Error('Failed to delete form')
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete form',
          variant: 'destructive'
        })
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleShareForm = async (webhookUrl: string, formName: string) => {
    if (navigator.share && webhookUrl) {
      try {
        await navigator.share({
          title: `${formName} - Automation Form`,
          text: `Submit the ${formName} form`,
          url: webhookUrl
        })
      } catch (error) {
        // Fallback to copying URL
        handleCopyWebhookUrl(webhookUrl)
      }
    } else {
      handleCopyWebhookUrl(webhookUrl)
    }
  }

  if (loading) {
    return (
      <div className=\"space-y-4\">
        {[...Array(3)].map((_, i) => (
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
            No automation forms yet
          </h3>
          <p className=\"text-gray-600 dark:text-gray-300 mb-4\">
            Create your first automation form to start collecting submissions and triggering workflows.
          </p>
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
            <TableHead>Status</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Automations</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className=\"text-right\">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id} className=\"hover:bg-gray-50 dark:hover:bg-gray-800\">
              <TableCell>
                <div>
                  <div className=\"font-medium text-gray-900 dark:text-white\">
                    {form.name}
                  </div>
                  {form.description && (
                    <div className=\"text-sm text-gray-600 dark:text-gray-300 mt-1\">
                      {form.description.length > 60
                        ? `${form.description.substring(0, 60)}...`
                        : form.description
                      }
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <Badge className={getStatusBadge(form.status)}>
                  {form.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className=\"flex items-center gap-1\">
                  <BarChart3 size={14} className=\"text-gray-400\" />
                  <span className=\"font-medium\">{form._count.submissions}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className=\"flex items-center gap-1\">
                  <Mail size={14} className=\"text-gray-400\" />
                  <span className=\"font-medium\">{form._count.automations}</span>
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
                    <Button 
                      variant=\"ghost\" 
                      size=\"sm\" 
                      disabled={actionLoading === form.id}
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align=\"end\" className=\"w-56\">
                    <DropdownMenuItem onClick={() => window.open(`/forms/${form.id}/preview`, '_blank')}>
                      <Eye size={14} className=\"mr-2\" />
                      Preview Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`/forms/${form.id}/edit`, '_blank')}>
                      <Edit2 size={14} className=\"mr-2\" />
                      Edit Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`/forms/${form.id}/analytics`, '_blank')}>
                      <BarChart3 size={14} className=\"mr-2\" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {form.status === 'PUBLISHED' ? (
                      <DropdownMenuItem onClick={() => handleToggleStatus(form.id, form.status)}>
                        <Pause size={14} className=\"mr-2\" />
                        Unpublish Form
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleToggleStatus(form.id, form.status)}>
                        <Play size={14} className=\"mr-2\" />
                        Publish Form
                      </DropdownMenuItem>
                    )}
                    {form.webhookUrl && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCopyWebhookUrl(form.webhookUrl!)}>
                          <Copy size={14} className=\"mr-2\" />
                          Copy Form URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareForm(form.webhookUrl!, form.name)}>
                          <Share size={14} className=\"mr-2\" />
                          Share Form
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(form.webhookUrl!, '_blank')}>
                          <ExternalLink size={14} className=\"mr-2\" />
                          Open Form
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className=\"text-red-600\"
                      onClick={() => handleDeleteForm(form.id, form.name)}
                    >
                      <Trash2 size={14} className=\"mr-2\" />
                      Delete Form
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}