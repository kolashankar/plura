
import React from 'react'

export default function IndividualAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}
