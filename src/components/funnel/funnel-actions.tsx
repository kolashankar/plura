'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code } from 'lucide-react'
import { toast } from 'sonner'
import CodeExportModal from '@/components/forms/code-export-modal'
import { FunnelsForSubAccount } from '@/lib/types'

interface FunnelActionsProps {
  funnel: FunnelsForSubAccount
}

export default function FunnelActions({ funnel }: FunnelActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Only show export button for draft funnels
  if (funnel.published) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  const handleCodeExport = async () => {
    try {
      // Check if user has premium subscription
      const response = await fetch('/api/subscription/check-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId: funnel.SubAccount?.agencyId }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || 'Failed to check subscription')
        return
      }

      const { isPremium } = await response.json()
      
      if (!isPremium) {
        toast.error('Premium subscription required for code export feature. Please upgrade to Basic or Unlimited plan.')
        return
      }

      // Open code export modal
      setIsModalOpen(true)
      
    } catch (error) {
      toast.error('Failed to check subscription status')
      console.error(error)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCodeExport}
        className="h-8 w-8 p-0"
        title="Export Code"
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <CodeExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        funnelId={funnel.id}
        funnelName={funnel.name}
      />
    </>
  )
}