'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import SellDashboard from '@/components/marketplace/sell-dashboard'

export default function SellPage() {
  const params = useParams()
  const agencyId = params.agencyId as string

  return <SellDashboard agencyId={agencyId} />
}