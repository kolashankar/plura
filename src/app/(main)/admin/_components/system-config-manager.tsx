
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings, 
  Database, 
  Shield, 
  Server, 
  Mail, 
  Bell,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface SystemConfig {
  id: string
  category: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description: string
  sensitive: boolean
  updatedAt: string
}

const SystemConfigManager = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingConfig, setEditingConfig] = useState<string | null>(null)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/system-config')
      if (response.ok) {
        const data = await response.json()
        setConfigs(data.configs || mockConfigs)
      } else {
        setConfigs(mockConfigs)
      }
    } catch (error) {
      console.error('Error fetching configs:', error)
      setConfigs(mockConfigs)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (configId: string, value: string) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/system-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId, value })
      })

      if (response.ok) {
        setConfigs(prev => prev.map(config => 
          config.id === configId 
            ? { ...config, value, updatedAt: new Date().toISOString() }
            : config
        ))
        toast.success('Configuration updated successfully')
        setEditingConfig(null)
      } else {
        toast.error('Failed to update configuration')
      }
    } catch (error) {
      toast.error('Error updating configuration')
    } finally {
      setSaving(false)
    }
  }

  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = []
    }
    acc[config.category].push(config)
    return acc
  }, {} as Record<string, SystemConfig[]>)

  const renderConfigValue = (config: SystemConfig) => {
    if (editingConfig === config.id) {
      return (
        <div className="flex gap-2">
          {config.type === 'boolean' ? (
            <Switch
              checked={config.value === 'true'}
              onCheckedChange={(checked) => updateConfig(config.id, checked.toString())}
            />
          ) : config.type === 'json' ? (
            <Textarea
              defaultValue={config.value}
              onBlur={(e) => updateConfig(config.id, e.target.value)}
              className="min-h-20"
            />
          ) : (
            <Input
              defaultValue={config.value}
              type={config.type === 'number' ? 'number' : 'text'}
              onBlur={(e) => updateConfig(config.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateConfig(config.id, e.currentTarget.value)
                }
              }}
            />
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingConfig(null)}
          >
            Cancel
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between">
        <span className={config.sensitive ? 'font-mono' : ''}>
          {config.sensitive ? '••••••••' : config.value}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditingConfig(config.id)}
        >
          Edit
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage system-wide settings and configurations
          </p>
        </div>
        <Button onClick={fetchConfigs} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          {Object.keys(groupedConfigs).map(category => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
          <TabsContent key={category} value={category.toLowerCase()}>
            <div className="grid gap-4">
              {categoryConfigs.map(config => (
                <Card key={config.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{config.key}</CardTitle>
                      <div className="flex items-center gap-2">
                        {config.sensitive && (
                          <Badge variant="secondary">
                            <Shield className="h-3 w-3 mr-1" />
                            Sensitive
                          </Badge>
                        )}
                        <Badge variant="outline">{config.type}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {renderConfigValue(config)}
                    <div className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date(config.updatedAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Mock data for development
const mockConfigs: SystemConfig[] = [
  {
    id: '1',
    category: 'General',
    key: 'APP_NAME',
    value: 'Plura',
    type: 'string',
    description: 'Application name displayed throughout the platform',
    sensitive: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    category: 'General',
    key: 'MAINTENANCE_MODE',
    value: 'false',
    type: 'boolean',
    description: 'Enable maintenance mode to prevent user access',
    sensitive: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    category: 'Database',
    key: 'DATABASE_URL',
    value: 'postgresql://...',
    type: 'string',
    description: 'Primary database connection string',
    sensitive: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    category: 'Email',
    key: 'SMTP_HOST',
    value: 'smtp.gmail.com',
    type: 'string',
    description: 'SMTP server hostname for email delivery',
    sensitive: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    category: 'Email',
    key: 'SMTP_PORT',
    value: '587',
    type: 'number',
    description: 'SMTP server port',
    sensitive: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    category: 'Security',
    key: 'JWT_SECRET',
    value: 'super-secret-key',
    type: 'string',
    description: 'Secret key for JWT token signing',
    sensitive: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    category: 'Security',
    key: 'RATE_LIMIT_REQUESTS',
    value: '100',
    type: 'number',
    description: 'Number of requests allowed per minute per IP',
    sensitive: false,
    updatedAt: new Date().toISOString()
  }
]

export default SystemConfigManager
