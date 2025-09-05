'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import PurchasedThemesGrid from '@/components/marketplace/purchased-themes-grid'

const AgencyThemesPage = () => {
  const params = useParams()
  const agencyId = params.agencyId as string

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Themes</h1>
        <p className="text-muted-foreground">
          Manage and download your purchased themes
        </p>
      </div>

      <PurchasedThemesGrid agencyId={agencyId} />
    </div>
  )
}

export default AgencyThemesPage