
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Play, Pause, Settings, BarChart3 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface AutomationWidgetProps {
  automationId: string
  subAccountId: string
  type: 'social-media' | 'email' | 'ecommerce' | 'analytics'
  title: string
  description?: string
  showControls?: boolean
  embedUrl?: string
  className?: string
}

const AutomationWidget: React.FC<AutomationWidgetProps> = ({
  automationId,
  subAccountId,
  type,
  title,
  description,
  showControls = true,
  embedUrl,
  className = ''
}) => {
  const [isRunning, setIsRunning] = useState(false)
  const [lastExecution, setLastExecution] = useState<Date | null>(null)
  const [executionCount, setExecutionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch automation status on component mount
    fetchAutomationStatus()
  }, [automationId])

  const fetchAutomationStatus = async () => {
    try {
      const response = await fetch(`/api/automations/${automationId}/status?subAccountId=${subAccountId}`)
      const data = await response.json()
      
      setIsRunning(data.isRunning)
      setExecutionCount(data.executionCount)
      setLastExecution(data.lastExecution ? new Date(data.lastExecution) : null)
    } catch (error) {
      console.error('Failed to fetch automation status:', error)
    }
  }

  const toggleAutomation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/${automationId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subAccountId, action: isRunning ? 'pause' : 'start' })
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsRunning(!isRunning)
        setLastExecution(new Date())
        
        // Refresh status after toggle
        setTimeout(fetchAutomationStatus, 1000)
      } else {
        throw new Error('Failed to toggle automation')
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerManualExecution = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/automations/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: automationId,
          triggerData: { manual: true, timestamp: new Date() },
          subAccountId
        })
      })
      
      if (response.ok) {
        setExecutionCount(prev => prev + 1)
        setLastExecution(new Date())
      }
    } catch (error) {
      console.error('Failed to execute automation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openAutomationManager = () => {
    const managerUrl = embedUrl || `/subaccount/${subAccountId}/automations?workflow=${automationId}`
    window.open(managerUrl, '_blank')
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'social-media':
        return '📱'
      case 'email':
        return '📧'
      case 'ecommerce':
        return '🛒'
      case 'analytics':
        return '📊'
      default:
        return '⚡'
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'social-media':
        return 'bg-pink-500'
      case 'email':
        return 'bg-blue-500'
      case 'ecommerce':
        return 'bg-green-500'
      case 'analytics':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${getTypeColor()} flex items-center justify-center text-white text-sm`}>
              {getTypeIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm">{description}</CardDescription>
              )}
            </div>
          </div>
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Active" : "Paused"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Executions:</span>
            <div className="font-medium">{executionCount}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Run:</span>
            <div className="font-medium">
              {lastExecution ? lastExecution.toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isRunning ? "destructive" : "default"}
              onClick={toggleAutomation}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? '...' : isRunning ? (
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Execution</DialogTitle>
                  <DialogDescription>
                    Run this automation manually with current settings
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                  <Button onClick={triggerManualExecution} disabled={isLoading} className="w-full">
                    {isLoading ? 'Executing...' : 'Run Now'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" variant="outline" onClick={openAutomationManager}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Quick Metrics */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Success Rate: 98.5%</span>
            <span>Avg. Duration: 2.3s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AutomationWidget

// Export for use in website builder
export const AutomationWidgetConfig = {
  component: AutomationWidget,
  name: 'Automation Widget',
  category: 'automation',
  props: {
    automationId: { type: 'string', required: true },
    subAccountId: { type: 'string', required: true },
    type: { 
      type: 'select', 
      options: ['social-media', 'email', 'ecommerce', 'analytics'],
      default: 'social-media'
    },
    title: { type: 'string', default: 'Automation Widget' },
    description: { type: 'string', default: '' },
    showControls: { type: 'boolean', default: true },
    embedUrl: { type: 'string', default: '' }
  }
}
