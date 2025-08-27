
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/queries'
import BlurPage from '@/components/global/blur-page'
import AdminSidebar from './_components/admin-sidebar'
import AdminHeader from './_components/admin-header'

type Props = {
  children: React.ReactNode
}

const AdminLayout = async ({ children }: Props) => {
  const user = await currentUser()
  
  if (!user) {
    return redirect('/sign-in')
  }

  const adminUser = await getAdminUser(user.id)
  
  if (!adminUser) {
    return redirect('/')
  }

  return (
    <div className="h-screen overflow-hidden flex">
      <AdminSidebar adminUser={adminUser} />
      <div className="flex-1 flex flex-col">
        <AdminHeader adminUser={adminUser} />
        <div className="flex-1 overflow-auto">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
