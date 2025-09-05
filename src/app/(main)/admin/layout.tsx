import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import AdminSidebar from './_components/admin-sidebar'
import AdminHeader from './_components/admin-header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminSession = await verifyAdminSession()

  if (!adminSession) {
    redirect('/admin/sign-in')
  }

  // Get admin user details
  const adminUser = await db.user.findUnique({
    where: { id: adminSession.userId },
    include: { AdminUser: true }
  })

  if (!adminUser?.AdminUser) {
    redirect('/admin/sign-in')
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar adminUser={adminUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader adminUser={adminUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
