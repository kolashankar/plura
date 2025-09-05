import { redirect } from 'next/navigation'

export default function UpgradePage({ 
  searchParams 
}: { 
  searchParams: { plan?: string } 
}) {
  // Redirect to premium page with plan parameter
  const planParam = searchParams.plan ? `?upgrade=${searchParams.plan}` : ''
  return redirect(`/billing${planParam}`)
}