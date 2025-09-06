
import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function IndividualSignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  )
}
