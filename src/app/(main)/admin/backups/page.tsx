'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HardDrive,
  Plus,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  FileText,
  Settings
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

type Backup = {
  id: string
  name: string
  type: 'full' | 'incremental' | 'database' | 'files'
  status: 'completed' | 'running' | 'failed' | 'scheduled'
  size: number
  createdAt: string
  duration: number
  location: string
}

const BackupsPage = () => {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [backupProgress, setBackupProgress] = useState<{ [key: string]: number }>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockBackups: Backup[] = [
        {
          id: '1',
          name: 'Full System Backup',
          type: 'full',
          status: 'completed',
          size: 2048576000, // 2GB in bytes
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 1800, // 30 minutes in seconds
          location: 's3://plura-backups/full/2024-03-15'
        },
        {
          id: '2',
          name: 'Database Backup',
          type: 'database',
          status: 'completed',
          size: 512000000, // 512MB in bytes
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          duration: 300, // 5 minutes in seconds
          location: 's3://plura-backups/db/2024-03-15'
        },
        {
          id: '3',
          name: 'Incremental Backup',
          type: 'incremental',
          status: 'running',
          size: 0,
          createdAt: new Date().toISOString(),
          duration: 0,
          location: 's3://plura-backups/incremental/2024-03-15'
        }
      ]
      setBackups(mockBackups)
      
      // Simulate running backup progress
      setBackupProgress({ '3': 65 })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch backups',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const startBackup = async (type: string) => {
    try {
      const newBackup: Backup = {
        id: Date.now().toString(),
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Backup`,
        type: type as 'full' | 'incremental' | 'database' | 'files',
        status: 'running',
        size: 0,
        createdAt: new Date().toISOString(),
        duration: 0,
        location: `s3://plura-backups/${type}/${new Date().toISOString().split('T')[0]}`
      }
      
      setBackups([newBackup, ...backups])
      setBackupProgress({ [newBackup.id]: 0 })
      
      // Simulate backup progress
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          const currentProgress = prev[newBackup.id] || 0
          if (currentProgress >= 100) {
            clearInterval(progressInterval)
            setBackups(prevBackups => 
              prevBackups.map(backup => 
                backup.id === newBackup.id 
                  ? { ...backup, status: 'completed' as const, size: 1024000000, duration: 600 }
                  : backup
              )
            )
            return { ...prev, [newBackup.id]: 100 }
          }
          return { ...prev, [newBackup.id]: currentProgress + 10 }
        })
      }, 1000)
      
      toast({
        title: 'Success',
        description: `${type} backup started successfully`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start backup',
        variant: 'destructive'
      })
    }
  }

  const downloadBackup = async (backupId: string) => {
    try {
      // Mock download - in real implementation, generate signed URL
      toast({
        title: 'Download Started',
        description: 'Backup download will begin shortly'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download backup',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'running': return 'secondary'
      case 'failed': return 'destructive'
      case 'scheduled': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'scheduled': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup Management</h1>
          <p className="text-muted-foreground">Manage system backups and data recovery</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={fetchBackups} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Backup</DialogTitle>
                <DialogDescription>
                  Choose the type of backup to create
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4">
                <Button 
                  onClick={() => startBackup('full')}
                  className="justify-start h-auto p-4"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <HardDrive className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Full System Backup</div>
                      <div className="text-sm text-muted-foreground">
                        Complete backup of all system data and files
                      </div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => startBackup('database')}
                  className="justify-start h-auto p-4"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Database Backup</div>
                      <div className="text-sm text-muted-foreground">
                        Backup of all database content and structure
                      </div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => startBackup('incremental')}
                  className="justify-start h-auto p-4"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Incremental Backup</div>
                      <div className="text-sm text-muted-foreground">
                        Backup of changes since last backup
                      </div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => startBackup('files')}
                  className="justify-start h-auto p-4"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Files Backup</div>
                      <div className="text-sm text-muted-foreground">
                        Backup of user files and uploads
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Backups</p>
                <p className="text-2xl font-bold">{backups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Successful</p>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Running</p>
                <p className="text-2xl font-bold">
                  {backups.filter(b => b.status === 'running').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Total Size</p>
                <p className="text-2xl font-bold">
                  {formatBytes(backups.reduce((acc, backup) => acc + backup.size, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History ({backups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading backups...
                  </TableCell>
                </TableRow>
              ) : backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No backups found
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <HardDrive className="h-4 w-4 text-primary" />
                        <span className="font-medium">{backup.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        <Badge variant={getStatusColor(backup.status)}>
                          {backup.status}
                        </Badge>
                        {backup.status === 'running' && backupProgress[backup.id] !== undefined && (
                          <div className="ml-2 flex items-center gap-2">
                            <Progress value={backupProgress[backup.id]} className="w-20 h-2" />
                            <span className="text-xs">{backupProgress[backup.id]}%</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {backup.size > 0 ? formatBytes(backup.size) : '-'}
                    </TableCell>
                    <TableCell>
                      {backup.duration > 0 ? formatDuration(backup.duration) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {new Date(backup.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {backup.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadBackup(backup.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BackupsPage