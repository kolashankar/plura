import IndividualDetails from '@/components/forms/individual-details'
import UserDetails from '@/components/forms/user-details'
import BlurPage from '@/components/global/blur-page'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
  params: { IndividualId: string }
}

const IndividualSettingPage = async ({ params }: Props) => {
  const authUser = await currentUser()
  if (!authUser) return
  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  })
  if (!userDetails) return

  const individual = await db.individual.findUnique({
    where: { id: params.IndividualId },
  })
  if (!individual) return

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <IndividualDetails
          details={individual}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="individual"
          id={params.IndividualId}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  )
}

export default IndividualSettingPage
