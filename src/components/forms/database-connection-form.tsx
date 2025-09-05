'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, 
  Server, 
  Key, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Plug,
  Monitor,
  Cloud,
  Plus,
  Edit3,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DatabaseConnectionCardProps {
  funnelId: string
  subaccountId: string
}

interface DatabaseConnection {
  id: string
  name: string
  type: 'postgresql' | 'mysql' | 'mongodb' | 'firebase'
  host: string
  port: string
  database: string
  username: string
  status: 'connected' | 'disconnected' | 'testing'
  ssl: boolean
  createdAt: string
}

const DatabaseConnectionCard: React.FC<DatabaseConnectionCardProps> = ({ 
  funnelId, 
  subaccountId 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [connections, setConnections] = useState<DatabaseConnection[]>([
    {
      id: '1',
      name: 'Production Database',
      type: 'postgresql',
      host: 'localhost',
      port: '5432',
      database: 'funnel_data',
      username: 'admin',
      status: 'connected',
      ssl: true,
      createdAt: '2024-01-15'
    }
  ])

  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'postgresql' as const,
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: true
  })

  const [activeTab, setActiveTab] = useState('overview')

  const handleTestConnection = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Database connection test successful!')
    } catch (error) {
      toast.error('Failed to connect to database')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveConnection = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const connection: DatabaseConnection = {
        id: Date.now().toString(),
        ...newConnection,
        status: 'connected',
        createdAt: new Date().toISOString().split('T')[0]
      }

      setConnections(prev => [...prev, connection])
      setNewConnection({
        name: '',
        type: 'postgresql',
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
        ssl: true
      })
      
      toast.success('Database connection saved successfully!')
      setActiveTab('overview')
    } catch (error) {
      toast.error('Failed to save database connection')
    } finally {
      setIsLoading(false)
    }
  }

  const getDatabaseIcon = (type: string) => {
    switch (type) {
      case 'postgresql':
        return <Server className="h-4 w-4 text-blue-600" />
      case 'mysql':
        return <Database className="h-4 w-4 text-orange-600" />
      case 'mongodb':
        return <Monitor className="h-4 w-4 text-green-600" />
      case 'firebase':
        return <Cloud className="h-4 w-4 text-yellow-600" />
      default:
        return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'disconnected':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'testing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card className="flex-1 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Database Connections</CardTitle>
            <CardDescription>
              Manage database connections for dynamic content
            </CardDescription>
          </div>
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Active Connections</h4>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {connections.length} connection{connections.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {connections.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <Database className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No connections yet</h3>
                <p className="text-xs text-gray-500 mb-4">Add your first database connection to enable dynamic content</p>
                <Button onClick={() => setActiveTab('add')} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div 
                    key={connection.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getDatabaseIcon(connection.type)}
                        <div>
                          <h4 className="font-medium text-sm">{connection.name}</h4>
                          <p className="text-xs text-gray-500">{connection.host}:{connection.port}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(connection.status)}>
                          {connection.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {connection.status === 'disconnected' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {connection.status === 'testing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                          {connection.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Database:</span>
                        <span className="ml-2 font-medium">{connection.database}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">User:</span>
                        <span className="ml-2 font-medium">{connection.username}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Plug className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">New Database Connection</h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Connection Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Production DB"
                      value={newConnection.name}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Database Type</Label>
                    <Select 
                      value={newConnection.type} 
                      onValueChange={(value: any) => setNewConnection(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="firebase">Firebase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      placeholder="localhost"
                      value={newConnection.host}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, host: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      placeholder="5432"
                      value={newConnection.port}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, port: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="database">Database</Label>
                    <Input
                      id="database"
                      placeholder="database_name"
                      value={newConnection.database}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, database: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="username"
                      value={newConnection.username}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={newConnection.password}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ssl"
                    checked={newConnection.ssl}
                    onCheckedChange={(checked) => setNewConnection(prev => ({ ...prev, ssl: checked }))}
                  />
                  <Label htmlFor="ssl" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Enable SSL Connection
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleTestConnection}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  <Button
                    onClick={handleSaveConnection}
                    disabled={isLoading || !newConnection.name || !newConnection.host}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Save Connection
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Database Settings
              </h4>
              
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-sync Data</Label>
                    <p className="text-xs text-gray-500">Automatically sync funnel data with connected databases</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Real-time Updates</Label>
                    <p className="text-xs text-gray-500">Enable real-time data updates in preview mode</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Connection Pooling</Label>
                    <p className="text-xs text-gray-500">Use connection pooling for better performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default DatabaseConnectionCard