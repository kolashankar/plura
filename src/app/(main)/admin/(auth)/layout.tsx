
import React from 'react'

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
  )
}
