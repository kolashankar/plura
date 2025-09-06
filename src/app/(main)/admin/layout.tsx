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
    include: { 
      AdminUser: true 
    }
  })

  if (!adminUser?.AdminUser) {
    redirect('/admin/sign-in')
  }

  // Transform data to match component expectations
  const sidebarAdminUser = {
    id: adminUser.AdminUser.id,
    isSuperAdmin: adminUser.AdminUser.isSuperAdmin,
    permissions: adminUser.AdminUser.permissions
  }

  const headerAdminUser = {
    id: adminUser.AdminUser.id,
    isSuperAdmin: adminUser.AdminUser.isSuperAdmin,
    userId: adminUser.id,
    User: {
      name: adminUser.name,
      email: adminUser.email,
      avatarUrl: adminUser.avatarUrl || ''
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminUser={sidebarAdminUser} />
      <div className="flex-1 flex flex-col">
        <AdminHeader adminUser={headerAdminUser} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}