import { Plus } from 'lucide-react'
import React from 'react'
import { db } from '@/lib/db'
import BlurPage from '@/components/global/blur-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CreateDeploymentModal from './_components/create-deployment-modal'
import DeploymentActions from './_components/deployment-actions'

type Props = {
  params: { subaccountId: string }
}

const DeploymentsPage = async ({ params }: Props) => {
  const deployments = await db.deployment.findMany({
    where: { subAccountId: params.subaccountId },
    orderBy: { createdAt: 'desc' },
    include: {
      subAccount: {
        select: { name: true }
      }
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500'
      case 'building':
        return 'bg-yellow-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <BlurPage>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Deployments</h1>
          <p className="text-muted-foreground">
            Manage your website deployments and hosting
          </p>
        </div>
        <CreateDeploymentModal subaccountId={params.subaccountId}>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New Deployment
          </Button>
        </CreateDeploymentModal>
      </div>

      {deployments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No deployments yet</CardTitle>
            <CardDescription>
              Create your first deployment to start hosting your websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateDeploymentModal subaccountId={params.subaccountId}>
              <Button>Create Deployment</Button>
            </CreateDeploymentModal>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {deployments.map((deployment) => (
            <Card key={deployment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {deployment.name}
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(deployment.status)} text-white`}
                      >
                        {deployment.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Type: {deployment.type} • Created: {new Date(deployment.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <DeploymentActions deployment={deployment} />
                </div>
              </CardHeader>
              <CardContent>
                {deployment.url && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Live URL:</p>
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {deployment.url}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last updated: {new Date(deployment.updatedAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </BlurPage>
  )
}

export default DeploymentsPage