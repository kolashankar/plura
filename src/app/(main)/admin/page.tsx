
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, UserCheck, DollarSign, Activity, AlertTriangle } from 'lucide-react'

async function AdminDashboard() {
  const adminSession = await verifyAdminSession()
  
  if (!adminSession) {
    redirect('/admin/sign-in')
  }

  // Fetch basic stats
  const [
    totalUsers,
    totalAgencies,
    totalIndividuals,
    totalSubAccounts
  ] = await Promise.all([
    db.user.count(),
    db.agency.count(),
    db.individual.count(),
    db.subAccount.count()
  ])

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to the admin portal
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgencies}</div>
            <p className="text-xs text-muted-foreground">Active agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individuals</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIndividuals}</div>
            <p className="text-xs text-muted-foreground">Individual accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub Accounts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubAccounts}</div>
            <p className="text-xs text-muted-foreground">Sub accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor recent platform activity and user interactions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All systems operational. No critical issues detected.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access user management, analytics, and system configuration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard

// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { 
//   Users, 
//   Building2, 
//   DollarSign, 
//   TrendingUp, 
//   Activity, 
//   Settings,
//   ShoppingBag,
//   Zap,
//   BarChart3,
//   Mail,
//   Bot,
//   Layers,
//   Crown,
//   Target
// } from 'lucide-react'
// import Link from 'next/link'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// interface DashboardStats {
//   individuals: {
//     total: number
//     active: number
//     premium: number
//     growth: number
//   }
//   agencies: {
//     total: number
//     active: number
//     subaccounts: number
//     growth: number
//   }
//   revenue: {
//     monthly: number
//     total: number
//     growth: number
//   }
//   marketplace: {
//     totalProducts: number
//     activeProducts: number
//     totalSales: number
//   }
//   automations: {
//     totalForms: number
//     submissions: number
//     activeWorkflows: number
//   }
// }

