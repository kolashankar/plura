'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Eye, 
  Ban, 
  CheckCircle, 
  Building2, 
  Users,
  DollarSign,
  Calendar
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

type Agency = {
  id: string
  name: string
  companyEmail: string
  companyPhone: string
  isActive: boolean
  createdAt: string
  users: any[]
  SubAccount: any[]
  _count?: {
    users: number
    SubAccount: number
  }
}

const AgenciesTable = () => {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchAgencies()
  }, [searchTerm])

  const fetchAgencies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/agencies?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setAgencies(data.agencies)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch agencies',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleAgencyStatus = async (agencyId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/agencies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agencyId, 
          action: isActive ? 'suspend' : 'activate' 
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Agency ${isActive ? 'suspended' : 'activated'} successfully`
        })
        fetchAgencies()
      } else {
        throw new Error('Failed to update agency status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update agency status',
        variant: 'destructive'
      })
    }
  }

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.companyEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-agencies"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agencies ({filteredAgencies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Sub Accounts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading agencies...
                  </TableCell>
                </TableRow>
              ) : filteredAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No agencies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium" data-testid={`text-agency-name-${agency.id}`}>
                            {agency.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{agency.companyEmail}</div>
                        <div className="text-muted-foreground">{agency.companyPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{agency._count?.users || agency.users?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{agency._count?.SubAccount || agency.SubAccount?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={agency.isActive ? 'default' : 'destructive'}>
                        {agency.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(agency.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAgency(agency)}
                              data-testid={`button-view-agency-${agency.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Agency Details</DialogTitle>
                              <DialogDescription>
                                View detailed information about {agency.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedAgency && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="font-medium">Agency Name</label>
                                    <p className="text-muted-foreground">{selectedAgency.name}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Status</label>
                                    <p>
                                      <Badge variant={selectedAgency.isActive ? 'default' : 'destructive'}>
                                        {selectedAgency.isActive ? 'Active' : 'Suspended'}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Email</label>
                                    <p className="text-muted-foreground">{selectedAgency.companyEmail}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Phone</label>
                                    <p className="text-muted-foreground">{selectedAgency.companyPhone}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Users</label>
                                    <p className="text-muted-foreground">
                                      {selectedAgency._count?.users || selectedAgency.users?.length || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Sub Accounts</label>
                                    <p className="text-muted-foreground">
                                      {selectedAgency._count?.SubAccount || selectedAgency.SubAccount?.length || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Created</label>
                                    <p className="text-muted-foreground">
                                      {new Date(selectedAgency.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant={agency.isActive ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => toggleAgencyStatus(agency.id, agency.isActive)}
                          data-testid={`button-toggle-agency-${agency.id}`}
                        >
                          {agency.isActive ? (
                            <>
                              <Ban className="h-4 w-4 mr-1" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
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

export default AgenciesTable