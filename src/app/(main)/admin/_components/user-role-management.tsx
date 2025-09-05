'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Users,
  UserCog,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Settings,
  Building2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'suspended' | 'pending'
  lastLogin?: string
  createdAt: string
  profile: {
    phone?: string
    company?: string
    department?: string
  }
  permissions: string[]
  agency?: {
    id: string
    name: string
  }
  subAccounts: {
    id: string
    name: string
  }[]
  activityLog: {
    action: string
    timestamp: string
    details: string
  }[]
}

type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystemRole: boolean
  createdAt: string
}

const UserRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false)
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  const { toast } = useToast()

  // Available permissions
  const availablePermissions = [
    'manage_users',
    'manage_agencies',
    'manage_automation',
    'manage_marketplace',
    'manage_financial',
    'view_analytics',
    'manage_features',
    'manage_support',
    'manage_api',
    'manage_announcements',
    'view_audit_logs',
    'manage_backups',
    'manage_system',
    'manage_security',
    'manage_compliance',
    'manage_scalability',
    'manage_settings'
  ]

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await fetch(`/api/admin/user-management?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles')
      const data = await response.json()
      
      if (response.ok) {
        setRoles(data.roles || [])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch roles',
        variant: 'destructive'
      })
    }
  }

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/user-management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User status updated successfully'
        })
        fetchUsers()
      } else {
        throw new Error('Failed to update user status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      })
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/admin/user-management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User role updated successfully'
        })
        fetchUsers()
      } else {
        throw new Error('Failed to update user role')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      })
    }
  }

  const createRole = async (roleData: { name: string; description: string; permissions: string[] }) => {
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Role created successfully'
        })
        setShowCreateRoleDialog(false)
        fetchRoles()
      } else {
        throw new Error('Failed to create role')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create role',
        variant: 'destructive'
      })
    }
  }

  const deleteRole = async (roleId: string) => {
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Role deleted successfully'
        })
        fetchRoles()
      } else {
        throw new Error('Failed to delete role')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'suspended': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'destructive'
      case 'PLATFORM_ADMIN': return 'default'
      case 'AGENCY_OWNER': return 'secondary'
      case 'AGENCY_ADMIN': return 'outline'
      default: return 'secondary'
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.profile.company && user.profile.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Admin Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role.includes('ADMIN')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-users"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-role-filter">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
            <SelectItem value="AGENCY_OWNER">Agency Owner</SelectItem>
            <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setShowCreateUserDialog(true)} data-testid="button-create-user">
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Users and Roles Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="roles">Roles ({roles.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium" data-testid={`text-user-name-${user.id}`}>
                                {user.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                              {user.profile.company && (
                                <div className="text-xs text-muted-foreground">
                                  {user.profile.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.agency ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{user.agency.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No agency</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {user.lastLogin 
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : 'Never'
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                  data-testid={`button-view-user-${user.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
                                  <DialogDescription>
                                    Comprehensive user information and activity
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <Tabs defaultValue="profile" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                      <TabsTrigger value="profile">Profile</TabsTrigger>
                                      <TabsTrigger value="permissions">Permissions</TabsTrigger>
                                      <TabsTrigger value="activity">Activity</TabsTrigger>
                                      <TabsTrigger value="accounts">Accounts</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="profile" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                          <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Basic Information</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <span className="text-sm font-medium">Name:</span>
                                              <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium">Email:</span>
                                              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium">Role:</span>
                                              <Badge variant={getRoleColor(selectedUser.role)} className="ml-2">
                                                {selectedUser.role}
                                              </Badge>
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium">Status:</span>
                                              <Badge variant={getStatusColor(selectedUser.status)} className="ml-2">
                                                {selectedUser.status}
                                              </Badge>
                                            </div>
                                          </CardContent>
                                        </Card>
                                        
                                        <Card>
                                          <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Contact Information</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <Mail className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">{selectedUser.email}</span>
                                            </div>
                                            {selectedUser.profile.phone && (
                                              <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{selectedUser.profile.phone}</span>
                                              </div>
                                            )}
                                            {selectedUser.profile.company && (
                                              <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{selectedUser.profile.company}</span>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="permissions" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">User Permissions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-2">
                                            {availablePermissions.map((permission) => (
                                              <div key={permission} className="flex items-center gap-2">
                                                <Checkbox
                                                  checked={selectedUser.permissions.includes(permission)}
                                                  disabled
                                                />
                                                <span className="text-sm">{permission.replace(/_/g, ' ')}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    
                                    <TabsContent value="activity" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">Recent Activity</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {selectedUser.activityLog.map((activity, index) => (
                                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                  <p className="font-medium">{activity.action}</p>
                                                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                  {new Date(activity.timestamp).toLocaleString()}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    
                                    <TabsContent value="accounts" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">Sub-Accounts ({selectedUser.subAccounts.length})</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          {selectedUser.subAccounts.length > 0 ? (
                                            <div className="space-y-2">
                                              {selectedUser.subAccounts.map((account) => (
                                                <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                  <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    <span>{account.name}</span>
                                                  </div>
                                                  <Badge variant="outline">Active</Badge>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-muted-foreground">No sub-accounts found</p>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </Tabs>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Select onValueChange={(value) => updateUserStatus(user.id, value)}>
                              <SelectTrigger className="w-[120px]" data-testid={`select-user-status-${user.id}`}>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Select onValueChange={(value) => updateUserRole(user.id, value)}>
                              <SelectTrigger className="w-[140px]" data-testid={`select-user-role-${user.id}`}>
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AGENCY_OWNER">Agency Owner</SelectItem>
                                <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                                <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Role Management</h3>
            <Button onClick={() => setShowCreateRoleDialog(true)} data-testid="button-create-role">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <UserCog className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium" data-testid={`text-role-name-${role.id}`}>
                            {role.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {role.userCount} users
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {role.permissions.length} permissions
                            </span>
                            {role.isSystemRole && (
                              <Badge variant="outline" className="text-xs">
                                System Role
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRole(role)}
                            data-testid={`button-view-role-${role.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Role Details: {selectedRole?.name}</DialogTitle>
                            <DialogDescription>
                              Role permissions and user assignments
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRole && (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Permissions</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {selectedRole.permissions.map((permission) => (
                                    <div key={permission} className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-sm">{permission.replace(/_/g, ' ')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span>Users with this role:</span>
                                <span className="font-medium">{selectedRole.userCount}</span>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {!role.isSystemRole && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-edit-role-${role.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRole(role.id)}
                            data-testid={`button-delete-role-${role.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserRoleManagement