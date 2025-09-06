'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  EyeOff, 
  Monitor,
  Smartphone,
  Tablet,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Globe,
  Lock,
  Users,
  Zap
} from 'lucide-react'
import { useEditor } from '@/providers/editor/editor-provider'
import { cn } from '@/lib/utils'

type Props = {}

const PreviewTab = (props: Props) => {
  const { state, dispatch } = useEditor()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [previewUrl, setPreviewUrl] = useState('')
  const [seoPreview, setSeoPreview] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)
  const [accessibilityCheck, setAccessibilityCheck] = useState(false)
  const [deviceSimulation, setDeviceSimulation] = useState('desktop')
  const [networkThrottle, setNetworkThrottle] = useState('fast')

  const handlePreviewToggle = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    dispatch({ type: 'TOGGLE_LIVE_MODE' })
  }

  const handleDeviceChange = (device: string) => {
    setDeviceSimulation(device)
    dispatch({
      type: 'CHANGE_DEVICE',
      payload: { device: device as 'Desktop' | 'Tablet' | 'Mobile' },
    })
  }

  const handleRefresh = () => {
    // Refresh preview
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye size={20} />
            Preview Mode
          </CardTitle>
          <CardDescription>
            Test and preview your funnel page in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview Controls */}
          <div className="flex items-center justify-between">
            <Label htmlFor="preview-mode">Preview Mode</Label>
            <Switch
              id="preview-mode"
              checked={state.editor.previewMode}
              onCheckedChange={handlePreviewToggle}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handlePreviewToggle}
              variant={state.editor.previewMode ? "default" : "outline"}
              className="flex-1"
            >
              {state.editor.previewMode ? <Pause size={16} /> : <Play size={16} />}
              {state.editor.previewMode ? 'Exit Preview' : 'Start Preview'}
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw size={16} />
            </Button>
          </div>

          <Separator />

          {/* Device Simulation */}
          <div className="space-y-2">
            <Label>Device Simulation</Label>
            <Tabs value={deviceSimulation} onValueChange={handleDeviceChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Desktop" className="flex items-center gap-2">
                  <Monitor size={16} />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="Tablet" className="flex items-center gap-2">
                  <Tablet size={16} />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="Mobile" className="flex items-center gap-2">
                  <Smartphone size={16} />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Auto Refresh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            {autoRefresh && (
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Interval (seconds):</Label>
                <Input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-20"
                  min="1"
                  max="60"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Network Throttling */}
          <div className="space-y-2">
            <Label>Network Throttling</Label>
            <Select value={networkThrottle} onValueChange={setNetworkThrottle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast 3G</SelectItem>
                <SelectItem value="slow">Slow 3G</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="none">No Throttling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Preview Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings size={20} />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SEO Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <Label htmlFor="seo-preview">SEO Preview</Label>
            </div>
            <Switch
              id="seo-preview"
              checked={seoPreview}
              onCheckedChange={setSeoPreview}
            />
          </div>

          {/* Performance Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <Label htmlFor="performance-mode">Performance Mode</Label>
            </div>
            <Switch
              id="performance-mode"
              checked={performanceMode}
              onCheckedChange={setPerformanceMode}
            />
          </div>

          {/* Accessibility Check */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <Label htmlFor="accessibility-check">Accessibility Check</Label>
            </div>
            <Switch
              id="accessibility-check"
              checked={accessibilityCheck}
              onCheckedChange={setAccessibilityCheck}
            />
          </div>

          <Separator />

          {/* Preview URL */}
          <div className="space-y-2">
            <Label>Custom Preview URL</Label>
            <Input
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              placeholder="https://example.com/preview"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Preview Status:</span>
              <Badge variant={state.editor.previewMode ? "default" : "secondary"}>
                {state.editor.previewMode ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Device:</span>
              <Badge variant="outline">{state.editor.device}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Live Mode:</span>
              <Badge variant={state.editor.liveMode ? "default" : "secondary"}>
                {state.editor.liveMode ? "On" : "Off"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Label>Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Lock size={14} className="mr-1" />
            Test Security
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw size={14} className="mr-1" />
            Clear Cache
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PreviewTab