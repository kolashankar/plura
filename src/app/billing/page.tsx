import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'

export default async function BillingPage({ 
  searchParams 
}: { 
  searchParams: { upgrade?: string } 
}) {
  const user = await currentUser()
  
  if (!user) {
    return redirect('/sign-in')
  }

  // Try to find user in Individual first
  const individual = await db.individual.findFirst({
    where: { 
      email: user.emailAddresses[0]?.emailAddress 
    }
  })

  if (individual) {
    const upgradeParam = searchParams.upgrade ? `?plan=${searchParams.upgrade}` : ''
    return redirect(`/Individual/${individual.id}/billing${upgradeParam}`)
  }

  // Try to find user in Agency
  const agency = await db.user.findUnique({
    where: { email: user.emailAddresses[0]?.emailAddress },
    include: { Agency: true }
  })

  if (agency?.Agency) {
    const upgradeParam = searchParams.upgrade ? `?plan=${searchParams.upgrade}` : ''
    return redirect(`/agency/${agency.Agency.id}/billing${upgradeParam}`)
  }

  // Default to Individual creation flow
  return redirect('/individual')
}