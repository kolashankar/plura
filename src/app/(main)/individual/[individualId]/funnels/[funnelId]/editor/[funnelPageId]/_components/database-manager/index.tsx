
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Database, Plus, Edit, Trash, Download, Upload, Server } from 'lucide-react'
import { toast } from 'sonner'

interface DatabaseConnection {
  id: string
  name: string
  type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'default'
  host?: string
  port?: number
  database?: string
  username?: string
  isConnected: boolean
  isDefault: boolean
  retentionDays?: number
}

interface TableSchema {
  name: string
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    primaryKey: boolean
  }>
  records: number
}

export default function DatabaseManager({ userPlan = 'free' }: { userPlan?: string }) {
  const [connections, setConnections] = useState<DatabaseConnection[]>([
    {
      id: 'default',
      name: 'Default Database',
      type: 'default',
      isConnected: true,
      isDefault: true,
      retentionDays: userPlan === 'free' ? 7 : userPlan === 'enterprise' ? -1 : 30
    }
  ])

  const [tables, setTables] = useState<TableSchema[]>([
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'email', type: 'VARCHAR(255)', nullable: false, primaryKey: false },
        { name: 'name', type: 'VARCHAR(255)', nullable: true, primaryKey: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false }
      ],
      records: 0
    },
    {
      name: 'form_submissions',
      columns: [
        { name: 'id', type: 'UUID', nullable: false, primaryKey: true },
        { name: 'form_name', type: 'VARCHAR(255)', nullable: false, primaryKey: false },
        { name: 'data', type: 'JSON', nullable: false, primaryKey: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false }
      ],
      records: 0
    }
  ])

  const [selectedConnection, setSelectedConnection] = useState<string>('default')
  const [newConnection, setNewConnection] = useState<Partial<DatabaseConnection>>({})
  const [isConnecting, setIsConnecting] = useState(false)

  const addConnection = async () => {
    if (!newConnection.name || !newConnection.type) {
      toast.error('Please fill in required fields')
      return
    }

    setIsConnecting(true)
    
    try {
      const response = await fetch('/api/database/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConnection)
      })

      if (response.ok) {
        const connection = await response.json()
        setConnections(prev => [...prev, { ...connection, isConnected: true }])
        setNewConnection({})
        toast.success('Database connected successfully!')
      } else {
        toast.error('Failed to connect to database')
      }
    } catch (error) {
      toast.error('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const testConnection = async (connectionId: string) => {
    try {
      const response = await fetch(`/api/database/${connectionId}/test`)
      const data = await response.json()
      
      if (data.success) {
        toast.success('Connection successful!')
      } else {
        toast.error('Connection failed')
      }
    } catch (error) {
      toast.error('Connection test failed')
    }
  }

  const exportData = async (tableName: string) => {
    try {
      const response = await fetch(`/api/database/${selectedConnection}/export/${tableName}`)
      const blob = await response.blob()
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tableName}_export.csv`
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const getDatabaseIcon = (type: string) => {
    const icons = {
      postgresql: '🐘',
      mysql: '🐬',
      mongodb: '🍃',
      sqlite: '🗃️',
      default: '💾'
    }
    return icons[type as keyof typeof icons] || '💾'
  }

  const getRetentionText = (days: number) => {
    if (days === -1) return 'Unlimited'
    if (days === 7) return '7 days (Free)'
    if (days === 30) return '30 days (Pro)'
    return `${days} days`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="w-4 h-4" />
          Database
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Database Manager</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="connections" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Database Connections</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Connection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Database Connection</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Connection Name</Label>
                      <Input
                        value={newConnection.name || ''}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My Production DB"
                      />
                    </div>
                    
                    <div>
                      <Label>Database Type</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={newConnection.type || ''}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, type: e.target.value as any }))}
                      >
                        <option value="">Select database type</option>
                        <option value="postgresql">PostgreSQL</option>
                        <option value="mysql">MySQL</option>
                        <option value="mongodb">MongoDB</option>
                        <option value="sqlite">SQLite</option>
                      </select>
                    </div>

                    {newConnection.type && newConnection.type !== 'sqlite' && (
                      <>
                        <div>
                          <Label>Host</Label>
                          <Input
                            value={newConnection.host || ''}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, host: e.target.value }))}
                            placeholder="localhost"
                          />
                        </div>
                        
                        <div>
                          <Label>Port</Label>
                          <Input
                            type="number"
                            value={newConnection.port || ''}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                            placeholder="5432"
                          />
                        </div>
                        
                        <div>
                          <Label>Database Name</Label>
                          <Input
                            value={newConnection.database || ''}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, database: e.target.value }))}
                            placeholder="my_database"
                          />
                        </div>
                        
                        <div>
                          <Label>Username</Label>
                          <Input
                            value={newConnection.username || ''}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="username"
                          />
                        </div>
                      </>
                    )}

                    <Button onClick={addConnection} disabled={isConnecting} className="w-full">
                      {isConnecting ? 'Connecting...' : 'Add Connection'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map(connection => (
                <Card key={connection.id} className={connection.id === selectedConnection ? 'border-blue-500' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getDatabaseIcon(connection.type)}</span>
                        <div>
                          <CardTitle className="text-base">{connection.name}</CardTitle>
                          <Badge variant={connection.isConnected ? 'default' : 'secondary'}>
                            {connection.isConnected ? 'Connected' : 'Disconnected'}
                          </Badge>
                          {connection.isDefault && (
                            <Badge variant="outline" className="ml-1">Default</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Type: <Badge variant="outline">{connection.type}</Badge></div>
                      {connection.retentionDays && (
                        <div>Retention: {getRetentionText(connection.retentionDays)}</div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedConnection(connection.id)}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testConnection(connection.id)}
                      >
                        Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Database Tables</h3>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Table
              </Button>
            </div>

            <div className="space-y-4">
              {tables.map(table => (
                <Card key={table.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{table.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge>{table.records} records</Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => exportData(table.name)}>
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2 mb-2">
                      <div>Column</div>
                      <div>Type</div>
                      <div>Nullable</div>
                      <div>Primary Key</div>
                    </div>
                    {table.columns.map(column => (
                      <div key={column.name} className="grid grid-cols-4 gap-2 text-sm py-1">
                        <div>{column.name}</div>
                        <div><Badge variant="outline">{column.type}</Badge></div>
                        <div>{column.nullable ? 'Yes' : 'No'}</div>
                        <div>{column.primaryKey ? '🔑' : ''}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Data Browser</h3>
              <p className="text-muted-foreground mb-4">
                Browse and manage your database records
              </p>
              <Button variant="outline">
                Open Data Browser
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-cleanup old data</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically delete data older than retention period
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div>
                  <Label>Current Plan Retention</Label>
                  <div className="text-sm text-muted-foreground">
                    {userPlan === 'free' && 'Free: 7 days retention'}
                    {userPlan === 'pro' && 'Pro: 30 days retention'}
                    {userPlan === 'enterprise' && 'Enterprise: Unlimited retention'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Create daily backups of your data
                    </p>
                  </div>
                  <Switch defaultChecked={userPlan !== 'free'} disabled={userPlan === 'free'} />
                </div>
                
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export All Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
