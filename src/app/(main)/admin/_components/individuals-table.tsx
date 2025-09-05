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
  User, 
  DollarSign,
  Calendar,
  Settings
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

type Individual = {
  id: string
  name: string
  email: string
  companyEmail: string
  companyPhone: string
  isActive: boolean
  plan: string
  createdAt: string
  _count?: {
    Funnels: number
    Media: number
    Contact: number
  }
}

const IndividualsTable = () => {
  const [individuals, setIndividuals] = useState<Individual[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndividual, setSelectedIndividual] = useState<Individual | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchIndividuals()
  }, [searchTerm])

  const fetchIndividuals = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/individuals?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setIndividuals(data.individuals)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch individuals',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleIndividualStatus = async (individualId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/individuals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          individualId, 
          action: isActive ? 'suspend' : 'activate' 
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Individual ${isActive ? 'suspended' : 'activated'} successfully`
        })
        fetchIndividuals()
      } else {
        throw new Error('Failed to update individual status')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update individual status',
        variant: 'destructive'
      })
    }
  }

  const updateIndividualPlan = async (individualId: string, newPlan: string) => {
    try {
      const response = await fetch('/api/admin/individuals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          individualId, 
          action: 'updatePlan',
          plan: newPlan
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Plan updated successfully'
        })
        fetchIndividuals()
      } else {
        throw new Error('Failed to update plan')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update plan',
        variant: 'destructive'
      })
    }
  }

  const filteredIndividuals = individuals.filter(individual =>
    individual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    individual.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    individual.companyEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'starter': return 'outline'
      case 'pro': return 'default'
      case 'unlimited': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search individuals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-individuals"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Individual Accounts ({filteredIndividuals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Individual</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading individuals...
                  </TableCell>
                </TableRow>
              ) : filteredIndividuals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No individuals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredIndividuals.map((individual) => (
                  <TableRow key={individual.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium" data-testid={`text-individual-name-${individual.id}`}>
                            {individual.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{individual.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{individual.companyEmail}</div>
                        <div className="text-muted-foreground">{individual.companyPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={individual.plan}
                        onValueChange={(newPlan) => updateIndividualPlan(individual.id, newPlan)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge variant={getPlanBadgeVariant(individual.plan)}>
                              {individual.plan}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STARTER">Starter</SelectItem>
                          <SelectItem value="PRO">Pro</SelectItem>
                          <SelectItem value="UNLIMITED">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>Funnels: {individual._count?.Funnels || 0}</div>
                        <div>Media: {individual._count?.Media || 0}</div>
                        <div>Contacts: {individual._count?.Contact || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={individual.isActive ? 'default' : 'destructive'}>
                        {individual.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(individual.createdAt).toLocaleDateString()}
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
                              onClick={() => setSelectedIndividual(individual)}
                              data-testid={`button-view-individual-${individual.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Individual Account Details</DialogTitle>
                              <DialogDescription>
                                View detailed information about {individual.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedIndividual && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="font-medium">Name</label>
                                    <p className="text-muted-foreground">{selectedIndividual.name}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Status</label>
                                    <p>
                                      <Badge variant={selectedIndividual.isActive ? 'default' : 'destructive'}>
                                        {selectedIndividual.isActive ? 'Active' : 'Suspended'}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Plan</label>
                                    <p>
                                      <Badge variant={getPlanBadgeVariant(selectedIndividual.plan)}>
                                        {selectedIndividual.plan}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Email</label>
                                    <p className="text-muted-foreground">{selectedIndividual.email}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Company Email</label>
                                    <p className="text-muted-foreground">{selectedIndividual.companyEmail}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Phone</label>
                                    <p className="text-muted-foreground">{selectedIndividual.companyPhone}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Funnels</label>
                                    <p className="text-muted-foreground">
                                      {selectedIndividual._count?.Funnels || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Media Files</label>
                                    <p className="text-muted-foreground">
                                      {selectedIndividual._count?.Media || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Contacts</label>
                                    <p className="text-muted-foreground">
                                      {selectedIndividual._count?.Contact || 0}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Created</label>
                                    <p className="text-muted-foreground">
                                      {new Date(selectedIndividual.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant={individual.isActive ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => toggleIndividualStatus(individual.id, individual.isActive)}
                          data-testid={`button-toggle-individual-${individual.id}`}
                        >
                          {individual.isActive ? (
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

export default IndividualsTable