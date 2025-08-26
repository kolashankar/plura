
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Deployment } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { MoreVertical, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'

type Props = {
  deployment: Deployment & {
    subAccount: {
      name: string
    }
  }
}

const DeploymentActions = ({ deployment }: Props) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleAction = async (action: string) => {
    try {
      const response = await fetch(`/api/deployments/deployment/${deployment.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Deployment ${action} initiated`,
        })
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || `Failed to ${action} deployment`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this deployment?')) {
      return
    }

    try {
      const response = await fetch(`/api/deployments/${deployment.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Deployment deleted successfully',
        })
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete deployment',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {deployment.url && (
          <DropdownMenuItem
            onClick={() => window.open(deployment.url!, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Site
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => handleAction('redeploy')}
          disabled={deployment.status === 'building'}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Redeploy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DeploymentActions
