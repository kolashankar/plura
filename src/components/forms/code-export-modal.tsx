'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Download, FileCode, Smartphone, Globe, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CodeExportModalProps {
  isOpen: boolean
  onClose: () => void
  funnelId: string
  funnelName: string
}

const exportFormats = [
  {
    value: 'react',
    label: 'React (Next.js)',
    description: 'Production-ready Next.js application with TypeScript',
    icon: Globe,
  },
  {
    value: 'react-native',
    label: 'React Native',
    description: 'Mobile application for iOS and Android',
    icon: Smartphone,
  },
  {
    value: 'python',
    label: 'Python (Flask)',
    description: 'Backend application using Flask framework',
    icon: FileCode,
  },
]

export default function CodeExportModal({
  isOpen,
  onClose,
  funnelId,
  funnelName,
}: CodeExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isPremium: boolean
    plan: string
    canDownload: boolean
  } | null>(null)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)

  // Check subscription status when modal opens
  useEffect(() => {
    if (isOpen) {
      checkSubscriptionStatus()
    }
  }, [isOpen])

  const checkSubscriptionStatus = async () => {
    try {
      setIsCheckingSubscription(true)
      const response = await fetch('/api/check-premium')
      if (response.ok) {
        const status = await response.json()
        setSubscriptionStatus(status)
      } else {
        setSubscriptionStatus({
          isPremium: false,
          plan: 'free',
          canDownload: false
        })
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      setSubscriptionStatus({
        isPremium: false,
        plan: 'free',
        canDownload: false
      })
    } finally {
      setIsCheckingSubscription(false)
    }
  }

  const handleExport = async () => {
    if (!selectedFormat) {
      toast.error('Please select an export format')
      return
    }

    // Check if user can download
    if (!subscriptionStatus?.canDownload) {
      toast.error('Premium subscription required for code download')
      return
    }

    setIsExporting(true)
    
    try {
      const response = await fetch('/api/code/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funnelId,
          format: selectedFormat,
          language: 'typescript', // Default to TypeScript
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.requiresPremium) {
          toast.error('Premium subscription required for code download')
          return
        }
        throw new Error(error.error || 'Export failed')
      }

      // Download the zip file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${funnelName}-${selectedFormat}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Code exported successfully!')
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      toast.error(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const selectedFormatData = exportFormats.find(f => f.value === selectedFormat)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Export Funnel Code
          </DialogTitle>
          <DialogDescription>
            Export your funnel &quot;{funnelName}&quot; as a complete project in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isCheckingSubscription ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Checking subscription status...</p>
              </div>
            </div>
          ) : !subscriptionStatus?.canDownload ? (
            <div className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Premium Feature Required</p>
                    <p className="text-sm">
                      Code export is available for Basic and Unlimited Saas plans. 
                      You&apos;re currently on the {subscriptionStatus?.plan === 'free' ? 'Starter (Free)' : subscriptionStatus?.plan} plan.
                    </p>
                    <p className="text-sm">
                      Upgrade to a premium plan to download your funnel source code in multiple formats.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="rounded-lg border p-4 bg-muted/50 opacity-50">
                <h4 className="font-medium mb-2">What&apos;s included in premium:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete project structure</li>
                  <li>• All funnel pages and components</li>
                  <li>• Styling and responsive design</li>
                  <li>• Ready-to-deploy configuration</li>
                  <li>• Documentation and setup instructions</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button disabled className="flex-1 gap-2 opacity-50">
                  <Lock className="h-4 w-4" />
                  Requires Premium
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label htmlFor="format">Export Format</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    {exportFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <format.icon className="h-4 w-4" />
                          {format.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFormatData && (
                  <p className="text-sm text-muted-foreground">
                    {selectedFormatData.description}
                  </p>
                )}
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">What&apos;s included:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete project structure</li>
                  <li>• All funnel pages and components</li>
                  <li>• Styling and responsive design</li>
                  <li>• Ready-to-deploy configuration</li>
                  <li>• Documentation and setup instructions</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleExport} 
                  disabled={!selectedFormat || isExporting}
                  className="flex-1 gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export & Download'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}