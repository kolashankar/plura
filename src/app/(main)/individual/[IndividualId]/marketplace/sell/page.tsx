'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import SellDashboard from '@/components/marketplace/sell-dashboard'

export default function SellPage() {
  const params = useParams()
  const subaccountId = params.subaccountId as string

  return <SellDashboard subAccountId={subaccountId} />
}