
import AdminOverview from './_components/admin-overview'
import { getPlatformAnalytics } from '@/lib/queries'
import { db } from '@/lib/db'

const AdminDashboard = async () => {
  // Get recent analytics
  const analytics = await getPlatformAnalytics()
  
  // Get real-time stats
  const totalUsers = await db.user.count()
  const totalAgencies = await db.agency.count()
  const totalSubAccounts = await db.subAccount.count()
  const activeUsers = await db.user.count({
    where: {
      lastLoginAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  })

  const recentSignups = await db.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  })

  const pendingTickets = await db.supportTicket.count({
    where: {
      status: 'open'
    }
  })

  const stats = {
    totalUsers,
    totalAgencies,
    totalSubAccounts,
    activeUsers,
    recentSignups,
    pendingTickets
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform statistics and management
        </p>
      </div>
      
      <AdminOverview analytics={analytics} stats={stats} />
    </div>
  )
}

export default AdminDashboard
