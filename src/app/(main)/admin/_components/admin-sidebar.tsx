
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  Flag, 
  HeadphonesIcon, 
  Shield,
  Database,
  Key,
  FileText,
  Megaphone,
  HardDrive,
  Activity,
  Zap,
  Package,
  Store,
  CreditCard,
  UserCog,
  Monitor,
  ShieldCheck,
  Scaling,
  User
} from 'lucide-react'

type Props = {
  adminUser: {
    id: string
    isSuperAdmin: boolean
    permissions: string
  }
}

const AdminSidebar = ({ adminUser }: Props) => {
  const pathname = usePathname()
  
  const permissions = JSON.parse(adminUser.permissions || '[]')
  
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      permission: null
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      permission: 'manage_users'
    },
    {
      name: 'Agencies',
      href: '/admin/agencies',
      icon: Building2,
      permission: 'manage_agencies'
    },
    {
      name: 'Individuals',
      href: '/admin/individuals',
      icon: User,
      permission: 'manage_users'
    },
    {
      name: 'Sub Accounts',
      href: '/admin/subaccounts',
      icon: Users,
      permission: 'manage_agencies'
    },
    {
      name: 'Automation',
      href: '/admin/automation',
      icon: Zap,
      permission: 'manage_automation'
    },
    {
      name: 'Themes & Plugins',
      href: '/admin/themes-plugins',
      icon: Package,
      permission: 'manage_marketplace'
    },
    {
      name: 'Marketplace',
      href: '/admin/marketplace',
      icon: Store,
      permission: 'manage_marketplace'
    },
    {
      name: 'Financial',
      href: '/admin/financial',
      icon: CreditCard,
      permission: 'manage_financial'
    },
    {
      name: 'Plan Management',
      href: '/admin/plan-management',
      icon: CreditCard,
      permission: 'manage_plans',
      superAdminOnly: true
    },
    {
      name: 'User Management',
      href: '/admin/user-management',
      icon: UserCog,
      permission: 'manage_users'
    },
    {
      name: 'Enhanced User Management',
      href: '/admin/enhanced-user-management',
      icon: Users,
      permission: 'manage_users',
      superAdminOnly: true
    },
    {
      name: 'System Monitor',
      href: '/admin/system-monitor',
      icon: Monitor,
      permission: 'view_analytics'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: Activity,
      permission: 'view_analytics'
    },
    {
      name: 'Feature Flags',
      href: '/admin/feature-flags',
      icon: Flag,
      permission: 'manage_features'
    },
    {
      name: 'Support',
      href: '/admin/support',
      icon: HeadphonesIcon,
      permission: 'manage_support'
    },
    {
      name: 'API Keys',
      href: '/admin/api-keys',
      icon: Key,
      permission: 'manage_api'
    },
    {
      name: 'Announcements',
      href: '/admin/announcements',
      icon: Megaphone,
      permission: 'manage_announcements'
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: FileText,
      permission: 'view_audit_logs'
    },
    {
      name: 'Backups',
      href: '/admin/backups',
      icon: HardDrive,
      permission: 'manage_backups'
    },
    {
      name: 'System Config',
      href: '/admin/system-config',
      icon: Database,
      permission: 'manage_system',
      superAdminOnly: true
    },
    {
      name: 'Security & Compliance',
      href: '/admin/security-compliance',
      icon: ShieldCheck,
      permission: 'manage_security',
      superAdminOnly: true
    },
    {
      name: 'Scalability',
      href: '/admin/scalability',
      icon: Scaling,
      permission: 'manage_scalability',
      superAdminOnly: true
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      permission: 'manage_settings'
    }
  ]

  const filteredItems = menuItems.filter(item => {
    if (item.superAdminOnly && !adminUser.isSuperAdmin) return false
    if (!item.permission) return true
    return adminUser.isSuperAdmin || permissions.includes(item.permission)
  })

  return (
    <div className="w-64 bg-background border-r border-border h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        {adminUser.isSuperAdmin && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Super Admin
          </span>
        )}
      </div>
      
      <nav className="mt-6">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-accent',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default AdminSidebar
