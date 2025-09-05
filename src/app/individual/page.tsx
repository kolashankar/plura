import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export default async function IndividualRedirectPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/agency/sign-in')
  }

  // Check if user has an individual account or create one
  let individual = await db.user.findUnique({
    where: { email: user.emailAddresses[0]?.emailAddress },
  })

  if (!individual) {
    // Create individual user record
    individual = await db.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress || '',
        avatarUrl: user.imageUrl,
        role: 'INDIVIDUAL_USER',
      },
    })
  }

  // Redirect to individual dashboard
  redirect(`/Individual/${individual.id}`)
}