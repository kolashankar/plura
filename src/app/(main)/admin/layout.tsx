
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import AdminSidebar from './_components/admin-sidebar'
import AdminHeader from './_components/admin-header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  let adminSession;
  let adminUser;

  try {
    adminSession = await verifyAdminSession()
  } catch (error) {
    console.error('Admin session verification error:', error)
    redirect('/admin/sign-in')
  }

  if (!adminSession) {
    redirect('/admin/sign-in')
  }

  try {
    // Get admin user details
    adminUser = await db.user.findUnique({
      where: { id: adminSession.userId },
      include: { 
        AdminUser: true 
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    // Show a fallback UI instead of redirecting on database errors
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
          <p className="text-gray-600">Unable to connect to the database. Please try again later.</p>
        </div>
      </div>
    )
  }

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