// const AdminDashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [timeRange, setTimeRange] = useState('30d')

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`)
//       if (response.ok) {
//         const data = await response.json()
//         setStats(data)
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard stats:', error)
//       // Fallback to mock data for demo
//       setStats({
//         individuals: { total: 1247, active: 892, premium: 234, growth: 12 },
//         agencies: { total: 89, active: 76, subaccounts: 342, growth: 8 },
//         revenue: { monthly: 45680, total: 1234567, growth: 15 },
//         marketplace: { totalProducts: 156, activeProducts: 134, totalSales: 2890 },
//         automations: { totalForms: 1834, submissions: 12456, activeWorkflows: 567 }
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchDashboardStats()
//   }, [timeRange])

//   // Mock chart data for demonstration
//   const revenueData = [
//     { month: 'Jan', individuals: 2400, agencies: 4800 },
//     { month: 'Feb', individuals: 2800, agencies: 5200 },
//     { month: 'Mar', individuals: 3200, agencies: 5800 },
//     { month: 'Apr', individuals: 3600, agencies: 6400 },
//     { month: 'May', individuals: 4000, agencies: 7200 },
//     { month: 'Jun', individuals: 4400, agencies: 8000 },
//   ]

//   const userGrowthData = [
//     { month: 'Jan', individuals: 150, agencies: 45 },
//     { month: 'Feb', individuals: 180, agencies: 52 },
//     { month: 'Mar', individuals: 220, agencies: 58 },
//     { month: 'Apr', individuals: 260, agencies: 65 },
//     { month: 'May', individuals: 310, agencies: 72 },
//     { month: 'Jun', individuals: 380, agencies: 80 },
//   ]

//   if (loading || !stats) {
//     return (
//       <div className="space-y-6 p-6">
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 bg-gray-200 rounded w-64"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="h-32 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
//           <p className="text-gray-600 dark:text-gray-300 mt-2">
//             Comprehensive management for individuals, agencies, marketplace, and platform features
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" asChild>
//             <Link href="/admin/settings">
//               <Settings size={16} className="mr-2" />
//               Settings
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Quick Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Individual Users */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Individual Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.individuals.total.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600">+{stats.individuals.growth}%</span> from last month
//             </p>
//             <div className="flex gap-2 mt-2">
//               <Badge variant="outline" className="text-xs">
//                 {stats.individuals.active} active
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 {stats.individuals.premium} premium
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Agencies */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Agencies</CardTitle>
//             <Building2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.agencies.total.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600">+{stats.agencies.growth}%</span> from last month
//             </p>
//             <div className="flex gap-2 mt-2">
//               <Badge variant="outline" className="text-xs">
//                 {stats.agencies.active} active
//               </Badge>
//               <Badge variant="outline" className="text-xs">
//                 {stats.agencies.subaccounts} subaccounts
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Revenue */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${stats.revenue.monthly.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600">+{stats.revenue.growth}%</span> from last month
//             </p>
//             <div className="text-xs text-gray-500 mt-1">
//               Total: ${stats.revenue.total.toLocaleString()}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Marketplace */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
//             <ShoppingBag className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.marketplace.totalProducts}</div>
//             <p className="text-xs text-muted-foreground">
//               {stats.marketplace.activeProducts} active products
//             </p>
//             <div className="text-xs text-gray-500 mt-1">
//               {stats.marketplace.totalSales} total sales
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Management Sections */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Individual Management */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users size={20} />
//               Individual Account Management
//             </CardTitle>
//             <CardDescription>
//               Manage individual users, their plans, features, and marketplace access
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Button asChild className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/individuals">
//                   <Users size={24} className="mb-2" />
//                   <span className="font-medium">User Management</span>
//                   <span className="text-xs opacity-75">View and manage accounts</span>
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/individual-plans">
//                   <Crown size={24} className="mb-2" />
//                   <span className="font-medium">Plans & Pricing</span>
//                   <span className="text-xs opacity-75">Configure subscriptions</span>
//                 </Link>
//               </Button>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/individual-features">
//                   <Zap size={24} className="mb-2" />
//                   <span className="font-medium">Feature Toggles</span>
//                   <span className="text-xs opacity-75">AI Agent, Funnel Builder</span>
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/individual-marketplace">
//                   <ShoppingBag size={24} className="mb-2" />
//                   <span className="font-medium">Marketplace</span>
//                   <span className="text-xs opacity-75">Individual products</span>
//                 </Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Agency Management */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Building2 size={20} />
//               Agency Account Management
//             </CardTitle>
//             <CardDescription>
//               Manage agencies, subaccounts, enterprise features, and agency marketplace
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Button asChild className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/agencies">
//                   <Building2 size={24} className="mb-2" />
//                   <span className="font-medium">Agency Management</span>
//                   <span className="text-xs opacity-75">Agencies & subaccounts</span>
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/agency-plans">
//                   <Crown size={24} className="mb-2" />
//                   <span className="font-medium">Enterprise Plans</span>
//                   <span className="text-xs opacity-75">Agency pricing tiers</span>
//                 </Link>
//               </Button>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/agency-features">
//                   <Zap size={24} className="mb-2" />
//                   <span className="font-medium">Enterprise Features</span>
//                   <span className="text-xs opacity-75">Advanced capabilities</span>
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//                 <Link href="/admin/agency-marketplace">
//                   <ShoppingBag size={24} className="mb-2" />
//                   <span className="font-medium">Agency Marketplace</span>
//                   <span className="text-xs opacity-75">Enterprise solutions</span>
//                 </Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Feature Control Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* AI Agent Control */}
//         <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Agent Control</CardTitle>
//             <Bot className="h-4 w-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">Global Toggle</div>
//             <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
//               Enable/disable AI for any plan
//             </p>
//             <Button size="sm" className="mt-2 w-full" asChild>
//               <Link href="/admin/features/ai-agent">Manage AI Access</Link>
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Funnel Builder Control */}
//         <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Funnel Builder</CardTitle>
//             <Layers className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">Plan Control</div>
//             <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
//               Manage builder access by plan
//             </p>
//             <Button size="sm" className="mt-2 w-full" asChild>
//               <Link href="/admin/features/funnel-builder">Configure Access</Link>
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Automation Forms */}
//         <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Automation Forms</CardTitle>
//             <Mail className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.automations.totalForms}</div>
//             <p className="text-xs text-green-700 dark:text-green-300 mt-1">
//               {stats.automations.submissions} submissions
//             </p>
//             <Button size="sm" className="mt-2 w-full" asChild>
//               <Link href="/admin/automation-forms">View All Forms</Link>
//             </Button>
//           </CardContent>
//         </Card>

//         {/* System Health */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">System Health</CardTitle>
//             <Activity className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">98.5%</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Uptime last 30 days
//             </p>
//             <Button size="sm" className="mt-2 w-full" variant="outline" asChild>
//               <Link href="/admin/system-health">View Details</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <Tabs defaultValue="revenue" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
//           <TabsTrigger value="users">User Growth</TabsTrigger>
//           <TabsTrigger value="features">Feature Usage</TabsTrigger>
//         </TabsList>

//         <TabsContent value="revenue" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue by Account Type</CardTitle>
//                 <CardDescription>Monthly revenue comparison</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={revenueData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => [`$${value}`, '']} />
//                       <Bar dataKey="individuals" fill="#8884d8" name="Individuals" />
//                       <Bar dataKey="agencies" fill="#82ca9d" name="Agencies" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue Trends</CardTitle>
//                 <CardDescription>Growth over time</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={revenueData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => [`$${value}`, '']} />
//                       <Line type="monotone" dataKey="individuals" stroke="#8884d8" strokeWidth={2} name="Individuals" />
//                       <Line type="monotone" dataKey="agencies" stroke="#82ca9d" strokeWidth={2} name="Agencies" />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="users" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>User Growth</CardTitle>
//               <CardDescription>New registrations by account type</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={userGrowthData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="individuals" stroke="#8884d8" strokeWidth={2} name="Individual Users" />
//                     <Line type="monotone" dataKey="agencies" stroke="#82ca9d" strokeWidth={2} name="Agencies" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="features" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">AI Agent Usage</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold">78%</div>
//                 <p className="text-sm text-gray-600">of premium users active</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Funnel Builder</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold">92%</div>
//                 <p className="text-sm text-gray-600">feature adoption rate</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Automation Forms</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold">65%</div>
//                 <p className="text-sm text-gray-600">of users created forms</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Global Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Target size={20} />
//             Global Management
//           </CardTitle>
//           <CardDescription>
//             System-wide controls and shared resources for all account types
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//               <Link href="/admin/marketplace">
//                 <ShoppingBag size={24} className="mb-2" />
//                 <span className="font-medium">Global Marketplace</span>
//                 <span className="text-xs opacity-75">All products and sales</span>
//               </Link>
//             </Button>
//             <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//               <Link href="/admin/automation-forms">
//                 <Mail size={24} className="mb-2" />
//                 <span className="font-medium">All Automation Forms</span>
//                 <span className="text-xs opacity-75">Cross-platform forms</span>
//               </Link>
//             </Button>
//             <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//               <Link href="/admin/analytics">
//                 <BarChart3 size={24} className="mb-2" />
//                 <span className="font-medium">System Analytics</span>
//                 <span className="text-xs opacity-75">Platform insights</span>
//               </Link>
//             </Button>
//             <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
//               <Link href="/admin/settings">
//                 <Settings size={24} className="mb-2" />
//                 <span className="font-medium">Global Settings</span>
//                 <span className="text-xs opacity-75">System configuration</span>
//               </Link>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default AdminDashboard
