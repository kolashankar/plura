'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import PurchasedThemesGrid from '@/components/marketplace/purchased-themes-grid'

const SubaccountThemesPage = () => {
  const params = useParams()
  const subaccountId = params.subaccountId as string

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Themes</h1>
        <p className="text-muted-foreground">
          Manage your purchased themes and import them to funnels
        </p>
      </div>

      <PurchasedThemesGrid subAccountId={subaccountId} showImportButton={true} />
    </div>
  )
}

export default SubaccountThemesPage