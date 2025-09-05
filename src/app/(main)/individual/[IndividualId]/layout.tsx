import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
  getAuthUserDetails,
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { IndividualId: string }
}

const IndividualLayout = async ({ children, params }: Props) => {
  const user = await currentUser()
  if (!user) {
    return redirect('/')
  }

  let notifications: any = []

  // For Individual accounts, we'll use different auth logic
  // Individual users don't need agency verification
  const userDetails = await getAuthUserDetails()
  if (!userDetails) {
    return <Unauthorized />
  }

  // Individual notifications (can be empty for now)
  notifications = []

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar
        id={params.IndividualId}
        type="individual"
      />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.IndividualId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
} 

export default IndividualLayout
