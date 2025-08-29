'use client'

import { useState } from 'react'
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
import { Download, FileCode, Smartphone, Globe } from 'lucide-react'
import { toast } from 'sonner'

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

  const handleExport = async () => {
    if (!selectedFormat) {
      toast.error('Please select an export format')
      return
    }

    setIsExporting(true)
    
    try {
      const response = await fetch('/api/funnel/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funnelId,
          format: selectedFormat,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Export failed')
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
        </div>
      </DialogContent>
    </Dialog>
  )
}